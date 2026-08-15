import React, { useEffect, useState } from 'react';
import { Calendar, ArrowLeft, Newspaper, Mic, MessageSquare, Quote, FileQuestion, Clock, ExternalLink } from 'lucide-react';
import FlagStripe from '../lib/FlagStripe.jsx';

const CATEGORY_META = {
  'press-coverage': { label: 'Press Coverage', icon: Newspaper, badge: 'bg-[#044D29] text-white border border-[#DCA11D]/40' },
  speeches: { label: 'Speech', icon: Mic, badge: 'bg-[#C8102E] text-white border border-white/20' },
  'community-updates': { label: 'Community Update', icon: MessageSquare, badge: 'bg-[#DCA11D] text-[#090D14] font-black' },
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function SinglePost() {
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const slug = window.molokeleThemeData?.pageSlug;
    if (!slug) {
      setStatus('not-found');
      return;
    }

    fetch(`/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed`)
      .then((res) => res.json())
      .then((results) => {
        if (!results.length) {
          setStatus('not-found');
          return;
        }
        const p = results[0];
        setPost(p);
        setStatus('ready');

        const categoryId = p.categories?.[0];
        if (categoryId) {
          fetch(`/wp-json/wp/v2/posts?categories=${categoryId}&exclude=${p.id}&per_page=3&_embed`)
            .then((res) => res.json())
            .then(setRelated)
            .catch(() => {});
        }
      })
      .catch(() => setStatus('not-found'));
  }, []);

  if (status === 'loading') {
    return (
      <div className="w-full bg-slate-50 dark:bg-[#090D14] font-sans">
        <header className="relative w-full bg-[#090D14] py-16 sm:py-24 border-b border-[#DCA11D]/30 overflow-hidden">
          <FlagStripe className="absolute top-0 left-0 w-full h-1 z-10" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-4 animate-pulse">
            <div className="h-6 w-32 bg-[#044D29]/40 rounded-sm" />
            <div className="h-10 sm:h-14 w-3/4 bg-white/10 rounded-sm" />
            <div className="h-4 w-1/2 bg-white/10 rounded-sm" />
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 animate-pulse">
          <div className="aspect-[16/9] w-full bg-slate-200 dark:bg-white/5 rounded-sm relative overflow-hidden border border-slate-200 dark:border-white/10">
            <FlagStripe className="absolute top-0 left-0 w-full h-1 opacity-70" />
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-white/10 rounded-sm w-full" />
            <div className="h-4 bg-slate-200 dark:bg-white/10 rounded-sm w-11/12" />
            <div className="h-4 bg-slate-200 dark:bg-white/10 rounded-sm w-4/5" />
            <div className="h-4 bg-slate-200 dark:bg-white/10 rounded-sm w-9/12" />
          </div>
        </main>
      </div>
    );
  }

  if (status === 'not-found' || !post) {
    return (
      <div className="w-full bg-[#090D14] font-sans">
        <div className="relative w-full bg-[#090D14] py-24 overflow-hidden border-b border-[#DCA11D]/30">
          <FlagStripe className="absolute top-0 left-0 w-full h-1" />
          <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10 text-[#DCA11D]">
              <FileQuestion className="h-8 w-8" strokeWidth={1.5} />
            </div>
            <p className="mt-6 font-sans font-black text-2xl sm:text-3xl uppercase tracking-wide text-white">
              Article Not Found
            </p>
            <p className="mt-3 font-serif text-base text-white/80 max-w-md mx-auto leading-relaxed">
              This story may have moved or been unpublished. Head back to the full record of
              press coverage, speeches, and community updates.
            </p>
            <a
              href="/news-media/"
              className="mt-8 inline-flex items-center gap-2 font-sans font-black text-xs tracking-widest uppercase bg-[#044D29] text-white hover:bg-[#03381e] px-6 py-3 rounded-sm shadow-md transition-all duration-300 border border-[#DCA11D]/40"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
              Back to News &amp; Media
            </a>
          </div>
        </div>
      </div>
    );
  }

  const categorySlug = post._embedded?.['wp:term']?.[0]?.find((t) => t.taxonomy === 'category')?.slug;
  const meta = CATEGORY_META[categorySlug] || CATEGORY_META['community-updates'];
  const Icon = meta.icon;
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];
  const tags = post._embedded?.['wp:term']?.[1]?.filter((t) => t.taxonomy === 'post_tag') || [];
  const sourcePublication = post.meta?.source_publication;
  const sourceAuthor = post.meta?.source_author;
  const isSpeech = categorySlug === 'speeches';

  return (
    <div className="w-full bg-slate-50 dark:bg-[#090D14] font-sans">
      
      {/* Editorial Article Hero Banner */}
      <header className="relative w-full bg-[#090D14] py-16 sm:py-24 border-b border-[#DCA11D]/30 overflow-hidden">
        <FlagStripe className="absolute top-0 left-0 w-full h-1 z-10" />

        {/* Faint background gridlines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          {/* Category Pill & Tags */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`inline-flex items-center gap-2 rounded-sm px-3.5 py-1.5 text-xs font-black uppercase tracking-widest shadow-sm ${meta.badge}`}>
              <Icon className="h-3.5 w-3.5" />
              {meta.label}
            </span>
            {tags.map((t) => (
              <a
                key={t.id}
                href={`/?tag=${t.slug}`}
                className="inline-flex items-center rounded-sm bg-[#044D29] text-[#DCA11D] border border-[#DCA11D]/50 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest shadow-sm hover:bg-[#03381e] hover:text-white transition-all"
              >
                #{t.name}
              </a>
            ))}
          </div>

          {/* Main Headline */}
          <h1
            className="font-sans font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-[1.04] max-w-4xl"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {/* Meta Byline Bar */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-sans font-bold text-white/70 uppercase tracking-wider">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2 text-[#DCA11D]">
                <Calendar className="h-4 w-4" />
                {formatDate(post.date)}
              </span>
              {sourcePublication && (
                <>
                  <span className="opacity-30">•</span>
                  <span className="text-white/90">
                    Source: <strong className="text-[#DCA11D]">{sourcePublication}</strong>{sourceAuthor ? ` (${sourceAuthor})` : ''}
                  </span>
                </>
              )}
            </div>

            <a
              href="/news-media/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-[#DCA11D] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to News &amp; Media</span>
            </a>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Featured Image — Expansive Banner */}
        {featuredImage && (
          <div className="mb-12 overflow-hidden rounded-sm border border-slate-200 dark:border-white/10 shadow-xl bg-white dark:bg-white/5">
            <img
              src={featuredImage.source_url}
              alt={featuredImage.alt_text || post.title.rendered}
              className="w-full aspect-[16/9] object-cover"
            />
            {featuredImage.caption?.rendered && (
              <div
                className="p-4 bg-slate-100 dark:bg-[#0c121e] border-t border-slate-200 dark:border-white/10 text-xs font-sans text-slate-600 dark:text-white/60 italic"
                dangerouslySetInnerHTML={{ __html: featuredImage.caption.rendered }}
              />
            )}
          </div>
        )}

        {/* Speech pull-quote (excerpt shown big before body) */}
        {isSpeech && post.excerpt?.rendered && (
          <div className="mb-10 p-6 sm:p-8 bg-[#044D29]/5 dark:bg-white/5 border-l-4 border-[#044D29] dark:border-[#DCA11D] rounded-r-sm">
            <div className="flex items-start gap-4">
              <Quote className="h-8 w-8 flex-shrink-0 text-[#044D29] dark:text-[#DCA11D]" />
              <div
                className="font-serif italic text-xl sm:text-2xl text-[#090D14] dark:text-white leading-relaxed [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
              />
            </div>
          </div>
        )}

        {/* Press attribution box */}
        {sourcePublication && (
          <div className="mb-10 rounded-sm bg-white dark:bg-[#0c121e] border-l-4 border-[#DCA11D] border-y border-r border-slate-200 dark:border-white/10 p-5 sm:p-6 shadow-sm">
            <span className="font-sans font-black text-xs uppercase tracking-widest text-[#044D29] dark:text-[#DCA11D] block mb-1">
              Constituency Press Archive
            </span>
            <p className="font-serif text-sm sm:text-base text-slate-700 dark:text-white/80 leading-relaxed">
              Originally published by <strong className="text-[#090D14] dark:text-white">{sourcePublication}</strong>{sourceAuthor ? ` (${sourceAuthor})` : ''} — reproduced here for the official constituency record.
            </p>
          </div>
        )}

        {/* Article Body — Readable Editorial Column */}
        <article className="max-w-4xl mx-auto font-serif text-lg sm:text-xl text-slate-800 dark:text-white/80 leading-relaxed space-y-6 [&_p]:leading-relaxed [&_h2]:font-sans [&_h2]:font-black [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-[#090D14] [&_h2]:dark:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:font-sans [&_h3]:font-black [&_h3]:text-xl [&_h3]:uppercase [&_h3]:text-[#090D14] [&_h3]:dark:text-white [&_h3]:mt-8 [&_h3]:mb-3 [&_blockquote]:border-l-4 [&_blockquote]:border-[#044D29] [&_blockquote]:dark:border-[#DCA11D] [&_blockquote]:bg-slate-100 dark:[&_blockquote]:bg-white/5 [&_blockquote]:p-6 [&_blockquote]:my-8 [&_blockquote]:italic [&_blockquote]:text-[#090D14] dark:[&_blockquote]:text-white [&_blockquote_p]:m-0 [&_strong]:text-[#090D14] dark:[&_strong]:text-white [&_strong]:font-bold [&_a]:text-[#044D29] dark:[&_a]:text-[#DCA11D] [&_a]:underline [&_a]:underline-offset-4">
          <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
        </article>

        {/* Navigation Bar at Article End */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 max-w-4xl mx-auto">
          <a
            href="/news-media/"
            className="inline-flex items-center gap-2 font-sans font-black text-xs tracking-widest uppercase bg-[#044D29] hover:bg-[#03381e] text-white !text-white px-6 py-3 rounded-sm shadow-md transition-colors border border-[#DCA11D]/40"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All News &amp; Updates</span>
          </a>
        </div>

      </main>

      {/* Premium Related Posts Grid */}
      {related.length > 0 && (
        <section className="bg-white dark:bg-[#0c121e] border-t border-slate-200 dark:border-white/10 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-200 dark:border-white/10">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#044D29] dark:text-[#DCA11D] block mb-1">
                  Keep Reading
                </span>
                <h2 className="font-sans font-black text-xl sm:text-3xl uppercase tracking-wide text-[#090D14] dark:text-white">
                  More {meta.label}
                </h2>
              </div>

              <a
                href="/news-media/"
                className="font-sans font-black text-xs uppercase tracking-widest text-[#044D29] dark:text-[#DCA11D] hover:underline inline-flex items-center gap-1"
              >
                <span>View All Updates</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Related Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((r) => {
                const rImage = r._embedded?.['wp:featuredmedia']?.[0];
                return (
                  <a
                    key={r.id}
                    href={r.link}
                    className="group flex flex-col justify-between overflow-hidden rounded-sm border-t-4 border-t-[#044D29] hover:border-t-[#DCA11D] border-x border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#090D14] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div>
                      {rImage ? (
                        <div className="aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-white/5">
                          <img
                            src={rImage.source_url}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[16/10] bg-[#090D14] flex items-center justify-center p-6 text-center">
                          <Icon className="h-10 w-10 text-[#DCA11D]/60" />
                        </div>
                      )}
                      
                      <div className="p-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#044D29] dark:text-[#DCA11D] block mb-2">
                          {meta.label} &bull; {formatDate(r.date)}
                        </span>
                        
                        <h3
                          className="font-sans font-black text-base sm:text-lg uppercase tracking-tight text-[#090D14] dark:text-white group-hover:text-[#044D29] dark:group-hover:text-[#DCA11D] transition-colors leading-snug"
                          dangerouslySetInnerHTML={{ __html: r.title.rendered }}
                        />
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2 font-sans font-black text-xs uppercase tracking-widest text-[#044D29] dark:text-[#DCA11D] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      <span>Read Story</span>
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </a>
                );
              })}
            </div>

          </div>
        </section>
      )}

    </div>
  );
}
