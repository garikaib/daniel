import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Newspaper, Mic, MessageSquare, Images, Quote } from 'lucide-react';
import { useGalleryImages } from '../lib/wpMedia.js';
import PodcastSvg from './PodcastSvg.jsx';
import FlagStripe from '../lib/FlagStripe.jsx';

const FILTERS = [
  { id: 'all', label: 'All', slug: 'news-media' },
  { id: 'press-coverage', label: 'Press Coverage', slug: 'press-coverage', icon: Newspaper },
  { id: 'speeches', label: 'Speeches', slug: 'speeches', icon: Mic },
  { id: 'community-updates', label: 'Community Updates', slug: 'community-updates', icon: MessageSquare },
  { id: 'photo', label: 'Photo Gallery', slug: 'photo-gallery', icon: Images },
];

const CATEGORY_STYLES = {
  'press-coverage': { label: 'Press Coverage', badge: 'border border-[#044D29]/40 !text-[#044D29] bg-[#044D29]/10 dark:!bg-[#044D29]/30 dark:!text-[#DCA11D] dark:border-[#DCA11D]/40', icon: Newspaper },
  speeches: { label: 'Speech', badge: 'border border-[#C8102E]/40 !text-[#C8102E] bg-[#C8102E]/10 dark:!bg-[#C8102E]/30 dark:!text-white dark:border-white/30', icon: Mic },
  'community-updates': { label: 'Community Update', badge: 'border border-[#DCA11D]/50 !text-[#090D14] bg-[#DCA11D]/20 dark:!bg-[#DCA11D]/25 dark:!text-[#DCA11D] dark:border-[#DCA11D]/40', icon: MessageSquare },
};

