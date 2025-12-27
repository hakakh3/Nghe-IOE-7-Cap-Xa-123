
import React, { useState, useEffect } from 'react';
import { Question, QuestionType } from '../types';
import Button from './Button';
import AudioPlayer from './AudioPlayer';

interface QuestionCardProps {
  question: Question;
  onAnswer: (response: string) => void;
  isAnswered: boolean;
  userAnswer?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, isAnswered, userAnswer }) => {
  const [inputVal, setInputVal] = useState('');
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setInputVal('');
    setShowHint(false);
  }, [question.id]);

  const normalize = (str?: string) => str ? str.replace(/[.,!?;:'"]/g, '').replace(/\s+/g, ' ').trim().toLowerCase() : "";
  const isCorrect = () => userAnswer && normalize(userAnswer) === normalize(question.correctAnswer);

  const handleMCSelect = (opt: string) => {
    if (!isAnswered) onAnswer(opt);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAnswered && inputVal.trim()) onAnswer(inputVal.trim());
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAnswered && inputVal.trim()) {
      handleInputSubmit(e as any);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-4 animate-fade-in">
      <div className="bg-white rounded-[2rem] shadow-lg overflow-hidden border border-slate-100">
        {/* Card Header Compact */}
        <div className="bg-slate-50/80 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-wider">
              {question.type.replace(/_/g, ' ')}
            </span>
            {!isAnswered && (
              <button 
                onClick={() => setShowHint(!showHint)} 
                className="px-3 py-1 text-[9px] font-black uppercase border rounded-full bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 transition-all"
              >
                {showHint ? 'Ẩn Gợi ý' : 'Gợi ý 💡'}
              </button>
            )}
          </div>
          <span className="text-[9px] font-bold text-slate-300 uppercase">ID: {question.id}</span>
        </div>
        
        <div className="p-6 sm:p-8">
          {/* Audio & Hint Row */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
            {question.audioUrl && (
              <div className="shrink-0 w-full sm:w-auto">
                <AudioPlayer src={question.audioUrl} />
              </div>
            )}
            
            {showHint && !isAnswered && (
              <div className="flex-1 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 text-amber-900 text-sm font-bold animate-fade-in flex gap-4">
                {question.type === QuestionType.FILL_IN_BLANK && (
                  <>
                    <span className="flex items-center gap-1">📏 {question.correctAnswer.length} ký tự</span>
                    <span className="flex items-center gap-1">🔤 "{question.correctAnswer.charAt(0).toUpperCase()}"</span>
                  </>
                )}
                {question.type === QuestionType.MULTIPLE_CHOICE && (
                  <span>👂 Chú ý nghe kỹ thông tin chi tiết.</span>
                )}
              </div>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-8 italic tracking-tight leading-snug">
            "{question.questionText}"
          </h2>

          {/* Multiple Choice Grid Layout */}
          {question.type === QuestionType.MULTIPLE_CHOICE && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options?.map((opt, idx) => {
                const isCorrectOpt = opt === question.correctAnswer;
                const isSelected = opt === userAnswer;
                let btnStyle = "bg-white border-2 border-slate-100 hover:border-indigo-400";
                if (isAnswered) {
                  if (isCorrectOpt) btnStyle = "bg-emerald-500 border-emerald-500 text-white shadow-md scale-[1.02]";
                  else if (isSelected) btnStyle = "bg-rose-500 border-rose-500 text-white opacity-80";
                  else btnStyle = "bg-white border-slate-50 text-slate-200 opacity-40 pointer-events-none";
                }
                return (
                  <button 
                    key={idx} 
                    onClick={() => handleMCSelect(opt)} 
                    disabled={isAnswered} 
                    className={`p-4 rounded-2xl text-left transition-all font-bold text-base flex items-center gap-3 shadow-sm ${btnStyle}`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border font-black text-xs ${isAnswered && isCorrectOpt ? 'bg-white/20 border-white' : 'bg-slate-50 border-slate-200'}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-tight">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Fill In Blank Compact */}
          {question.type === QuestionType.FILL_IN_BLANK && (
            <form onSubmit={handleInputSubmit} className="max-w-xl mx-auto">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={isAnswered && userAnswer ? userAnswer : inputVal} 
                  onChange={(e) => setInputVal(e.target.value)} 
                  onKeyDown={onKeyDown}
                  disabled={isAnswered} 
                  autoFocus
                  className={`flex-1 p-4 rounded-xl border-2 font-black text-xl outline-none transition-all shadow-inner ${
                    isAnswered 
                      ? (isCorrect() ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-rose-500 bg-rose-50 text-rose-800') 
                      : 'border-slate-100 bg-slate-50 focus:border-indigo-500'
                  }`} 
                  placeholder="Đáp án..." 
                />
                {!isAnswered && (
                  <button type="submit" className="px-6 py-4 bg-indigo-600 text-white rounded-xl font-black shadow-md hover:bg-indigo-700">NỘP</button>
                )}
              </div>
            </form>
          )}

          {/* Explanation Compact */}
          {isAnswered && (
            <div className={`mt-6 p-4 rounded-2xl border-2 animate-fade-in ${isCorrect() ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-black text-xl shadow ${isCorrect() ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                  {isCorrect() ? '✓' : '✕'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className={`font-black text-sm uppercase ${isCorrect() ? 'text-emerald-900' : 'text-rose-900'}`}>
                      {isCorrect() ? 'Chính xác!' : 'Chưa đúng!'}
                    </h3>
                    {!isCorrect() && (
                      <span className="text-rose-600 font-black text-base uppercase bg-white px-2 rounded border border-rose-200">
                        {question.correctAnswer}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-bold italic truncate">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
