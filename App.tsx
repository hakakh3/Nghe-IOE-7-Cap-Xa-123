
import React, { useState, useEffect } from 'react';
import { GameState, Question, UserAnswer } from './types';
import { QUIZ_DATA } from './constants';
import StartScreen from './components/StartScreen';
import QuestionCard from './components/QuestionCard';
import QuestionGrid from './components/QuestionGrid';
import ResultScreen from './components/ResultScreen';
import Button from './components/Button';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [userName, setUserName] = useState('');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showGrid, setShowGrid] = useState(false);

  const handleStart = (name: string) => {
    setUserName(name);
    startSession(QUIZ_DATA);
  };

  const startSession = (questions: Question[]) => {
    setActiveQuestions(questions);
    setCurrentIndex(0);
    setUserAnswers([]);
    setGameState(GameState.PLAYING);
  };

  const handleAnswer = (response: string) => {
    const q = activeQuestions[currentIndex];
    const normalize = (s: string) => s.replace(/[.,!?;:'"]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    const isCorrect = normalize(response) === normalize(q.correctAnswer);
    
    setUserAnswers(prev => [
      ...prev.filter(a => a.questionId !== q.id), 
      { questionId: q.id, userResponse: response, isCorrect }
    ]);
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => setGameState(GameState.FINISHED);
  
  const handleRetryWrong = () => {
    const wrongIds = userAnswers.filter(a => !a.isCorrect).map(a => a.questionId);
    startSession(QUIZ_DATA.filter(q => wrongIds.includes(q.id)));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === GameState.PLAYING && e.key === 'Enter') {
        const q = activeQuestions[currentIndex];
        const answered = userAnswers.some(a => a.questionId === q.id);
        if (answered) {
          if (currentIndex < activeQuestions.length - 1) {
            handleNext();
          } else if (userAnswers.length === activeQuestions.length) {
            handleFinish();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentIndex, userAnswers, activeQuestions]);

  if (gameState === GameState.START) {
    return <StartScreen onStart={handleStart} />;
  }

  if (gameState === GameState.FINISHED) {
    return (
      <ResultScreen 
        userName={userName} 
        userAnswers={userAnswers} 
        onRetryAll={() => startSession(QUIZ_DATA)} 
        onRetryWrong={handleRetryWrong} 
      />
    );
  }

  const currentQ = activeQuestions[currentIndex];
  const answer = userAnswers.find(a => a.questionId === currentQ.id);
  const isAnswered = !!answer;
  const isLast = currentIndex === activeQuestions.length - 1;
  const allAnswered = userAnswers.length === activeQuestions.length;
  
  const currentScore = userAnswers.filter(a => a.isCorrect).length * 10;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-4 px-4 pb-24 relative">
      {/* Header Compact */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-4 bg-white p-4 rounded-2xl shadow-sm border border-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white text-xs">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="font-bold text-slate-700 text-sm hidden sm:inline">{userName}</span>
        </div>
        
        <div className="flex gap-4">
          <div className="flex flex-col items-center px-4 border-r border-slate-100">
            <span className="text-[8px] font-black text-slate-400 uppercase">Điểm</span>
            <span className="font-black text-emerald-600 text-base">{currentScore}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-slate-400 uppercase">Câu</span>
            <span className="font-black text-blue-600 text-base">
              {currentIndex + 1}<span className="text-slate-300 text-xs">/{activeQuestions.length}</span>
            </span>
          </div>
        </div>

        <button onClick={() => setShowGrid(true)} className="p-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
      
      {/* Thinner Progress Bar */}
      <div className="w-full max-w-3xl bg-slate-200 rounded-full h-1.5 mb-6 overflow-hidden">
        <div 
          className="bg-indigo-600 h-full transition-all duration-500" 
          style={{ width: `${(userAnswers.length / activeQuestions.length) * 100}%` }}
        ></div>
      </div>
      
      <QuestionCard 
        question={currentQ} 
        onAnswer={handleAnswer} 
        isAnswered={isAnswered} 
        userAnswer={answer?.userResponse} 
      />
      
      {/* Navigation Footer Compact */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-100 z-30 shadow-lg">
        <div className="w-full max-w-3xl mx-auto flex justify-between gap-4">
          <button 
            onClick={handlePrev} 
            disabled={currentIndex === 0} 
            className="px-6 py-3 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-400 hover:text-indigo-600 disabled:opacity-30 text-xs uppercase"
          >
            TRƯỚC
          </button>
          
          <div className="flex-1">
            {isAnswered ? (
              !isLast ? (
                <Button onClick={handleNext} size="md" className="w-full rounded-xl">TIẾP THEO →</Button>
              ) : (
                <Button onClick={handleFinish} size="md" variant={allAnswered ? "secondary" : "danger"} className="w-full rounded-xl">XEM KẾT QUẢ 🎉</Button>
              )
            ) : (
              <button onClick={handleNext} className="w-full py-3 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-indigo-500">Bỏ qua</button>
            )}
          </div>
        </div>
      </div>

      {showGrid && (
        <QuestionGrid 
          questions={activeQuestions} 
          userAnswers={userAnswers} 
          currentIndex={currentIndex} 
          onJump={setCurrentIndex} 
          onClose={() => setShowGrid(false)} 
        />
      )}
    </div>
  );
};

export default App;
