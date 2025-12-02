import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, MOCK_LESSONS, UPCOMING_LIVE_SESSIONS } from '../services/mockData';
import { UserRole } from '../types';
import { Navigate, Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'upload'>('overview');
  // Teacher specific state
  const [teacherTab, setTeacherTab] = useState<'overview' | 'courses' | 'live' | 'students'>('overview');
  // Student specific state
  const [studentTab, setStudentTab] = useState<'overview' | 'schedule'>('overview');
  
  const [selectedUploadSubject, setSelectedUploadSubject] = useState<string | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);

  if (!user) return <Navigate to="/login" />;

  const isTeacher = user.role === UserRole.TEACHER;

  // --- TEACHER COMPONENTS ---

  const TeacherOverview = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Total Students</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2">1,248</div>
          <div className="text-green-500 text-sm mt-1">↑ 12% this month</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Total Lessons</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{MOCK_LESSONS.filter(l => l.instructorName === user.name).length + 15}</div>
          <div className="text-slate-400 text-sm mt-1">Across 4 subjects</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Upcoming Lives</div>
          <div className="text-3xl font-bold text-primary-600 mt-2">
            {UPCOMING_LIVE_SESSIONS.filter(s => s.instructorName === user.name).length}
          </div>
          <div className="text-slate-400 text-sm mt-1">Next: Tomorrow, 2PM</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Avg. Rating</div>
          <div className="text-3xl font-bold text-amber-500 mt-2">4.8 ★</div>
          <div className="text-slate-400 text-sm mt-1">From 340 reviews</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">JS</div>
                <div>
                  <p className="text-sm text-slate-800 dark:text-slate-200"><span className="font-bold">John Student</span> completed "Algebra Basics"</p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setTeacherTab('courses')} className="p-4 rounded-lg bg-primary-50 dark:bg-slate-800 text-primary-700 dark:text-primary-400 hover:bg-primary-100 transition-colors text-left">
                    <div className="font-bold">Upload Lesson</div>
                    <div className="text-xs opacity-70">Add new content</div>
                </button>
                <button onClick={() => setTeacherTab('live')} className="p-4 rounded-lg bg-secondary-50 dark:bg-slate-800 text-secondary-700 dark:text-secondary-400 hover:bg-secondary-100 transition-colors text-left">
                    <div className="font-bold">Schedule Live</div>
                    <div className="text-xs opacity-70">Create event</div>
                </button>
            </div>
        </div>
      </div>
    </div>
  );

  const TeacherCourses = () => (
    <div className="space-y-6 animate-fade-in">
      {!selectedUploadSubject ? (
        <>
             <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Courses</h2>
             </div>
             
             {/* Upload Grid */}
             <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Upload New Content</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Select a subject panel to upload a new lesson.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIES.map((cat) => (
                    <button
                    key={cat.id}
                    onClick={() => setSelectedUploadSubject(cat.name)}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-primary-500 hover:shadow-md transition-all text-center flex flex-col items-center justify-center gap-2 group"
                    >
                    <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                    <span className="font-medium text-sm text-slate-700 dark:text-slate-200">{cat.name}</span>
                    </button>
                ))}
                </div>
            </div>

            {/* Existing Lessons List */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Lesson Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Grade</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                        {MOCK_LESSONS.map((lesson) => (
                            <tr key={lesson.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <img className="h-10 w-10 rounded object-cover" src={lesson.thumbnail} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{lesson.title}</div>
                                            <div className="text-sm text-slate-500">{lesson.duration}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{lesson.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{lesson.gradeLevel}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-primary-600 hover:text-primary-900 mr-3">Edit</button>
                                    <button className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
      ) : (
        // Upload Form
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 animate-fade-in">
            <button 
            onClick={() => setSelectedUploadSubject(null)}
            className="mb-4 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
            ← Back to Subject Selection
            </button>
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
            Upload to {selectedUploadSubject} Panel
            </h2>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Video uploaded successfully!'); setSelectedUploadSubject(null); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lesson Title</label>
                    <input type="text" required className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 dark:text-white" placeholder="e.g. Introduction to Photosynthesis" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Grade</label>
                    <select className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 dark:text-white">
                        <option>Form 1</option>
                        <option>Form 2</option>
                        <option>Form 3</option>
                        <option>Form 4</option>
                        <option>Form 5</option>
                        <option>Form 6</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Internal Video ID / Source</label>
                <input type="text" required className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 dark:text-white" placeholder="Paste internal resource ID or file path" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description & Notes</label>
                <textarea className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 dark:text-white" rows={4} placeholder="What will students learn?"></textarea>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="font-medium text-sm mb-2 text-slate-700 dark:text-slate-300">Teacher Verification</h4>
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="approve" required className="w-4 h-4 text-primary-600 rounded" />
                    <label htmlFor="approve" className="text-sm text-slate-600 dark:text-slate-400">
                    I confirm this content is appropriate for the selected grade and subject.
                    </label>
                </div>
            </div>
            <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-bold shadow-lg shadow-primary-600/20">
                Upload Video
            </button>
            </form>
        </div>
      )}
    </div>
  );

  const TeacherLive = () => (
    <div className="space-y-6 animate-fade-in">
         <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Live Sessions Management</h2>
            <button onClick={() => setIsScheduling(!isScheduling)} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-bold">
                {isScheduling ? 'Cancel Scheduling' : '+ Schedule New Session'}
            </button>
         </div>

         {isScheduling && (
             <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                 <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Schedule a Live Class</h3>
                 <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Class Scheduled!'); setIsScheduling(false); }}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Topic / Title</label>
                            <input type="text" required className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price (MWK)</label>
                            <input type="number" required defaultValue={500} className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date & Time</label>
                            <input type="datetime-local" required className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Thumbnail URL</label>
                            <input type="url" placeholder="https://..." className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
                        </div>
                     </div>
                     <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 w-full md:w-auto">
                         Publish Schedule
                     </button>
                 </form>
             </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {UPCOMING_LIVE_SESSIONS.map(session => (
                 <div key={session.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex gap-4 items-center">
                     <img src={session.thumbnail} alt="" className="w-24 h-16 object-cover rounded-lg" />
                     <div>
                         <h4 className="font-bold text-slate-900 dark:text-white">{session.title}</h4>
                         <p className="text-xs text-slate-500">{new Date(session.startTime).toLocaleString()}</p>
                         <div className="flex items-center gap-2 mt-1">
                             <span className={`text-xs px-2 py-0.5 rounded ${session.isLive ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                                 {session.isLive ? 'LIVE NOW' : 'Scheduled'}
                             </span>
                             <span className="text-xs font-mono text-primary-600">MWK {session.price}</span>
                         </div>
                     </div>
                     <div className="ml-auto flex flex-col gap-2">
                         <button className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 p-2 rounded">Edit</button>
                     </div>
                 </div>
             ))}
         </div>
    </div>
  );

  const TeacherStudents = () => (
      <div className="space-y-6 animate-fade-in">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Student Progress</h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Student Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Course Focus</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Progress</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Last Active</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                    {[1,2,3,4,5].map((i) => (
                        <tr key={i}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">Student {i}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">Mathematics (Form 4)</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                        <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${Math.random() * 100}%` }}></div>
                                    </div>
                                    <span className="text-xs text-slate-500">{(Math.random() * 100).toFixed(0)}%</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">2 days ago</td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
      </div>
  );

  // --- STUDENT COMPONENTS (Existing) ---
  const StudentView = () => (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2">
               <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                 <h3 className="font-bold text-lg">Subscription Status</h3>
                 <span className={`inline-block px-3 py-1 rounded-full text-sm font-mono mt-1 font-bold ${user.subscriptionStatus === 'ACTIVE' ? 'bg-green-400/30 text-green-100' : 'bg-red-400/30 text-red-100'}`}>
                   {user.subscriptionStatus}
                 </span>
              </div>
              <Link to="/payment" className="bg-white text-primary-700 hover:bg-primary-50 px-4 py-2 rounded-lg font-bold text-sm shadow transition-colors">
                {user.subscriptionStatus === 'ACTIVE' ? 'Extend Plan' : 'Upgrade Now'}
              </Link>
            </div>
            <div className="relative z-10">
               <p className="text-primary-100">
                  Current Plan: <span className="font-bold text-white">{user.currentPlan || 'None'}</span>
              </p>
              <p className="text-sm mt-1 text-primary-200">
                  Expires: {user.subscriptionExpiry ? new Date(user.subscriptionExpiry).toDateString() : 'N/A'}
              </p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-1">85%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Overall Completion</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="text-4xl font-bold text-secondary-600 dark:text-secondary-400 mb-1">12</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Lessons Completed</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-1">{user.purchasedBooks?.length || 0}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Books Owned</div>
          </div>
        </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary-100 dark:border-slate-700" />
              <h2 className="font-bold text-xl text-slate-900 dark:text-white">{user.name}</h2>
              <p className="text-sm text-primary-600 dark:text-primary-400 font-medium uppercase tracking-wide mb-6">{user.role}</p>
              
              <div className="flex flex-col gap-2 text-left">
                {isTeacher ? (
                    <>
                        <button onClick={() => setTeacherTab('overview')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${teacherTab === 'overview' ? 'bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>Overview</button>
                        <button onClick={() => setTeacherTab('courses')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${teacherTab === 'courses' ? 'bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>My Courses</button>
                        <button onClick={() => setTeacherTab('live')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${teacherTab === 'live' ? 'bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>Live Schedule</button>
                        <button onClick={() => setTeacherTab('students')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${teacherTab === 'students' ? 'bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>Students</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setStudentTab('overview')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${studentTab === 'overview' ? 'bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>Overview</button>
                        <button onClick={() => setStudentTab('schedule')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${studentTab === 'schedule' ? 'bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>My Schedule</button>
                    </>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
               <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                 {isTeacher ? (
                     teacherTab === 'overview' ? 'Dashboard Overview' : 
                     teacherTab === 'courses' ? 'Course Management' : 
                     teacherTab === 'live' ? 'Live Sessions' : 'Student Progress'
                 ) : (
                     studentTab === 'overview' ? 'My Progress' : 'Class Schedule'
                 )}
               </h1>
            </div>

            {isTeacher ? (
                <>
                    {teacherTab === 'overview' && <TeacherOverview />}
                    {teacherTab === 'courses' && <TeacherCourses />}
                    {teacherTab === 'live' && <TeacherLive />}
                    {teacherTab === 'students' && <TeacherStudents />}
                </>
            ) : (
                <>
                    {studentTab === 'overview' && <StudentView />}
                    {studentTab === 'schedule' && (
                         <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                           <p className="text-slate-500 italic">No upcoming personal schedule items.</p>
                         </div>
                    )}
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};