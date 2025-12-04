import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, MOCK_LESSONS, UPCOMING_LIVE_SESSIONS, MOCK_USERS, MOCK_BOOKS } from '../services/mockData';
import { UserRole, User, Lesson, Book, LiveSession } from '../types';
import { Navigate, Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // --- STATE FOR ADMIN DASHBOARD ---
  const [adminTab, setAdminTab] = useState('overview');
  const [adminUsers, setAdminUsers] = useState<User[]>(MOCK_USERS);
  const [adminLessons, setAdminLessons] = useState<Lesson[]>(MOCK_LESSONS);

  // --- STATE FOR TEACHER DASHBOARD ---
  const [teacherTab, setTeacherTab] = useState('overview');
  const [selectedUploadSubject, setSelectedUploadSubject] = useState<string | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [localLiveSessions, setLocalLiveSessions] = useState<LiveSession[]>(UPCOMING_LIVE_SESSIONS);
  
  // Teacher Edit State
  const [editingSession, setEditingSession] = useState<LiveSession | null>(null);
  const [sessionForm, setSessionForm] = useState({
      title: '',
      price: 500,
      startTime: '',
      thumbnail: ''
  });

  if (!user) return <Navigate to="/login" />;

  // --- HANDLERS (Teacher) ---
  const handleEditSession = (session: LiveSession) => {
      setEditingSession(session);
      const date = new Date(session.startTime);
      const isoString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      setSessionForm({ title: session.title, price: session.price, startTime: isoString, thumbnail: session.thumbnail });
      setIsScheduling(true);
  };

  const handleSaveSession = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingSession) {
          setLocalLiveSessions(prev => prev.map(s => s.id === editingSession.id ? { ...s, title: sessionForm.title, price: Number(sessionForm.price), startTime: new Date(sessionForm.startTime).toISOString(), thumbnail: sessionForm.thumbnail || s.thumbnail } : s));
          alert('Session updated!');
      } else {
          const newSession: LiveSession = { id: `lc-${Date.now()}`, title: sessionForm.title, price: Number(sessionForm.price), startTime: new Date(sessionForm.startTime).toISOString(), thumbnail: sessionForm.thumbnail || 'https://picsum.photos/seed/new/400/225', instructorName: user.name, platform: 'INTERNAL', isLive: false };
          setLocalLiveSessions(prev => [newSession, ...prev]);
          alert('New session scheduled!');
      }
      resetForm();
  };

  const handleDeleteSession = (id: string) => {
      if (window.confirm("Delete session?")) setLocalLiveSessions(prev => prev.filter(s => s.id !== id));
  };

  const resetForm = () => { setIsScheduling(false); setEditingSession(null); setSessionForm({ title: '', price: 500, startTime: '', thumbnail: '' }); };


  // ----------------------------------------------------------------------
  // COMPONENT: ADMIN DASHBOARD
  // ----------------------------------------------------------------------
  const AdminDashboard = () => (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-700">
          <h2 className="text-2xl font-bold mb-1">Admin Control Center</h2>
          <p className="opacity-80 text-sm">Welcome back, Administrator. You have full system access.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-slate-500 text-xs font-bold uppercase">Users</div>
          <div className="text-3xl font-bold mt-1">{adminUsers.length}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-slate-500 text-xs font-bold uppercase">Revenue</div>
          <div className="text-3xl font-bold text-green-600 mt-1">MWK 2.5M</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-slate-500 text-xs font-bold uppercase">Pending</div>
          <div className="text-3xl font-bold text-amber-500 mt-1">{adminUsers.filter(u => u.isPendingTeacher).length}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-slate-500 text-xs font-bold uppercase">Videos</div>
          <div className="text-3xl font-bold mt-1">{adminLessons.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto">
        {['overview', 'users', 'content'].map(tab => (
            <button 
                key={tab}
                onClick={() => setAdminTab(tab)} 
                className={`px-6 py-2 capitalize font-medium text-sm transition-colors ${adminTab === tab ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
                {tab}
            </button>
        ))}
      </div>

      {/* Tab Content */}
      {adminTab === 'overview' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">System Status</h3>
              <p className="text-green-500 font-bold flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full"></span> All Systems Operational</p>
          </div>
      )}

      {adminTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <h3 className="p-4 font-bold border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-800">Teacher Approvals</h3>
            {adminUsers.filter(u => u.isPendingTeacher).length === 0 ? (
                <p className="p-8 text-center text-slate-500">No pending teacher applications.</p>
            ) : (
                <div className="divide-y dark:divide-slate-800">
                    {adminUsers.filter(u => u.isPendingTeacher).map(t => (
                        <div key={t.id} className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-bold">{t.name}</p>
                                <p className="text-sm text-slate-500">{t.email}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setAdminUsers(u => u.map(x => x.id === t.id ? {...x, isPendingTeacher: false} : x)); alert('Approved'); }} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Approve</button>
                                <button onClick={() => { setAdminUsers(u => u.filter(x => x.id !== t.id)); alert('Rejected'); }} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}
      
      {adminTab === 'content' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="p-4 font-bold border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-800">Manage Content</h3>
              <div className="divide-y dark:divide-slate-800 max-h-96 overflow-y-auto">
                  {adminLessons.map(l => (
                      <div key={l.id} className="p-3 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <div className="flex items-center gap-3">
                              <img src={l.thumbnail} className="w-12 h-8 rounded object-cover" alt="" />
                              <div>
                                  <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">{l.title}</p>
                                  <p className="text-xs text-slate-500">By {l.instructorName}</p>
                              </div>
                          </div>
                          <button className="text-red-500 hover:text-red-700 p-2">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );

  // ----------------------------------------------------------------------
  // TEACHER DASHBOARD
  // ----------------------------------------------------------------------
  const TeacherDashboard = () => (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex gap-2 overflow-x-auto pb-2">
         <button onClick={() => setTeacherTab('overview')} className={`px-4 py-2 rounded-lg text-sm font-bold ${teacherTab === 'overview' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600'}`}>Overview</button>
         <button onClick={() => setTeacherTab('live')} className={`px-4 py-2 rounded-lg text-sm font-bold ${teacherTab === 'live' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600'}`}>Live Sessions</button>
         <button onClick={() => setTeacherTab('courses')} className={`px-4 py-2 rounded-lg text-sm font-bold ${teacherTab === 'courses' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600'}`}>Uploads</button>
      </div>

      {teacherTab === 'overview' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <h3 className="text-lg font-bold mb-2">Teacher Actions</h3>
              <div className="flex justify-center gap-4">
                  <button onClick={() => setTeacherTab('live')} className="px-6 py-3 bg-secondary-600 text-white rounded-lg font-bold shadow-lg hover:bg-secondary-700">Schedule Class</button>
                  <button onClick={() => setTeacherTab('courses')} className="px-6 py-3 bg-primary-600 text-white rounded-lg font-bold shadow-lg hover:bg-primary-700">Upload Video</button>
              </div>
          </div>
      )}

      {teacherTab === 'live' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">Live Session Management</h3>
                  <button onClick={() => isScheduling ? resetForm() : setIsScheduling(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm">
                      {isScheduling ? 'Cancel' : '+ Schedule New Session'}
                  </button>
              </div>

              {isScheduling && (
                  <form onSubmit={handleSaveSession} className="mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <h4 className="font-bold mb-4">{editingSession ? 'Edit Session' : 'New Session'}</h4>
                      <div className="space-y-4">
                          <input type="text" placeholder="Session Title" required value={sessionForm.title} onChange={e => setSessionForm({...sessionForm, title: e.target.value})} className="w-full p-2 border rounded" />
                          <div className="grid grid-cols-2 gap-4">
                              <input type="number" placeholder="Price (MWK)" required value={sessionForm.price} onChange={e => setSessionForm({...sessionForm, price: Number(e.target.value)})} className="w-full p-2 border rounded" />
                              <input type="datetime-local" required value={sessionForm.startTime} onChange={e => setSessionForm({...sessionForm, startTime: e.target.value})} className="w-full p-2 border rounded" />
                          </div>
                          <input type="url" placeholder="Thumbnail URL" value={sessionForm.thumbnail} onChange={e => setSessionForm({...sessionForm, thumbnail: e.target.value})} className="w-full p-2 border rounded" />
                          <button type="submit" className="w-full py-2 bg-primary-600 text-white font-bold rounded">Save Session</button>
                      </div>
                  </form>
              )}

              <div className="space-y-4">
                  {localLiveSessions.map(s => (
                      <div key={s.id} className="flex justify-between items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <div>
                              <h4 className="font-bold">{s.title}</h4>
                              <p className="text-xs text-slate-500">{new Date(s.startTime).toLocaleString()}</p>
                              <div className="flex gap-2 mt-1">
                                  <span className={`text-[10px] font-bold px-2 rounded ${s.isLive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{s.isLive ? 'LIVE' : 'Scheduled'}</span>
                                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 rounded">MWK {s.price}</span>
                              </div>
                          </div>
                          <div className="flex flex-col gap-2">
                              <button onClick={() => handleEditSession(s)} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded">Edit</button>
                              <button onClick={() => handleDeleteSession(s.id)} className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded">Delete</button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {teacherTab === 'courses' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-lg mb-4">Upload New Lesson</h3>
              {!selectedUploadSubject ? (
                  <div className="grid grid-cols-2 gap-4">
                      {CATEGORIES.map(c => (
                          <button key={c.id} onClick={() => setSelectedUploadSubject(c.name)} className="p-4 border rounded-xl hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-slate-800 transition-all flex flex-col items-center gap-2">
                              <span className="text-2xl">{c.icon}</span>
                              <span className="font-bold text-sm">{c.name}</span>
                          </button>
                      ))}
                  </div>
              ) : (
                  <div className="animate-fade-in">
                      <button onClick={() => setSelectedUploadSubject(null)} className="text-sm text-primary-600 font-bold mb-4">← Back to Subjects</button>
                      <h4 className="font-bold text-xl mb-4">Upload to {selectedUploadSubject}</h4>
                      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Lesson uploaded!'); setSelectedUploadSubject(null); }}>
                          <input type="text" placeholder="Lesson Title" required className="w-full p-3 border rounded-lg" />
                          <input type="text" placeholder="Video URL / Source ID" required className="w-full p-3 border rounded-lg" />
                          <textarea placeholder="Lesson Description" className="w-full p-3 border rounded-lg" rows={3}></textarea>
                          <button className="w-full py-3 bg-primary-600 text-white font-bold rounded-lg shadow-lg">Upload Video</button>
                      </form>
                  </div>
              )}
          </div>
      )}
    </div>
  );

  // --- STUDENT COMPONENT ---
  const StudentDashboard = () => (
      <div className="space-y-6 animate-fade-in pb-20">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                 <h3 className="font-bold text-lg">My Status</h3>
                 <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono mt-1 font-bold ${user.subscriptionStatus === 'ACTIVE' ? 'bg-green-400/30 text-green-100' : 'bg-red-400/30 text-red-100'}`}>
                   {user.subscriptionStatus}
                 </span>
              </div>
              <Link to="/payment" className="bg-white text-primary-700 px-4 py-2 rounded-full font-bold text-xs shadow">
                {user.subscriptionStatus === 'ACTIVE' ? 'Extend' : 'Upgrade'}
              </Link>
            </div>
            <div className="relative z-10">
               <p className="text-primary-100 text-sm">
                  Plan: <span className="font-bold text-white">{user.currentPlan || 'None'}</span>
              </p>
            </div>
        </div>
        
        {/* Expanded Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 uppercase font-bold">Time Spent</p>
            <div className="flex items-end gap-1">
                <p className="text-2xl font-bold">12h</p>
                <span className="text-xs text-green-500 mb-1">+2h</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 uppercase font-bold">Avg Score</p>
            <p className="text-2xl font-bold text-primary-600">78%</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 uppercase font-bold">Lessons</p>
            <p className="text-2xl font-bold">24</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 uppercase font-bold">Books</p>
            <p className="text-2xl font-bold">{user.purchasedBooks?.length || 0}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold mb-3">Recent Activity</h3>
            <div className="space-y-3">
                {[1, 2].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Watched Algebra Basics</p>
                            <p className="text-xs text-slate-500">2 hours ago</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
  );

  // --- MAIN RENDER LOGIC ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-center sticky top-24">
              <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary-100 dark:border-slate-700" />
              <h2 className="font-bold text-xl text-slate-900 dark:text-white">{user.name}</h2>
              <p className="text-sm text-primary-600 dark:text-primary-400 font-medium uppercase tracking-wide mb-6">{user.role}</p>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-6">
               <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                 {/* DYNAMIC TITLE BASED ON ROLE */}
                 {user.role === UserRole.ADMIN ? 'Admin Dashboard' : 
                  user.role === UserRole.TEACHER ? 'Teacher Dashboard' : 
                  'Student Dashboard'}
               </h1>
            </div>

            {/* CONDITIONAL RENDERING BASED ON ROLE */}
            {user.role === UserRole.ADMIN ? (
                <AdminDashboard />
            ) : user.role === UserRole.TEACHER ? (
                <TeacherDashboard />
            ) : (
                <StudentDashboard />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};