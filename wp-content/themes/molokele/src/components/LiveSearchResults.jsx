import React from 'react';
import { Mic, Newspaper, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';
import PodcastSvg from '../pages/PodcastSvg.jsx';

const SUGGESTIONS = ['Boreholes', 'Speeches', 'CDF Tracker', 'Parliament', 'Labour', 'Gender'];

export default function LiveSearchResults({
  query,
  results,
  selectedIndex,
  onSelectResult,
  onSuggestionClick,
  onClose,
}) {
  const { total, items, groups } = results;
  const hasQuery = query.trim().length > 0;

  if (!hasQuery) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-3 z-50 overflow-hidden rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-brand-blue/95 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 text-brand-blue dark:text-white">
      {total === 0 ? (
        /* Empty / No Results State */
        <div className="p-6 text-center">
          <p className="font-sans font-bold text-sm text-slate-500 dark:text-white/50">
            No matches found for <span className="text-brand-pink italic font-serif">"{query}"</span>
          </p>
          <p className="mt-2 text-xs text-slate-400 dark:text-white/40 font-sans">
            Try searching for key constituency topics:
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((term) => (
              <button
                key={term}
                onClick={() => onSuggestionClick(term)}
                className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1 text-[11px] font-bold text-brand-blue dark:text-white hover:border-brand-pink hover:text-brand-pink transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Categorized Results Panel */
        <div className="max-h-[65vh] overflow-y-auto scrollbar-thin">
          {/* Header Stats Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 px-5 py-2.5">
            <span className="font-sans text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">
              Found {total} Instant {total === 1 ? 'Match' : 'Matches'}
            </span>
            <span className="font-sans text-[9px] text-slate-400 dark:text-white/40 flex items-center gap-1">
              <CornerDownLeft className="h-2.5 w-2.5" /> press Enter to select
            </span>
          </div>

          <div className="p-2 space-y-4">
            {/* Speeches Group */}
            {groups.speeches && groups.speeches.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 font-sans text-[10px] font-black uppercase tracking-widest text-brand-pink">
                  <Mic className="h-3 w-3" />
                  <span>Speeches &amp; Hansard</span>
                </div>
                <div className="space-y-1 mt-1">
                  {groups.speeches.map((item) => {
                    const globalIdx = items.findIndex((i) => i.id === item.id);
                    const isSelected = selectedIndex === globalIdx;

                    return (
                      <a
                        key={item.id}
                        href={item.link}
                        onClick={() => onSelectResult(item)}
                        className={`group flex items-center gap-3.5 rounded-xl p-2.5 transition-all duration-200 ${
                          isSelected ? 'bg-brand-pink/10 border-l-4 border-brand-pink pl-3' : 'hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                      >
                        {/* Thumbnail or Podcast Vector */}
                        <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-brand-blue flex items-center justify-center text-brand-orange">
                          {item.image ? (
                            <img src={item.image} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <PodcastSvg className="h-7 w-auto" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-sans font-bold text-xs sm:text-sm text-brand-blue dark:text-white truncate group-hover:text-brand-pink transition-colors">
                              {item.title}
                            </h4>
                            {item.date && (
                              <span className="font-sans text-[9px] font-black uppercase text-slate-400 flex-shrink-0">
                                {item.date}
                              </span>
                            )}
                          </div>
                          <p className="font-serif text-xs text-slate-500 dark:text-white/50 line-clamp-1 mt-0.5">
                            {item.excerpt}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* News & Press Group */}
            {groups.news && groups.news.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 font-sans text-[10px] font-black uppercase tracking-widest text-brand-blue dark:text-white">
                  <Newspaper className="h-3 w-3" />
                  <span>Press &amp; Community Updates</span>
                </div>
                <div className="space-y-1 mt-1">
                  {groups.news.map((item) => {
                    const globalIdx = items.findIndex((i) => i.id === item.id);
                    const isSelected = selectedIndex === globalIdx;

                    return (
                      <a
                        key={item.id}
                        href={item.link}
                        onClick={() => onSelectResult(item)}
                        className={`group flex items-center gap-3.5 rounded-xl p-2.5 transition-all duration-200 ${
                          isSelected ? 'bg-brand-blue/10 border-l-4 border-brand-blue pl-3' : 'hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                      >
                        {item.image && (
                          <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-white/10">
                            <img src={item.image} alt="" className="h-full w-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-sans font-bold text-xs sm:text-sm text-brand-blue dark:text-white truncate group-hover:text-brand-pink transition-colors">
                              {item.title}
                            </h4>
                            {item.date && (
                              <span className="font-sans text-[9px] font-black uppercase text-slate-400 flex-shrink-0">
                                {item.date}
                              </span>
                            )}
                          </div>
                          <p className="font-serif text-xs text-slate-500 dark:text-white/50 line-clamp-1 mt-0.5">
                            {item.excerpt}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pages & Sections Group */}
            {groups.pages && groups.pages.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 font-sans text-[10px] font-black uppercase tracking-widest text-brand-orange">
                  <FileText className="h-3 w-3" />
                  <span>Pages &amp; Key Audits</span>
                </div>
                <div className="space-y-1 mt-1">
                  {groups.pages.map((item) => {
                    const globalIdx = items.findIndex((i) => i.id === item.id);
                    const isSelected = selectedIndex === globalIdx;

                    return (
                      <a
                        key={item.id}
                        href={item.link}
                        onClick={() => onSelectResult(item)}
                        className={`group flex items-center justify-between rounded-xl p-2.5 transition-all duration-200 ${
                          isSelected ? 'bg-brand-orange/10 border-l-4 border-brand-orange pl-3' : 'hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="min-w-0">
                          <h4 className="font-sans font-bold text-xs sm:text-sm text-brand-blue dark:text-white group-hover:text-brand-pink transition-colors">
                            {item.title}
                          </h4>
                          <p className="font-serif text-xs text-slate-500 dark:text-white/50 line-clamp-1 mt-0.5">
                            {item.excerpt}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 dark:text-white/30 group-hover:text-brand-pink group-hover:translate-x-1 transition-all flex-shrink-0 ml-3" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
