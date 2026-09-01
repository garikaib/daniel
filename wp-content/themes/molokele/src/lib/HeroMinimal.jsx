import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import ZimbabweMap from './ZimbabweMap.jsx';
import FlagStripe from './FlagStripe.jsx';

/**
 * HeroMinimal — Pure Minimalist Homepage Hero Layout
 * 
 * Inspired by ultra-clean, photo-first presentation:
 * - Completely removes heavy CTA buttons.
 * - Minimised, low-profile caption placed on the bottom-left with parliament palette.
 * - Slider timer indicator, thumbnails, prev/next controls, and slide counter docked on the bottom-right.
 * - 100% unobstructed photo visibility.
 */
export default function HeroMinimal({
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
  const [hoveredSlide, setHoveredSlide] = useState(null);

  const activeSlide = slides[currentSlide] || slides[0] || {};
  const categoryBadge = activeSlide.badge ? activeSlide.badge.split('|')[0].trim() : 'Leadership Legacy';

  return (
    <section
      ref={heroSectionRef}
      onMouseEnter={() => setIsHeroPaused(true)}
      onMouseLeave={() => setIsHeroPaused(false)}
      onFocus={() => setIsHeroPaused(true)}
      onBlur={() => setIsHeroPaused(false)}
      aria-roledescription="carousel"
      aria-label="Parliamentary Highlights Carousel"
      className="relative w-full h-[88vh] min-h-[580px] md:min-h-[760px] bg-[#090D14] flex flex-col justify-between overflow-hidden"
    >
      {/* Signature Zimbabwe Flag Stripe top masthead accent */}
      <FlagStripe className="absolute top-0 left-0 z-30" />

      {/* Crossfade Slides */}
      {slides.map((slide, i) => {
        const url = slideImage(slide, i);
        const focalX = Number.isFinite(slide.focal_x) ? slide.focal_x : 50;
        const focalY = Number.isFinite(slide.focal_y) ? slide.focal_y : 50;
        const isActive = i === currentSlide;

        return (
          <div
            key={slide.id || i}
            aria-hidden={!isActive}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out z-0 ${
              isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div
              className={`absolute inset-0 w-full h-full transition-transform duration-[7000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
            >
              <img
                src={url}
                alt={slide.title || `Whange Central parliamentary update ${i + 1}`}
                fetchPriority={i === 0 ? 'high' : 'auto'}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: `${focalX}% ${focalY}%` }}
              />
            </div>
          </div>
        );
      })}

      {/* Subtle grid texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:4rem_4rem] z-[1]" />

      {/* Watermark Map */}
      <ZimbabweMap
        className="pointer-events-none absolute -right-20 -bottom-28 h-[28rem] w-auto text-white/[0.025] hidden lg:block z-[1]"
        highlightClassName="fill-[#DCA11D]/10"
      />

      {/* Floating Side Arrow Navigation (Discreet Flag Accented Discs) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goPrevSlide}
            aria-label="Previous slide"
            className="group absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#DCA11D]/30 bg-[#090D14]/75 text-white/90 backdrop-blur-md transition-all duration-300 hover:bg-[#044D29] hover:border-[#DCA11D] hover:text-[#DCA11D] hover:shadow-[0_0_15px_rgba(220,161,29,0.25)] cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <button
            onClick={goNextSlide}
            aria-label="Next slide"
            className="group absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#DCA11D]/30 bg-[#090D14]/75 text-white/90 backdrop-blur-md transition-all duration-300 hover:bg-[#044D29] hover:border-[#DCA11D] hover:text-[#DCA11D] hover:shadow-[0_0_15px_rgba(220,161,29,0.25)] cursor-pointer"
          >
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </>
      )}

      {/* Empty Top Space to push content to the bottom */}
      <div className="relative z-10" />

      {/* Bottom Area: Ultra-Minimal Flag Badge (Left) + Slider Navigation & Flag-Gradient Timer (Right) */}
      <div className="relative z-20 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 w-full pb-16 sm:pb-24 md:pb-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
          
          {/* ── Left Bottom: Flag-Accented Minimal Category Badge ── */}
          <div
            key={currentSlide}
            className="inline-flex items-center self-start animate-in fade-in slide-in-from-bottom-2 duration-300 select-none mb-0.5 sm:mb-2"
          >
            <div className="relative overflow-hidden rounded-full p-[1px] bg-gradient-to-r from-[#044D29] via-[#DCA11D] to-[#C8102E] shadow-lg">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-[#090D14]/90 backdrop-blur-xl px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full">
                {/* 3-stripe micro flag bar */}
                <div className="flex flex-col gap-[1.5px] sm:gap-[2px] w-[2.5px] sm:w-[3px] h-2.5 sm:h-3 rounded-full overflow-hidden flex-shrink-0">
                  <span className="h-1 w-full bg-[#044D29]" />
                  <span className="h-1 w-full bg-[#DCA11D]" />
                  <span className="h-1 w-full bg-[#C8102E]" />
                </div>
                
                <span className="inline-flex items-center gap-1 sm:gap-1.25 text-[8.5px] sm:text-[9.5px] font-black tracking-[0.14em] sm:tracking-[0.18em] text-[#DCA11D] uppercase">
                  <ShieldCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#3FBF72]" />
                  {categoryBadge}
                </span>
              </div>
            </div>
          </div>

          {/* ── Right Bottom: Sleek Segmented Progress Pills & Minimal Controls ── */}
          {slides.length > 1 && (
            <div className="sm:ml-auto w-full sm:w-auto flex-shrink-0">
              <div className="relative overflow-visible flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2.5 rounded-full border border-[#DCA11D]/30 bg-[#090D14]/85 backdrop-blur-xl px-2.5 py-1.5 sm:px-3.5 sm:py-2 shadow-2xl">
                {/* Top Signature Flag Accent Line */}
                <div className="absolute top-0 inset-x-4 h-[1.5px] bg-gradient-to-r from-[#044D29] via-[#DCA11D] to-[#C8102E] pointer-events-none" />

                {/* PREV Button */}
                <button
                  onClick={goPrevSlide}
                  aria-label="Previous slide"
                  className="group flex items-center justify-center h-6 w-6 sm:h-7 sm:w-7 rounded-full text-white/70 hover:text-[#DCA11D] hover:bg-white/10 active:scale-90 transition-all duration-200 cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                </button>

                {/* Segmented Progress Pills */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {slides.map((slide, i) => {
                    const isPast = i < currentSlide;
                    const isCurrent = i === currentSlide;
                    const isHovered = hoveredSlide === i;

                    return (
                      <div
                        key={slide.id || i}
                        className="relative flex items-center"
                        onMouseEnter={() => setHoveredSlide(i)}
                        onMouseLeave={() => setHoveredSlide(null)}
                      >
                        {/* Micro-preview tooltip — always mounted so hide/show is a
                            smooth crossfade instead of an instant pop in/out. */}
                        <div
                          className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-28 sm:w-32 p-1.5 rounded-xl bg-[#090D14]/95 border border-[#DCA11D]/40 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.8)] pointer-events-none z-50 select-none origin-bottom transition-all duration-200 ease-out ${
                            isHovered
                              ? 'opacity-100 scale-100 translate-y-0'
                              : 'opacity-0 scale-90 translate-y-1.5'
                          }`}
                        >
                          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
                            <img
                              src={slideImage(slide, i)}
                              alt=""
                              className={`h-full w-full object-cover transition-transform duration-500 ease-out ${
                                isHovered ? 'scale-100' : 'scale-110'
                              }`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#090D14]/80 via-transparent to-transparent" />
                          </div>
                          <div className="mt-1 text-[8.5px] font-bold text-center text-[#DCA11D] uppercase tracking-wider truncate px-0.5">
                            {slide.title || `Slide ${i + 1}`}
                          </div>
                          {/* Downward triangle caret */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#DCA11D]/40" />
                        </div>

                        {/* Interactive Pill Bar — width/colour/ring ease with a
                            soft overshoot curve so growing into the active
                            pill (or settling back down) feels springy rather
                            than a linear resize. */}
                        <button
                          onClick={() => goToSlide(i)}
                          aria-label={`Go to slide ${i + 1}: ${slide.title || ''}`}
                          className={`relative h-2 sm:h-2.5 rounded-full overflow-hidden cursor-pointer transition-[width,background-color,box-shadow] duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-y-125 ${
                            isCurrent
                              ? 'w-12 sm:w-16 bg-white/20 ring-1 ring-[#DCA11D]/50 shadow-[0_0_8px_rgba(220,161,29,0.25)]'
                              : isPast
                              ? 'w-6 sm:w-8 bg-[#DCA11D]/40 hover:bg-[#DCA11D]/70'
                              : 'w-6 sm:w-8 bg-white/20 hover:bg-white/40'
                          }`}
                        >
                          {/* Fill: raf-driven while current (no CSS transition
                              so it can't fight the per-frame updates), but
                              eases smoothly to full/empty the moment the slide
                              hands off so a skipped slide still completes its
                              sweep instead of just vanishing. */}
                          <span
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#044D29] via-[#DCA11D] to-[#C8102E] rounded-full"
                            style={{
                              width: isCurrent ? `${slideProgress * 100}%` : isPast ? '100%' : '0%',
                              transition: isCurrent ? 'none' : 'width 400ms cubic-bezier(0.16,1,0.3,1)',
                            }}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* NEXT Button */}
                <button
                  onClick={goNextSlide}
                  aria-label="Next slide"
                  className="group flex items-center justify-center h-6 w-6 sm:h-7 sm:w-7 rounded-full text-white/70 hover:text-[#DCA11D] hover:bg-white/10 active:scale-90 transition-all duration-200 cursor-pointer"
                >
                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>

                {/* Numbered Counter */}
                <div
                  key={currentSlide}
                  className="pl-2 sm:pl-2.5 ml-0.5 border-l border-white/15 text-right select-none animate-in fade-in zoom-in-95 duration-300 ease-out"
                >
                  <div className="font-mono leading-none">
                    <span className="text-xs sm:text-sm font-black text-[#DCA11D] tabular-nums">
                      {String(currentSlide + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-white/50 ml-0.5">
                      /{String(slides.length).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
