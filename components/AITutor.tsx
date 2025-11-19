import React, { useState, useRef, useEffect } from 'react';
import { askAITutor } from '../services/geminiService';

interface AITutorProps {
  context: string;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export const AITutor: React.FC<AITutorProps> = ({ context }) => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Hi! I'm your AI Study Buddy. Have any questions about this lesson?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    const answer = await askAITutor(userMsg, context);
    
    setMessages(prev => [...prev, { sender: 'ai', text: answer }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[400px] bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="p-3 bg-gradient-to-r from-secondary-500 to-primary-500 text-white font-medium flex items-center gap-2">
        <span>✨</span> Gemini AI Tutor
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
              msg.sender === 'user' 
                ? 'bg-primary-500 text-white rounded-br-none' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start">
             <div className="bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-2xl rounded-bl-none text-sm text-slate-500 animate-pulse">
               Thinking...
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex gap-2">
        <input
          type="text"
          className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-full p-2 w-9 h-9 flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};