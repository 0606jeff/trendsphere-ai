import React from 'react';
import { TrendItem } from '../types';
import { ExternalLink, Cpu, FlaskConical, Globe, Zap } from 'lucide-react';

interface TrendCardProps {
  trend: TrendItem;
  index: number;
}

const TrendCard: React.FC<TrendCardProps> = ({ trend, index }) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'AI': return <Cpu className="w-5 h-5 text-blue-400" />;
      case 'Material Science': return <FlaskConical className="w-5 h-5 text-emerald-400" />;
      case 'Global Economy': return <Globe className="w-5 h-5 text-yellow-400" />;
      default: return <Zap className="w-5 h-5 text-purple-400" />;
    }
  };

  const getBorderColor = (category: string) => {
    switch (category) {
      case 'AI': return 'border-blue-500/30 hover:border-blue-500/60';
      case 'Material Science': return 'border-emerald-500/30 hover:border-emerald-500/60';
      default: return 'border-slate-700 hover:border-slate-500';
    }
  };

  return (
    <div 
      className={`relative group bg-card border ${getBorderColor(trend.category)} rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10 hover:-translate-y-1 overflow-hidden`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Category Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="p-2 bg-slate-800 rounded-lg border border-slate-700">
          {getIcon(trend.category)}
        </span>
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          {trend.category}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-white mb-3 leading-tight">
        {trend.title}
      </h3>
      
      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        {trend.summary}
      </p>

      {/* Impact Section */}
      <div className="bg-slate-800/50 rounded-lg p-3 mb-4 border border-slate-700/50">
        <h4 className="text-xs font-bold text-primary mb-1 flex items-center gap-1">
          <Zap size={12} /> 影響評估
        </h4>
        <p className="text-xs text-slate-400">
          {trend.impact}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {trend.keywords.map((keyword, idx) => (
          <span key={idx} className="px-2 py-1 text-[10px] font-medium bg-slate-800 text-slate-400 rounded-full border border-slate-700">
            #{keyword}
          </span>
        ))}
      </div>

      {/* Sources (Collapsible or Bottom) */}
      {trend.sources && trend.sources.length > 0 && (
        <div className="pt-4 border-t border-slate-700/50 mt-auto">
          <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-widest">參考來源</p>
          <div className="flex flex-wrap gap-3">
            {trend.sources.slice(0, 2).map((source, idx) => (
              <a 
                key={idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors truncate max-w-[200px]"
              >
                <ExternalLink size={10} />
                <span className="truncate">{source.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendCard;
