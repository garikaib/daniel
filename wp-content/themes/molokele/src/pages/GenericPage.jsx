import React, { useEffect, useState } from 'react';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import FlagStripe from '../lib/FlagStripe.jsx';
import ZimbabweMap from '../lib/ZimbabweMap.jsx';

// Default renderer for any WordPress Page that doesn't have a bespoke React
// component wired up in main.jsx yet — e.g. a page a site editor creates in
// wp-admin on a whim. Keeps new pages on-brand (hero, flag stripe, prose
// styling) without needing a code change for every single one.
export default function GenericPage() {
  const [page, setPage] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const slug = window.molokeleThemeData?.pageSlug;
    if (!slug) {
      setStatus('not-found');
      return;
    }

    fetch(`/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_embed`)
      .then((res) => res.json())
      .then((results) => {
        if (!results.length) {
          setStatus('not-found');
          return;
        }
        setPage(results[0]);
        setStatus('ready');
      })
      .catch(() => setStatus('not-found'));
  }, []);

  if (status === 'loading') {
    return (
      <div className="w-full bg-slate-50 dark:bg-[#090D14] font-sans">
        <div className="w-full bg-[#090D14] py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="h-4 w-40 rounded-full bg-white/10" />
            <div className="mt-5 h-10 w-2/3 rounded bg-white/10" />
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 animate-pulse space-y-3">
          <div className="h-4 w-full rounded bg-slate-200 dark:bg-white/10" />
          <div className="h-4 w-full rounded bg-slate-200 dark:bg-white/10" />
          <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-white/10" />
        </div>
      </div>
    );
  }

  if (status === 'not-found' || !page) {
    return (
      <div className="w-full bg-[#090D14] font-sans">
        <div className="relative w-full bg-[#090D14] py-24 overflow-hidden border-b border-[#DCA11D]/30">
          <FlagStripe className="absolute top-0 left-0 w-full h-1" />
          <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/10 text-[#DCA11D]">
              <FileQuestion className="h-8 w-8" strokeWidth={1.5} />
            </div>
            <p className="mt-6 font-sans font-black text-2xl sm:text-3xl uppercase tracking-wide text-white">
              Page Not Found
            </p>
            <p className="mt-3 font-serif text-base text-white/80 max-w-md mx-auto leading-relaxed">
              This page may have moved. Head back to the homepage to find your way.
            </p>
            <a
              href="/"
              className="mt-8 inline-flex items-center gap-2 font-sans font-black text-xs tracking-widest uppercase bg-[#044D29] text-white hover:bg-[#C8102E] px-5 py-2.5 rounded-md shadow-md transition-all duration-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  const featuredImage = page._embedded?.['wp:featuredmedia']?.[0];

  return (
    <div className="w-full bg-slate-50 dark:bg-[#090D14] font-sans">
      {/* Hero */}
      <section className="relative w-full bg-[#090D14] py-20 sm:py-28 overflow-hidden border-b border-[#DCA11D]/30">
        <FlagStripe className="absolute top-0 left-0 w-full h-1 z-10" />
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <ZimbabweMap
          className="pointer-events-none absolute -right-24 -bottom-24 h-[26rem] w-auto text-white/[0.04] hidden lg:block"
          highlightClassName="fill-[#DCA11D]/[0.06]"
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="font-sans font-black text-4xl sm:text-5xl uppercase tracking-tight text-white leading-[1.05]"
            dangerouslySetInnerHTML={{ __html: page.title.rendered }}
          />
        </div>
      </section>

      {/* Content */}
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {featuredImage && (
          <div className="mb-8 overflow-hidden rounded-sm border border-brand-sand dark:border-white/10 shadow-md">
            <img
              src={featuredImage.source_url}
              alt={featuredImage.alt_text || ''}
              className="w-full aspect-[16/9] object-cover bg-brand-sand"
            />
          </div>
        )}
        <div
          className="font-serif text-base sm:text-lg text-slate-600 dark:text-white/70 leading-relaxed space-y-5 [&_h2]:font-sans [&_h2]:font-black [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-brand-blue [&_h2]:dark:text-white [&_h2]:text-xl [&_h3]:font-sans [&_h3]:font-black [&_h3]:uppercase [&_h3]:tracking-wide [&_h3]:text-brand-blue [&_h3]:dark:text-white [&_h3]:text-lg [&_a]:text-brand-pink [&_a]:underline [&_a]:decoration-brand-sand [&_a]:dark:decoration-white/20 [&_a]:underline-offset-4 [&_blockquote]:border-l-4 [&_blockquote]:border-brand-pink [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-brand-blue [&_blockquote]:dark:text-white [&_blockquote_p]:m-0 [&_strong]:text-brand-blue [&_strong]:dark:text-white [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        />
      </article>
    </div>
  );
}
