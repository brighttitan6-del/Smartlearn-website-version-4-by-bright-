import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_LESSONS, CATEGORIES } from '../services/mockData';
import { Lesson } from '../types';
import { AITutor } from '../components/AITutor';
import { generateLessonSummary } from '../services/geminiService';

export const Lessons: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [summary, setSummary] = useState<string>('');

  const lessonId = searchParams.get('id');

  useEffect(() => {
    if (lessonId) {
      const found = MOCK_LESSONS.find(l => l.id === lessonId);
      if (found) {
        setSelectedLesson(found);
        window.scrollTo(0, 0);
        // Generate AI summary on load
        generateLessonSummary(found.title, found.description).then(setSummary);
      }
    } else {
      setSelectedLesson(null);
    }
  }, [lessonId]);

  const filteredLessons = MOCK_LESSONS.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === 'All' || l.category === filterCat;
    return matchesSearch && matchesCat;
  });

  if (selectedLesson) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => setSearchParams({})} className="mb-6 flex items-center text-slate-500 hover:text-primary-600 transition-colors">
            ← Back to all lessons
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-black rounded-xl overflow-hidden shadow-xl aspect-video">
                <iframe 
                  src={selectedLesson.videoUrl} 
                  title={selectedLesson.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{selectedLesson.title}</h1>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                  <span className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 px-2 py-1 rounded-md text-xs font-medium">
                    {selectedLesson.category}
                  </span>
                  <span>{selectedLesson.instructorName}</span>
                  <span>{selectedLesson.duration}</span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 mb-6">
                  <h3 className="font-semibold text-lg mb-2 dark:text-white">About this lesson</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{selectedLesson.description}</p>
                  
                  <div className="p-4 bg-primary-50 dark:bg-slate-800 rounded-lg border border-primary-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🤖</span>
                      <span className="font-semibold text-sm uppercase tracking-wider text-primary-700 dark:text-primary-400">AI Generated Summary</span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">{summary || 'Generating summary...'}</p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <a href={selectedLesson.notesUrl} className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      Download Lesson Notes
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <AITutor context={`Title: ${selectedLesson.title}. Description: ${selectedLesson.description}`} />
              
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Up Next</h3>
                <div className="space-y-4">
                  {MOCK_LESSONS.filter(l => l.id !== selectedLesson.id).slice(0, 3).map(next => (
                    <button 
                      key={next.id} 
                      onClick={() => setSearchParams({ id: next.id })}
                      className="flex gap-3 w-full text-left group hover:bg-slate-50 dark:hover:bg-slate-800 p-2 -mx-2 rounded-lg transition-colors"
                    >
                      <div className="relative w-24 flex-shrink-0 aspect-video rounded-md overflow-hidden">
                         <img src={next.thumbnail} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2 group-hover:text-primary-600">{next.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{next.duration}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">All Lessons</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <input 
               type="text" 
               placeholder="Search lessons..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
             />
             <select 
               value={filterCat}
               onChange={(e) => setFilterCat(e.target.value)}
               className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
             >
               <option value="All">All Categories</option>
               {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
             </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLessons.map(lesson => (
            <button 
              key={lesson.id} 
              onClick={() => setSearchParams({ id: lesson.id })}
              className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-left transition-all hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700"
            >
              <div className="aspect-video overflow-hidden relative">
                <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                   <div className="bg-white/90 rounded-full p-3 text-primary-600">
                     <svg className="w-6 h-6 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                   </div>
                 </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-primary-600 font-semibold mb-1">{lesson.category}</div>
                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">{lesson.title}</h3>
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                   <span>{lesson.instructorName}</span>
                   <span>{lesson.duration}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {filteredLessons.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No lessons found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};