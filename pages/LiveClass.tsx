import React, { useState, useRef, useEffect } from 'react';
import { UPCOMING_LIVE_SESSIONS } from '../services/mockData';
import { LiveSession, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

export const LiveClass: React.FC = () => {
  const { user, unlockLiveSession } = useAuth();
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);
  const [payingForSession, setPayingForSession] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Teacher State
  const [isRecording, setIsRecording] = useState(false);
  const teacherVideoRef = useRef<HTMLVideoElement>(null);
  const [teacherStream, setTeacherStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [maxZoom, setMaxZoom] = useState(1);
  
  // Student State
  const studentVideoRef = useRef<HTMLVideoElement>(null);
  const [studentStream, setStudentStream] = useState<MediaStream | null>(null);
  const [isStudentCamOn, setIsStudentCamOn] = useState(false);

  const [cameraError, setCameraError] = useState<string | null>(null);

  // Check if the current user has unlocked a specific session
  const isUnlocked = (sessionId: string) => {
    return user?.unlockedLiveSessions?.includes(sessionId) || user?.role === UserRole.TEACHER;
  };

  const handleJoinClick = (session: LiveSession) => {
    if (isUnlocked(session.id)) {
      setActiveSession(session);
      setIsRecording(false); 
      setCameraError(null);
      setTeacherStream(null);
      setStudentStream(null);
      setIsStudentCamOn(false);
    } else {
      setPayingForSession(session.id);
    }
  };

  const handlePayment = async () => {
    if (!payingForSession) return;
    await unlockLiveSession(payingForSession);
    setPayingForSession(null);
    setPhoneNumber('');
    const session = UPCOMING_LIVE_SESSIONS.find(s => s.id === payingForSession);
    if (session) setActiveSession(session);
  };

  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      alert("Class recording saved successfully! It will be available to students shortly.");
    }
  };

  // --- Camera Logic ---

  const startTeacherCamera = async (mode: 'user' | 'environment' = facingMode) => {
    setCameraError(null);
    if (teacherStream) {
        teacherStream.getTracks().forEach(track => track.stop());
    }

    try {
      // Request zoom capabilities if supported by browser
      const constraints: MediaStreamConstraints = { 
          video: { facingMode: mode, zoom: true } as any, // Cast to any for TS zoom support
          audio: true 
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setTeacherStream(stream);
      setFacingMode(mode);

      // Check zoom capabilities
      const track = stream.getVideoTracks()[0];
      const capabilities = (track.getCapabilities ? track.getCapabilities() : {}) as any;
      
      if (capabilities.zoom) {
          setMaxZoom(capabilities.zoom.max);
          setZoomLevel(1); // Reset zoom on camera switch
      } else {
          setMaxZoom(1);
      }

    } catch (err: any) {
      console.error("Error accessing teacher camera:", err);
      setCameraError("Could not access camera. Please allow permissions in your browser settings.");
    }
  };

  const toggleCamera = () => {
      const newMode = facingMode === 'user' ? 'environment' : 'user';
      startTeacherCamera(newMode);
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newZoom = parseFloat(e.target.value);
      setZoomLevel(newZoom);
      if (teacherStream) {
          const track = teacherStream.getVideoTracks()[0];
          if (track && 'applyConstraints' in track) {
              const constraints = { advanced: [{ zoom: newZoom }] };
              track.applyConstraints(constraints as any).catch(err => console.log('Zoom not supported', err));
          }
      }
  };

  const startStudentCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStudentStream(stream);
      setIsStudentCamOn(true);
    } catch (err: any) {
      console.error("Error accessing student camera:", err);
      setCameraError("Could not share video. Please allow permissions.");
    }
  };

  const stopStream = (stream: MediaStream | null, setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Attach streams to video elements
  useEffect(() => {
    if (teacherStream && teacherVideoRef.current) {
      teacherVideoRef.current.srcObject = teacherStream;
    }
  }, [teacherStream]);

  useEffect(() => {
    if (studentStream && studentVideoRef.current) {
      studentVideoRef.current.srcObject = studentStream;
    }
  }, [studentStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (teacherStream) teacherStream.getTracks().forEach(t => t.stop());
      if (studentStream) studentStream.getTracks().forEach(t => t.stop());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const stopStudentCamera = () => {
      stopStream(studentStream, setStudentStream);
      setIsStudentCamOn(false);
  };

  const stopTeacherCamera = () => {
      stopStream(teacherStream, setTeacherStream);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {!activeSession && (
            <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Smartlearn Live</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Interactive live classes with real-time video.</p>
            </div>
        )}

        {activeSession ? (
          <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mb-12 ring-4 ring-primary-500/20 relative">
            <div className="aspect-w-16 aspect-h-9 relative bg-slate-900 flex flex-col items-center justify-center text-white pb-[56.25%]">
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  
                  {/* --- MAIN BROADCAST AREA --- */}
                  
                  {activeSession.recordingUrl ? (
                     // Playback Mode
                     <iframe 
                        src={activeSession.recordingUrl} 
                        title={activeSession.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                  ) : (
                    // Live Mode
                    <div className="w-full h-full relative bg-slate-900 flex flex-col">
                        
                        {/* TEACHER VIEW: Shows Local Camera */}
                        {user?.role === UserRole.TEACHER ? (
                            teacherStream ? (
                                <video ref={teacherVideoRef} autoPlay muted playsInline className={`absolute inset-0 w-full h-full object-cover z-0 ${facingMode === 'user' ? 'transform scale-x-[-1]' : ''}`} />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 z-0">
                                    <div className="text-center">
                                        <p className="text-slate-400 mb-4">Camera is off</p>
                                        <button onClick={() => startTeacherCamera('user')} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg flex items-center gap-2 mx-auto">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                            Start Broadcast
                                        </button>
                                    </div>
                                </div>
                            )
                        ) : (
                            /* STUDENT VIEW: Shows Simulated Teacher Stream */
                            <div className="absolute inset-0 w-full h-full z-0">
                                <video 
                                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider animate-pulse shadow-md z-10">
                                    LIVE
                                </div>
                            </div>
                        )}

                        {/* --- STUDENT SELF-VIEW PIP (Picture in Picture) --- */}
                        {user?.role === UserRole.STUDENT && isStudentCamOn && (
                            <div className="absolute top-4 right-4 w-32 h-48 md:w-48 md:h-36 bg-black rounded-lg border-2 border-white/20 shadow-2xl overflow-hidden z-30 drag-handle">
                                <video ref={studentVideoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                                <div className="absolute bottom-1 right-1">
                                    <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                                </div>
                            </div>
                        )}

                        {/* --- CONTROLS OVERLAY --- */}
                        
                        {/* Error Message */}
                        {cameraError && (
                            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-900/90 text-white px-4 py-2 rounded-lg text-sm font-medium z-50">
                                {cameraError}
                            </div>
                        )}

                        {/* Top Right Controls for Teacher */}
                        {user?.role === UserRole.TEACHER && teacherStream && (
                           <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-black/40 backdrop-blur-md p-2 rounded-xl border border-white/10">
                             
                             {/* Camera Toggle */}
                             <button onClick={toggleCamera} className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all" title="Flip Camera">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                             </button>

                             {/* Zoom Slider (Only if supported) */}
                             {maxZoom > 1 && (
                                 <div className="flex flex-col items-center py-2">
                                     <span className="text-[10px] text-white font-bold mb-1">{zoomLevel}x</span>
                                     <input 
                                        type="range" 
                                        min="1" 
                                        max={maxZoom} 
                                        step="0.1" 
                                        value={zoomLevel} 
                                        onChange={handleZoomChange}
                                        className="h-24 w-1 bg-white/30 rounded-lg appearance-none cursor-pointer vertical-slider"
                                        style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                                     />
                                 </div>
                             )}

                             <div className="h-px w-full bg-white/20 my-1"></div>

                             <button 
                               onClick={handleToggleRecording}
                               className={`p-2 rounded-full transition-all ${
                                 isRecording 
                                   ? 'bg-white text-red-600 animate-pulse' 
                                   : 'bg-white/10 text-white hover:bg-white/20'
                               }`}
                               title="Record"
                             >
                               <div className={`w-4 h-4 rounded-sm ${isRecording ? 'bg-red-600' : 'bg-white rounded-full'}`}></div>
                             </button>

                             <button 
                                onClick={stopTeacherCamera}
                                className="p-2 bg-red-600/80 hover:bg-red-700 rounded-full text-white transition-all mt-1" 
                                title="Stop Camera"
                             >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                             </button>
                           </div>
                        )}

                        {/* Bottom Control Bar */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent z-20 flex justify-between items-end">
                            <div className="text-white">
                                <h3 className="font-bold text-lg leading-tight">{activeSession.title}</h3>
                                <p className="text-slate-300 text-sm">{activeSession.instructorName}</p>
                            </div>

                            <div className="flex gap-3">
                                {user?.role === UserRole.STUDENT && (
                                    <button 
                                        onClick={isStudentCamOn ? stopStudentCamera : startStudentCamera}
                                        className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all shadow-lg ${isStudentCamOn ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        {isStudentCamOn ? 'Stop Video' : 'Share Video'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                  )}
              </div>
            </div>
            
            {/* Session Info & Leave */}
            <div className="p-6 bg-white dark:bg-slate-900 flex justify-between items-center rounded-b-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                 <div className={`w-3 h-3 rounded-full ${activeSession.recordingUrl ? 'bg-blue-500' : 'bg-red-500 animate-pulse'}`}></div>
                 <span className="font-medium text-slate-700 dark:text-slate-300">{activeSession.recordingUrl ? 'Recorded Session' : 'Live Now'}</span>
              </div>
              <button 
                onClick={() => {
                    stopStudentCamera(); 
                    stopTeacherCamera();
                    setActiveSession(null);
                }} 
                className="px-6 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors"
              >
                Leave Class
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {UPCOMING_LIVE_SESSIONS.map(session => {
              const unlocked = isUnlocked(session.id);
              const isRecorded = !!session.recordingUrl;
              
              return (
                <div key={session.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                  <div className="md:w-64 h-48 md:h-auto relative">
                      <img src={session.thumbnail} alt="" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
                         {unlocked ? (
                           <div className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">UNLOCKED</div>
                         ) : (
                           <div className="bg-black/60 text-white text-xs px-2 py-1 rounded">LOCKED</div>
                         )}
                         {isRecorded ? (
                           <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold">RECORDING</div>
                         ) : (
                           <div className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">LIVE</div>
                         )}
                      </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                         <h3 className="text-xl font-bold text-slate-900 dark:text-white">{session.title}</h3>
                         {!unlocked && <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">MWK {session.price}</span>}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">Hosted by {session.instructorName}</p>
                    <div className="flex items-center justify-between mt-auto">
                        <div className="text-sm text-slate-500">
                            {isRecorded ? 'Streamed on: ' : 'Starts: '} {new Date(session.startTime).toLocaleString()}
                        </div>
                        <button 
                            onClick={() => handleJoinClick(session)}
                            className={`px-6 py-2 rounded-lg font-bold transition-colors ${
                                unlocked 
                                ? 'bg-primary-600 text-white hover:bg-primary-700' 
                                : 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700'
                            }`}
                        >
                            {unlocked ? (isRecorded ? 'Watch Recording' : 'Enter Class') : `Pay MWK ${session.price} to ${isRecorded ? 'Watch' : 'Join'}`}
                        </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {payingForSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl animate-scale-in">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Unlock Session</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                      To access this content, a one-time fee of <span className="font-bold text-primary-600">MWK 500</span> is required.
                  </p>

                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pay with Mobile Money</label>
                          <input 
                              type="tel" 
                              placeholder="Enter Phone Number" 
                              className="w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                      </div>
                      <div className="flex gap-3">
                          <button 
                            onClick={handlePayment}
                            disabled={!phoneNumber}
                            className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 disabled:opacity-50"
                          >
                              Pay MWK 500
                          </button>
                          <button 
                            onClick={() => { setPayingForSession(null); setPhoneNumber(''); }}
                            className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                              Cancel
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};