import React, { useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import ZimbabweMap from './ZimbabweMap.jsx';
import FlagStripe from './FlagStripe.jsx';

// Editorial "spec sheet" meta row — derived from the same slide fields the
// current hero already has, formatted like a gallery placard instead of
// hard-coding a second content shape.
const slideMeta = (slide) => ([
  { label: 'Category', value: (slide.badge || '').split('|')[0].trim() || 'Constituency' },
  { label: 'Constituency', value: 'Whange Central' },
  { label: 'Session', value: '9th Parliament' },
]);

// Alternative homepage hero — full-bleed dissolve slides, a translucent
// glass placard, and a bottom-right navigator dock: thumbnails magnify and
// lift toward the cursor (dock-style "flyout"), settling back into a flat
// row on mouseleave, next to text prev/next controls and a numbered counter.
// Toggle between this and HeroCurrent.jsx via the "Homepage Hero Style"
// display setting in Molokele Tools.
export default function HeroEditorial({
  heroSectionRef,
  setIsHeroPaused,
  slides,
  currentSlide,
  slideProgress,
  goPrevSlide,
  goNextSlide,
  goToSlide,
  slideImage,
}) {
  // Dock "flyout" magnification — thumbnails scale and lift toward the
  // cursor's x-position, proportional to proximity, then relax back to a
  // flat row once the pointer leaves the dock.
  const thumbRefs = useRef([]);
  const [dockMouseX, setDockMouseX] = useState(null);

  const thumbTransform = (i) => {
    const el = thumbRefs.current[i];
    if (dockMouseX == null || !el) return 'scale(1) translateY(0px)';
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const distance = Math.abs(dockMouseX - center);
    const proximity = Math.max(0, 1 - distance / 90);
    const scale = 1 + proximity * 0.55;
    const lift = proximity * 14;
    return `scale(${scale.toFixed(3)}) translateY(-${lift.toFixed(1)}px)`;
  };

  return (
    <section
      ref={heroSectionRef}
      onMouseEnter={() => setIsHeroPaused(true)}
      onMouseLeave={() => setIsHeroPaused(false)}
      className="relative w-full h-[92vh] min-h-[640px] md:min-h-[820px] bg-[#090D14] overflow-hidden"
    >
      {/* The site's signature green/gold/red masthead accent — same bar
          used on the header, footer, and hero cards — anchoring this
          slideshow to the rest of the site rather than floating free. */}
      <FlagStripe className="absolute top-0 left-0 z-20" />

      {/* Dissolve slides */}
      {slides.map((slide, i) => {
        const url = slideImage(slide, i);
        const posClass = slide.position === 'bg-top'
          ? 'object-top'
          : slide.position === 'bg-bottom'
            ? 'object-bottom'
            : 'object-[75%_35%]';
        const isActive = i === currentSlide;

        return (
          <div
            key={slide.id || i}
            className={`absolute inset-0 w-full h-full transition-[opacity,filter] duration-[1400ms] ease-out ${
              isActive ? 'opacity-100 blur-0 z-[1] pointer-events-auto' : 'opacity-0 blur-md z-0 pointer-events-none'
            }`}
          >
            <div
              className={`absolute inset-0 w-full h-full transition-transform duration-[8000ms] ease-out ${
                isActive ? 'scale-110' : 'scale-100'
              }`}
            >
              <img
                src={url}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover ${posClass}`}
              />
            </div>

            {/* Light overall grade — just enough to seat the frame, kept
                mostly out of the way so the photograph reads at full
                colour everywhere. Legibility under the placard and the
                nav arrows comes from their own solid panels instead of a
                frame-wide scrim. */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#090D14]/35 via-transparent to-[#090D14]/30 pointer-events-none" />
          </div>
        );
      })}

      {/* Faint editorial gridline texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:4rem_4rem] z-[1]" />

      {/* Oversized watermark map — kept very quiet so it reads as texture, not a shape. */}
      <ZimbabweMap
        className="pointer-events-none absolute -right-24 -bottom-32 h-[32rem] w-auto text-white/[0.025] hidden lg:block z-[1]"
        highlightClassName="fill-[#DCA11D]/[0.06]"
      />

      {/* Arrow navigation — solid parliament-black discs with a gold
          outline, turning solid flag-red on hover. */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goPrevSlide}
            aria-label="Previous slide"
            className="group absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full border border-[#DCA11D]/50 bg-[#090D14]/90 text-white shadow-lg shadow-black/40 transition-all duration-300 hover:bg-[#C8102E] hover:border-[#C8102E]"
          >
            <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <button
            onClick={goNextSlide}
            aria-label="Next slide"
            className="group absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full border border-[#DCA11D]/50 bg-[#090D14]/90 text-white shadow-lg shadow-black/40 transition-all duration-300 hover:bg-[#C8102E] hover:border-[#C8102E]"
          >
            <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
          </button>
        </>
      )}

      {/* Editorial placard — a flat, solid panel (no gradients) so the
          headline, meta row, and actions stay legible no matter what the
          photograph behind them looks like, while still showing it
          through the transparency. */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 pb-10 sm:pb-12 md:pb-16">
          <div
            key={currentSlide}
            className="relative max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 bg-[#090D14]/62 backdrop-blur-xl border border-[#DCA11D]/25 rounded-2xl p-6 sm:p-8 shadow-2xl"
          >
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-[#DCA11D] uppercase bg-[#044D29]/90 border border-[#DCA11D]/50 px-3.5 py-1.5 rounded-md">
              <ShieldCheck className="h-3.5 w-3.5" />
              {slides[currentSlide].badge}
            </span>

            <h2 className="font-sans font-black uppercase leading-[0.92] text-white mt-4 select-none text-3xl sm:text-5xl md:text-6xl tracking-tight">
              {slides[currentSlide].title}
            </h2>

            <p className="mt-3 font-serif text-sm sm:text-base text-white/85 leading-relaxed max-w-xl">
              {slides[currentSlide].description}
            </p>

            {/* Spec-sheet meta row */}
            <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-4">
              {slideMeta(slides[currentSlide]).map((m) => (
                <div key={m.label}>
                  <div className="text-[9px] font-black uppercase tracking-[0.22em] text-[#DCA11D]">{m.label}</div>
                  <div className="mt-1 font-serif text-sm text-white/85">{m.value}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 mt-6">
              <a
                href={slides[currentSlide].cta_url}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-[#DCA11D] !text-[#090D14] hover:!text-white font-black text-xs tracking-widest uppercase rounded-lg shadow-xl hover:!bg-[#090D14] border border-[#DCA11D] hover:border-[#090D14] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span className="!text-inherit">{slides[currentSlide].cta_label}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform !text-inherit" />
              </a>
              <a
                href="/contact/"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-[#3FBF72]/70 !text-white hover:!text-white font-black text-xs tracking-widest uppercase rounded-lg hover:!bg-[#C8102E] hover:border-[#C8102E] transition-all duration-300"
              >
                <span className="!text-white">Constituency Office</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform !text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-right slide navigator — a dock of thumbnails that magnify
          and lift toward the cursor (flyout), flanked by text prev/next
          controls and a numbered counter with its own progress hairline.
          Thumbnails settle back into a flat row once the pointer leaves. */}
      {slides.length > 1 && (
        <div className="absolute right-4 sm:right-8 md:right-12 bottom-10 md:bottom-14 z-30 flex flex-col gap-2">
          <div
            onMouseMove={(e) => setDockMouseX(e.clientX)}
            onMouseLeave={() => setDockMouseX(null)}
            className="flex items-end gap-3 rounded-2xl border border-[#DCA11D]/25 bg-[#090D14]/75 backdrop-blur-xl px-3 py-2.5 shadow-2xl"
          >
            <button
              onClick={goPrevSlide}
              aria-label="Previous slide"
              className="hidden lg:inline-flex items-center gap-1 pb-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-[#DCA11D] transition-colors"
            >
              <ChevronLeft className="h-3 w-3" />
              Prev
            </button>

            <div className="hidden lg:flex items-end gap-2">
              {slides.map((slide, i) => {
                const isActive = i === currentSlide;
                return (
                  <button
                    key={slide.id || i}
                    ref={(el) => (thumbRefs.current[i] = el)}
                    onClick={() => goToSlide(i)}
                    aria-label={`Go to slide ${i + 1}: ${slide.title}`}
                    title={slide.title}
                    style={{ transform: thumbTransform(i), transformOrigin: 'bottom center' }}
                    className={`relative overflow-hidden rounded-lg w-11 h-9 transition-[transform,opacity,filter] duration-200 ease-out ${
                      isActive ? 'ring-2 ring-[#DCA11D] opacity-100' : 'opacity-45 grayscale hover:opacity-90 hover:grayscale-0'
                    }`}
                  >
                    <img
                      src={slideImage(slide, i)}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    {isActive && (
                      <span className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#044D29] via-[#DCA11D] to-[#C8102E]" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={goNextSlide}
              aria-label="Next slide"
              className="hidden lg:inline-flex items-center gap-1 pb-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-[#DCA11D] transition-colors"
            >
              Next
              <ChevronRight className="h-3 w-3" />
            </button>

            {/* Numbered counter — re-triggers its fade/slide-in animation
                on every slide change via the currentSlide key. */}
            <div
              key={currentSlide}
              className="pl-3 ml-1 border-l border-white/15 text-right select-none animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="font-serif leading-none text-white">
                <span className="text-xl sm:text-2xl font-black tabular-nums">{String(currentSlide + 1).padStart(2, '0')}</span>
                <span className="text-xs text-white/40 ml-0.5">/{String(slides.length).padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-white/15 overflow-hidden rounded-full">
            <div
              className="h-full bg-[#DCA11D]"
              style={{ width: `${slideProgress * 100}%`, transition: 'none' }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
