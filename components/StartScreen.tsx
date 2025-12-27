
import React, { useState } from 'react';
import Button from './Button';

interface StartScreenProps {
  onStart: (name: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-500 to-sky-400 p-4">
      <div className="bg-white rounded-[3rem] shadow-2xl p-12 max-w-md w-full text-center glass-card animate-slide-up border border-white/40">
        <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
          </svg>
        </div>
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tight leading-tight">IOE K7 - NGHE</h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest italic opacity-75">BỘ ĐỀ ÔN CẤP QUẬN HUYỆN</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="text-left">
            <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest ml-1">Nhập tên của bạn</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Ví dụ: Minh Anh..." 
              className="w-full px-6 py-5 rounded-2xl border-4 border-slate-100 focus:border-indigo-500 outline-none transition-all font-black text-xl text-slate-800 placeholder:text-slate-300 shadow-inner bg-slate-50/50" 
              required 
            />
          </div>
          <Button 
            type="submit" 
            className="w-full py-6 text-xl shadow-xl shadow-indigo-100" 
            size="lg" 
            disabled={!name.trim()}
          >
            BẮT ĐẦU ÔN THI 🚀
          </Button>
        </form>
        <p className="mt-8 text-[10px] font-black text-slate-300 uppercase tracking-tighter">60 Câu hỏi nghe chọn lọc • 3 Bộ đề đầy đủ</p>
      </div>
    </div>
  );
};

export default StartScreen;
