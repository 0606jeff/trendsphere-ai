import React, { useState, useEffect } from 'react';
import { fetchDailyTrends } from './services/geminiService';
import { DailyReport, FetchStatus } from './types';
import TrendCard from './components/TrendCard';
import SkeletonLoader from './components/SkeletonLoader';
import { Sparkles, RotateCw, AlertCircle, Calendar } from 'lucide-react';

const App: React.FC = () => {
  const [report, setReport] = useState<DailyReport | null>(null);
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.IDLE);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Load from local storage on mount to avoid re-fetching on refresh
  useEffect(() => {
    const savedData = localStorage.getItem('dailyTrendReport');
    const savedDate = localStorage.getItem('reportDate');
    const today = new Date().toLocaleDateString();

    if (savedData && savedDate === today) {
      setReport(JSON.parse(savedData));
      setLastUpdated(today);
      setStatus(FetchStatus.SUCCESS);
    } else {
      // If no data for today, auto-fetch
      handleFetchTrends();
    }
  }, []);

  const handleFetchTrends = async () => {
    setStatus(FetchStatus.LOADING);
    try {
      const data = await fetchDailyTrends();
      setReport(data);
      setStatus(FetchStatus.SUCCESS);
      
      // Save to local storage
      const today = new Date().toLocaleDateString();
      localStorage.setItem('dailyTrendReport', JSON.stringify(data));
      localStorage.setItem('reportDate', today);
      setLastUpdated(today);
    } catch (error) {
      console.error(error);
      setStatus(FetchStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-slate-100 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Sticky Header / Navbar */}
      <nav className="sticky top-0 z-50 bg-dark/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-blue-500 to-emerald-500 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                TrendSphere AI
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
                <Calendar size={12} />
                {new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <button
                onClick={handleFetchTrends}
                disabled={status === FetchStatus.LOADING}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCw className={`w-4 h-4 ${status === FetchStatus.LOADING ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">重新分析</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {status === FetchStatus.LOADING && <SkeletonLoader />}

        {status === FetchStatus.ERROR && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">無法獲取趨勢報告</h2>
            <p className="text-slate-400 mb-6 max-w-md">
              連線至 AI 分析引擎時發生錯誤。請檢查您的網路連線或稍後再試。
            </p>
            <button 
              onClick={handleFetchTrends}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              重試
            </button>
          </div>
        )}

        {status === FetchStatus.SUCCESS && report && (
          <div className="animate-fade-in-up">
            
            {/* Hero Summary Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 p-8 md:p-10 mb-10 shadow-2xl">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 max-w-3xl">
                <h2 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-3">
                  今日洞察 • {report.date}
                </h2>
                <p className="text-2xl md:text-3xl font-light text-slate-100 leading-normal">
                  {report.summary}
                </p>
              </div>
            </div>

            {/* Grid Layout for Trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {report.trends.map((trend, index) => (
                <TrendCard key={trend.id || index} trend={trend} index={index} />
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
              <p>分析由 Google Gemini 3.0 Pro 提供 • 資料來源基於即時網路搜尋</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
