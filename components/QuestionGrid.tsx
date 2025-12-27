
import React from 'react';
import { Question, UserAnswer } from '../types';

interface QuestionGridProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  currentIndex: number;
  onJump: (index: number) => void;
  onClose: () => void;
}

const QuestionGrid: React.FC<QuestionGridProps> = ({ questions, userAnswers, currentIndex, onJump, onClose }) => {
  const getStatusColor = (q: Question, idx: number) => {
    const ans = userAnswers.find(a => a.questionId === q.id);
    if (idx === currentIndex) return "ring-4 ring-indigo-500 border-indigo-500 text-indigo-700 bg-white shadow-lg";
    if (!ans) return "bg-slate-50 text-slate-300 border-slate-100 hover:border-slate-300";
    return ans.isCorrect ? "bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-100" : "bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-100";
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-slide-up border border-white">
        <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">DANH SÁCH CÂU HỎI</h2>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Đã hoàn thành: {userAnswers.length} / {questions.length}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white border-2 border-slate-100 hover:bg-rose-50 hover:border-rose-100 rounded-2xl text-slate-400 hover:text-rose-500 transition-all shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-3">
            {questions.map((q, idx) => (
              <button 
                key={q.id} 
                onClick={() => { onJump(idx); onClose(); }} 
                className={`h-12 rounded-xl font-black text-sm border-2 transition-all flex items-center justify-center ${getStatusColor(q, idx)}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 bg-slate-50 border-t flex gap-6 justify-center flex-wrap">
          <div className="flex items-center gap-2"><span className="w-4 h-4 bg-emerald-500 rounded-lg shadow-sm shadow-emerald-200"></span> <span className="text-xs font-black text-slate-500 uppercase">Đúng</span></div>
          <div className="flex items-center gap-2"><span className="w-4 h-4 bg-rose-500 rounded-lg shadow-sm shadow-rose-200"></span> <span className="text-xs font-black text-slate-500 uppercase">Sai</span></div>
          <div className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-indigo-500 bg-white rounded-lg"></span> <span className="text-xs font-black text-slate-500 uppercase">Đang làm</span></div>
          <div className="flex items-center gap-2"><span className="w-4 h-4 bg-slate-100 rounded-lg border-2 border-slate-200"></span> <span className="text-xs font-black text-slate-500 uppercase">Chưa làm</span></div>
        </div>
      </div>
    </div>
  );
};

export default QuestionGrid;
