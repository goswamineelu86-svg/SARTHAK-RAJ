import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  Sparkles,
  Trophy,
  History,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizData, QuizQuestion, QuizAttempt } from '../../types';

interface QuizEngineTabProps {
  data: QuizData;
  onRegenerate: () => void;
  isGenerating: boolean;
  historicalAttempts: QuizAttempt[];
  onSaveAttempt: (attempt: QuizAttempt) => void;
}

export const QuizEngineTab: React.FC<QuizEngineTabProps> = ({
  data,
  onRegenerate,
  isGenerating,
  historicalAttempts,
  onSaveAttempt
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
  const [examMode, setExamMode] = useState<'practice' | 'timed'>('practice');
  const [timeLeft, setTimeLeft] = useState<number>(data?.estimatedMinutes ? data.estimatedMinutes * 60 : 600);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

  const questions: QuizQuestion[] = data?.questions || [];
  const filteredQuestions = difficultyFilter === 'All'
    ? questions
    : questions.filter(q => q.difficulty === difficultyFilter);

  const activeQuestion = filteredQuestions[currentQuestionIndex] || filteredQuestions[0];

  // Timer logic for Timed Exam Mode
  useEffect(() => {
    let interval: any = null;
    if (examMode === 'timed' && isTimerRunning && timeLeft > 0 && !isExamSubmitted) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleCompleteExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [examMode, isTimerRunning, timeLeft, isExamSubmitted]);

  const handleSelectOption = (qId: string, optionIdx: number) => {
    if (isExamSubmitted && examMode === 'timed') return;

    setUserAnswers(prev => ({ ...prev, [qId]: optionIdx }));

    if (examMode === 'practice') {
      // Reveal evaluation feedback key immediately in practice mode
      setRevealedKeys(prev => ({ ...prev, [qId]: true }));
    }
  };

  const handleCompleteExam = () => {
    setIsTimerRunning(false);
    setIsExamSubmitted(true);

    // Compute score
    let correctCount = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const percent = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;
    const timeSpent = (data?.estimatedMinutes ? data.estimatedMinutes * 60 : 600) - timeLeft;

    const newAttempt: QuizAttempt = {
      id: `att-${Date.now()}`,
      timestamp: 'Just now',
      score: correctCount,
      total: questions.length,
      percentage: Math.round(percent),
      mode: examMode,
      timeSpentSeconds: timeSpent,
      userAnswers: { ...userAnswers }
    };

    onSaveAttempt(newAttempt);

    if (percent >= 75) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setRevealedKeys({});
    setIsExamSubmitted(false);
    setCurrentQuestionIndex(0);
    setTimeLeft(data?.estimatedMinutes ? data.estimatedMinutes * 60 : 600);
    if (examMode === 'timed') {
      setIsTimerRunning(true);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  // Metrics
  const answeredCount = Object.keys(userAnswers).length;
  let correctCount = 0;
  questions.forEach(q => {
    if (userAnswers[q.id] === q.correctIndex) correctCount++;
  });
  const currentAccuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  return (
    <div className="h-full flex flex-col bg-[#0f1115] text-slate-100 overflow-hidden">
      {/* Top Controls Toolbar */}
      <div className="p-3 border-b border-[#1e2230] bg-[#141720]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-[#10121a] p-1 rounded-xl border border-[#222738]">
          <button
            onClick={() => {
              setExamMode('practice');
              setIsTimerRunning(false);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              examMode === 'practice'
                ? 'bg-violet-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Practice Mode (Instant Feedback)
          </button>
          <button
            onClick={() => {
              setExamMode('timed');
              setIsTimerRunning(true);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              examMode === 'timed'
                ? 'bg-violet-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timed Exam</span>
          </button>
        </div>

        {/* Right metrics & history modal toggle */}
        <div className="flex items-center gap-2">
          {examMode === 'timed' && !isExamSubmitted && (
            <div className={`px-2.5 py-1 rounded-lg border font-mono text-xs font-bold flex items-center gap-1.5 ${
              timeLeft < 120 ? 'bg-rose-950/40 text-rose-300 border-rose-500/40 animate-pulse' : 'bg-[#181c28] text-violet-300 border-[#232738]'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          )}

          <button
            onClick={() => setShowHistoryModal(!showHistoryModal)}
            className="px-2.5 py-1 rounded-lg bg-[#181c28] hover:bg-[#22273a] border border-[#232738] text-xs text-slate-300 flex items-center gap-1.5 transition"
          >
            <History className="w-3.5 h-3.5 text-violet-400" />
            <span>Scores ({historicalAttempts.length})</span>
          </button>

          <button
            onClick={handleResetQuiz}
            title="Reset Quiz"
            className="p-1.5 rounded-lg bg-[#181c28] hover:bg-[#22273a] border border-[#232738] text-slate-300 hover:text-white transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Navigator Sidebar */}
        <div className="w-full md:w-56 p-3 border-r border-[#1e2230] bg-[#12141c] overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span>Questions Map</span>
            <span className="font-mono text-violet-400">
              {answeredCount}/{filteredQuestions.length}
            </span>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 bg-[#0d0e14] p-1 rounded-lg border border-[#202434] text-[10px]">
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map(d => (
              <button
                key={d}
                onClick={() => {
                  setDifficultyFilter(d);
                  setCurrentQuestionIndex(0);
                }}
                className={`flex-1 py-0.5 rounded text-center transition ${
                  difficultyFilter === d
                    ? 'bg-violet-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Question Grid Pills */}
          <div className="grid grid-cols-4 gap-1.5">
            {filteredQuestions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isCorrect = userAnswers[q.id] === q.correctIndex;
              const isCurrent = idx === currentQuestionIndex;

              let btnClass = 'bg-[#181c28] border-[#222738] text-slate-400';
              if (examMode === 'practice' && isAnswered) {
                btnClass = isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300 font-bold'
                  : 'bg-rose-950/40 border-rose-500/60 text-rose-300 font-bold';
              } else if (isAnswered) {
                btnClass = 'bg-violet-900/40 border-violet-500/60 text-violet-300 font-semibold';
              }

              if (isCurrent) {
                btnClass += ' ring-2 ring-violet-400';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`h-8 rounded-lg border text-xs font-mono transition flex items-center justify-center ${btnClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Live Progress Card */}
          <div className="p-3 rounded-xl bg-[#151824] border border-[#222738] space-y-2 mt-4">
            <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
              <span>Live Accuracy</span>
              <span className="font-mono text-violet-300">{currentAccuracy}%</span>
            </div>
            <div className="w-full bg-[#10121a] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 transition-all duration-300"
                style={{ width: `${currentAccuracy}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>Correct: {correctCount}</span>
              <span>Total: {filteredQuestions.length}</span>
            </div>
          </div>

          {examMode === 'timed' && !isExamSubmitted && (
            <button
              onClick={handleCompleteExam}
              className="w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-md glow-violet-sm transition"
            >
              Submit Exam Now
            </button>
          )}
        </div>

        {/* Center Question View */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {activeQuestion ? (
            <div className="max-w-2xl mx-auto space-y-5">
              {/* Question Header Card */}
              <div className="p-4 md:p-5 rounded-2xl bg-[#141722] border border-[#222738]">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-xs font-mono font-bold text-violet-400 px-2 py-0.5 rounded bg-violet-950/60 border border-violet-800/40">
                    Question {currentQuestionIndex + 1} of {filteredQuestions.length}
                  </span>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      activeQuestion.difficulty === 'Hard'
                        ? 'bg-rose-950/40 text-rose-300 border-rose-700/40'
                        : activeQuestion.difficulty === 'Medium'
                        ? 'bg-amber-950/40 text-amber-300 border-amber-700/40'
                        : 'bg-emerald-950/40 text-emerald-300 border-emerald-700/40'
                    }`}
                  >
                    {activeQuestion.difficulty}
                  </span>
                </div>

                <h3 className="text-sm md:text-base font-semibold text-white leading-relaxed">
                  {activeQuestion.question}
                </h3>
              </div>

              {/* Options List */}
              <div className="space-y-2.5">
                {activeQuestion.options.map((option, optIdx) => {
                  const isSelected = userAnswers[activeQuestion.id] === optIdx;
                  const isCorrectAnswer = activeQuestion.correctIndex === optIdx;
                  const showResult =
                    (examMode === 'practice' && userAnswers[activeQuestion.id] !== undefined) ||
                    isExamSubmitted;

                  let optContainerClass =
                    'bg-[#131622] border-[#202538] hover:bg-[#191c2b] hover:border-[#2f354d] text-slate-200';

                  if (showResult) {
                    if (isCorrectAnswer) {
                      optContainerClass =
                        'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-sm ring-1 ring-emerald-500/40';
                    } else if (isSelected && !isCorrectAnswer) {
                      optContainerClass =
                        'bg-rose-950/40 border-rose-500 text-rose-200 shadow-sm ring-1 ring-rose-500/40';
                    }
                  } else if (isSelected) {
                    optContainerClass =
                      'bg-violet-950/40 border-violet-500 text-violet-200 shadow-sm ring-1 ring-violet-500/40';
                  }

                  const alphabet = String.fromCharCode(65 + optIdx);

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(activeQuestion.id, optIdx)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${optContainerClass}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                          showResult && isCorrectAnswer
                            ? 'bg-emerald-600 text-white'
                            : showResult && isSelected && !isCorrectAnswer
                            ? 'bg-rose-600 text-white'
                            : isSelected
                            ? 'bg-violet-600 text-white'
                            : 'bg-[#1e2334] text-slate-400'
                        }`}
                      >
                        {alphabet}
                      </div>

                      <div className="flex-1 text-xs md:text-sm leading-relaxed">
                        {option}
                      </div>

                      {showResult && isCorrectAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {showResult && isSelected && !isCorrectAnswer && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Immediate Evaluation Feedback Key (Practice Mode or post-submission) */}
              {((examMode === 'practice' && userAnswers[activeQuestion.id] !== undefined) || isExamSubmitted) && (
                <div className="p-4 rounded-xl bg-[#121622] border border-violet-500/30 animate-fadeIn space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                      Evaluation Feedback Key & Rationale
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-violet-950/60 text-violet-300 border border-violet-800/40">
                      {activeQuestion.sourceRef}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {activeQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Bottom Nav Controls */}
              <div className="flex items-center justify-between pt-3">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-3.5 py-1.5 rounded-lg bg-[#181c28] hover:bg-[#22273a] disabled:opacity-30 text-xs text-slate-300 flex items-center gap-1.5 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() =>
                    setCurrentQuestionIndex(prev =>
                      Math.min(filteredQuestions.length - 1, prev + 1)
                    )
                  }
                  disabled={currentQuestionIndex === filteredQuestions.length - 1}
                  className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-30 text-xs text-white font-medium flex items-center gap-1.5 transition shadow"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              No questions found for this filter.
            </div>
          )}
        </div>
      </div>

      {/* Historical Attempts Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141d] border border-[#222738] rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#222738] pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Historical Exam Scores</h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-[#1c2030]"
              >
                Close
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {historicalAttempts.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">
                  No historical attempts recorded yet. Take an exam to log your mastery!
                </p>
              ) : (
                historicalAttempts.map(att => (
                  <div
                    key={att.id}
                    className="p-3 rounded-xl bg-[#171a25] border border-[#232738] flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono">
                          {att.score} / {att.total} ({att.percentage}%)
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-950/60 text-violet-300 uppercase font-mono">
                          {att.mode}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        {att.timestamp} • Time: {Math.floor(att.timeSpentSeconds / 60)}m {att.timeSpentSeconds % 60}s
                      </span>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-bold ${
                          att.percentage >= 80 ? 'text-emerald-400' : att.percentage >= 60 ? 'text-amber-400' : 'text-rose-400'
                        }`}
                      >
                        {att.percentage >= 80 ? 'Pass with Honors' : att.percentage >= 60 ? 'Passing' : 'Review Needed'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