function stripHtml(html) {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent || '').trim();
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function NewsCard({ post, index }) {
  const categorySlug = post._embedded?.['wp:term']?.[0]?.find((t) => t.taxonomy === 'category')?.slug;
  const style = CATEGORY_STYLES[categorySlug] || CATEGORY_STYLES['community-updates'];
  const Icon = style.icon;
  const image = post._embedded?.['wp:featuredmedia']?.[0];
  const sourcePublication = post.meta?.source_publication;
  const sourceAuthor = post.meta?.source_author;

  return (
    <a
      href={post.link}
      className="group flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/[0.03] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 h-full"
    >
      {image ? (
        <div className="aspect-[16/10] overflow-hidden rounded-t-2xl border-b border-slate-100 dark:border-white/10">
          <img
            src={image.source_url}
            alt={image.alt_text || ''}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-[16/10] overflow-hidden rounded-t-2xl border-b border-white/5 bg-[#044D29] flex items-center justify-center text-[#DCA11D] transition-colors duration-300 relative group-hover:text-white">
          <PodcastSvg className="h-20 w-auto transition-transform duration-500 ease-out group-hover:scale-105" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${style.badge}`}>
            <Icon className="h-3 w-3" />
            {style.label}
          </span>
          <span className="font-sans text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">
            {formatDate(post.date)}
          </span>
        </div>

        <h3
          className="mt-4 font-sans font-bold text-base uppercase tracking-wide text-[#090D14] dark:text-white group-hover:text-[#C8102E] dark:group-hover:text-[#DCA11D] transition-colors leading-snug"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <p className="mt-2.5 font-serif text-[13px] text-slate-600 dark:text-white/60 leading-relaxed flex-1 line-clamp-3">
          {stripHtml(post.excerpt.rendered)}
        </p>

        {sourcePublication && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10">
            <p className="font-sans text-[10px] font-black uppercase tracking-wider text-[#044D29] dark:text-[#DCA11D]">
              {sourceAuthor ? `${sourcePublication} — ${sourceAuthor}` : sourcePublication}
            </p>
          </div>
        )}
      </div>
    </a>
  );
}

function FlagArticleSkeleton() {
  const SKELETON_THEMES = ['border-t-[#044D29]', 'border-t-[#DCA11D]', 'border-t-[#C8102E]'];
  
  return (
    <div className="space-y-8">
      {/* Flag-inspired Loading Status Indicator */}
      <div className="flex items-center justify-center gap-3 py-4 text-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#044D29] text-[#DCA11D] animate-spin border border-[#DCA11D]/40 shadow-sm">
          <Newspaper className="h-4 w-4" />
        </div>
        <span className="font-sans font-black text-xs uppercase tracking-widest text-[#044D29] dark:text-[#DCA11D] animate-pulse">
          Retrieving Whange Central Dispatches...
        </span>
      </div>

      {/* Grid of 6 Flag-inspired Skeleton Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {[0, 1, 2, 3, 4, 5].map((idx) => {
          const flagBorder = SKELETON_THEMES[idx % SKELETON_THEMES.length];
          return (
            <div
              key={idx}
              className={`overflow-hidden rounded-sm border-t-4 ${flagBorder} border-x border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c121e] p-0 shadow-sm animate-pulse`}
            >
              {/* Skeleton Image Frame */}
              <div className="relative aspect-[16/10] bg-slate-200 dark:bg-white/5 overflow-hidden">
                <FlagStripe className="absolute top-0 left-0 w-full h-1 opacity-70" />
                <div className="absolute inset-0 flex items-center justify-center opacity-25">
                  <PodcastSvg className="h-16 w-auto text-slate-400 dark:text-white/20" />
                </div>
              </div>

              {/* Skeleton Text Content */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 rounded-sm bg-[#044D29]/20 dark:bg-[#DCA11D]/20" />
                  <div className="h-3 w-16 rounded-sm bg-slate-200 dark:bg-white/10" />
                </div>

                <div className="space-y-2 pt-1">
                  <div className="h-5 w-full rounded-sm bg-slate-200 dark:bg-white/10" />
                  <div className="h-5 w-3/4 rounded-sm bg-slate-200 dark:bg-white/10" />
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="h-3 w-full rounded-sm bg-slate-100 dark:bg-white/5" />
                  <div className="h-3 w-5/6 rounded-sm bg-slate-100 dark:bg-white/5" />
                  <div className="h-3 w-2/3 rounded-sm bg-slate-100 dark:bg-white/5" />
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/10">
                  <div className="h-3 w-32 rounded-sm bg-slate-200/60 dark:bg-white/5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function NewsMedia() {
  const { images: galleryImages } = useGalleryImages('photo-gallery');
  const revealRefs = useRef([]);
  const [posts, setPosts] = useState([]);
  const [postsStatus, setPostsStatus] = useState('loading');

  const initialFilter = useMemo(() => {
    const slug = window.molokeleThemeData?.pageSlug;
    const match = FILTERS.find((f) => f.slug === slug);
    return match ? match.id : 'all';
  }, []);

  const [activeFilter, setActiveFilter] = useState(initialFilter);

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    const selectedFilter = FILTERS.find((f) => f.id === filterId);
    if (selectedFilter) {
      let newUrl = '/news-media/';
      if (selectedFilter.id !== 'all') {
        newUrl = `/news-media/${selectedFilter.slug}/`;
      }
      window.history.pushState({ filterId }, '', newUrl);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const parts = path.split('/').filter(Boolean);
      const subSlug = parts[1];
      if (subSlug) {
        const match = FILTERS.find((f) => f.slug === subSlug);
        if (match) {
          setActiveFilter(match.id);
        }
      } else {
        setActiveFilter('all');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    setPostsStatus('loading');
    fetch('/wp-json/wp/v2/posts?per_page=50&_embed')
      .then((res) => res.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setPostsStatus('ready');
      })
      .catch(() => setPostsStatus('error'));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [activeFilter, posts]);

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === 'all' || activeFilter === 'photo') return true;
    const categorySlug = post._embedded?.['wp:term']?.[0]?.find((t) => t.taxonomy === 'category')?.slug;
    return categorySlug === activeFilter;
  });

  let revealCount = 0;
  const registerReveal = (el) => {
    revealRefs.current[revealCount] = el;
    revealCount += 1;
  };

  return (
    <div className="w-full bg-slate-50/50 dark:bg-[#090D14] font-sans">

      {/* Hero Header */}
      <section className="relative w-full bg-[#090D14] py-20 sm:py-28 overflow-hidden border-b border-[#DCA11D]/30">
        <FlagStripe className="absolute top-0 left-0 w-full h-1" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans font-black text-xs sm:text-sm tracking-[0.3em] uppercase text-[#DCA11D]">
            Parliament of Zimbabwe • Official Dispatch
          </p>
          <h1 className="mt-4 font-sans font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-[1.05]">
            News &amp; Updates
          </h1>
          <p className="mt-6 font-serif italic text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
            Press coverage, Hansard parliamentary speeches, constituency announcements, and photo dispatches from Whange Central.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="sticky top-20 z-20 border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#090D14]/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-center gap-2">
          {FILTERS.map((f) => {
            const Icon = f.icon;
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => handleFilterChange(f.id)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 font-sans font-black text-[10px] tracking-widest uppercase transition-all duration-300 border ${
                  isActive
                    ? '!bg-[#044D29] !border-[#DCA11D] !text-[#DCA11D] shadow-md'
                    : '!bg-white dark:!bg-white/5 border-slate-200 dark:border-white/10 !text-slate-700 dark:!text-white/70 hover:border-[#DCA11D] hover:!text-[#DCA11D]'
                }`}
              >
                {Icon && <Icon className="h-3 w-3" />}
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {activeFilter === 'photo' ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryImages.map((img, i) => (
              <div
                key={img.id}
                ref={registerReveal}
                className="molokele-card-reveal group relative overflow-hidden rounded-2xl shadow-md break-inside-avoid border border-slate-200 dark:border-white/10"
                style={{ transitionDelay: `${(i % 6) * 60}ms` }}
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full object-cover bg-slate-100 dark:bg-white/5 transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090D14]/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        ) : postsStatus === 'loading' ? (
          <FlagArticleSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, i) => (
              <div 
                key={post.id} 
                ref={registerReveal} 
                className="molokele-card-reveal flex flex-col h-full"
                style={{ transitionDelay: `${(i % 6) * 60}ms` }}
              >
                <NewsCard post={post} index={i} />
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
