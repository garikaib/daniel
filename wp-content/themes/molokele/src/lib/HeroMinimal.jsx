import React, { useRef, useState } from 'react';
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
  const thumbRefs = useRef([]);
  const [dockMouseX, setDockMouseX] = useState(null);

  const thumbMetrics = (i) => {
    const el = thumbRefs.current[i];
    if (dockMouseX == null || !el) {
      return { transform: 'translateY(0px) scale(1)', zIndex: 1, dropShadow: 'none', eased: 0 };
    }
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const distance = dockMouseX - center;
    const radius = 120;
    const proximity = Math.max(0, 1 - Math.abs(distance) / radius);
    const eased = proximity * proximity;
    const scale = 1 + eased * 1.6;
    const lift = eased * 24;
    return {
      transform: `translateY(-${lift.toFixed(1)}px) scale(${scale.toFixed(3)})`,
      zIndex: Math.round(1 + eased * 30),
      dropShadow: eased > 0.1 ? `drop-shadow(0 12px 14px rgba(0,0,0,0.6))` : 'none',
      eased,
    };
  };

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
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pb-20 sm:pb-24 md:pb-28">
        <div className="flex items-end justify-between gap-4">
          
          {/* ── Left Bottom: Flag-Accented Minimal Category Badge ── */}
          <div
            key={currentSlide}
            className="inline-flex items-center animate-in fade-in slide-in-from-bottom-2 duration-300 select-none mb-1 sm:mb-2"
          >
            <div className="relative overflow-hidden rounded-full p-[1px] bg-gradient-to-r from-[#044D29] via-[#DCA11D] to-[#C8102E] shadow-xl">
              <div className="flex items-center gap-2 bg-[#090D14]/90 backdrop-blur-xl px-3 py-1.5 rounded-full">
                {/* 3-stripe micro flag bar */}
                <div className="flex flex-col gap-[2px] w-[3px] h-3 rounded-full overflow-hidden flex-shrink-0">
                  <span className="h-1 w-full bg-[#044D29]" />
                  <span className="h-1 w-full bg-[#DCA11D]" />
                  <span className="h-1 w-full bg-[#C8102E]" />
                </div>
                
                <span className="inline-flex items-center gap-1.25 text-[9.5px] font-black tracking-[0.18em] text-[#DCA11D] uppercase">
                  <ShieldCheck className="h-3 w-3 text-[#3FBF72]" />
                  {categoryBadge}
                </span>
              </div>
            </div>
          </div>

          {/* ── Right Bottom: Slider Dock (Timer, Controls, Thumbnails & Counter) ── */}
          {slides.length > 1 && (
            <div className="flex flex-col gap-2 ml-auto flex-shrink-0">
              <div
                onMouseMove={(e) => setDockMouseX(e.clientX)}
                onMouseLeave={() => setDockMouseX(null)}
                className="relative overflow-visible flex items-center gap-3 rounded-2xl border border-[#DCA11D]/30 bg-[#090D14]/85 backdrop-blur-xl px-3.5 py-2 shadow-2xl"
              >
                {/* Top Signature Flag Accent Line */}
                <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-[#044D29] via-[#DCA11D] to-[#C8102E] pointer-events-none" />

                {/* PREV Text Button */}
                <button
                  onClick={goPrevSlide}
                  aria-label="Previous slide"
                  className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/80 hover:text-[#DCA11D] hover:bg-[#044D29]/40 px-2 py-1 rounded transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-3 w-3 text-[#DCA11D]" />
                  Prev
                </button>

                {/* Thumbnails */}
                <div className="flex items-center gap-2">
                  {slides.map((slide, i) => {
                    const isActive = i === currentSlide;
                    const { transform, zIndex, dropShadow, eased } = thumbMetrics(i);
                    const revealed = isActive || eased > 0.1;
                    const filterValue = revealed
                      ? (dropShadow !== 'none' ? dropShadow : '')
                      : 'grayscale(1)';

                    return (
                      <button
                        key={slide.id || i}
                        ref={(el) => (thumbRefs.current[i] = el)}
                        onClick={() => goToSlide(i)}
                        aria-label={`Go to slide ${i + 1}: ${slide.title}`}
                        style={{ zIndex }}
                        className={`relative overflow-visible rounded-md w-11 h-8 sm:w-12 sm:h-9 transition-opacity duration-200 cursor-pointer ${
                          revealed ? 'opacity-100' : 'opacity-40 hover:opacity-80'
                        }`}
                      >
                        <span
                          style={{ transform, filter: filterValue, transformOrigin: 'bottom center' }}
                          className={`relative block h-full w-full overflow-hidden rounded-md transition-[transform,filter] duration-200 ${
                            isActive
                              ? 'ring-2 ring-[#DCA11D] shadow-[0_0_10px_rgba(220,161,29,0.35)]'
                              : 'border border-white/20 hover:border-[#DCA11D]/50'
                          }`}
                        >
                          <img
                            src={slideImage(slide, i)}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                          {isActive && (
                            <span className="absolute inset-x-0 bottom-0 h-[2.5px] bg-gradient-to-r from-[#044D29] via-[#DCA11D] to-[#C8102E]" />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* NEXT Text Button */}
                <button
                  onClick={goNextSlide}
                  aria-label="Next slide"
                  className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/80 hover:text-[#DCA11D] hover:bg-[#044D29]/40 px-2 py-1 rounded transition-colors cursor-pointer"
                >
                  Next
                  <ChevronRight className="h-3 w-3 text-[#DCA11D]" />
                </button>

                {/* Numbered Counter with Parliament Accent */}
                <div
                  key={currentSlide}
                  className="pl-3 ml-1 border-l border-white/15 text-right select-none animate-in fade-in duration-200"
                >
                  <div className="font-mono leading-none text-white">
                    <span className="text-base sm:text-lg font-black text-[#DCA11D] tabular-nums">
                      {String(currentSlide + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[11px] text-white/50 ml-0.5">
                      /{String(slides.length).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-time rAF Progress Bar Timeline in Signature Flag Gradient */}
              <div className="h-[3px] w-full bg-white/15 overflow-hidden rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-[#044D29] via-[#DCA11D] to-[#C8102E]"
                  style={{ width: `${slideProgress * 100}%`, transition: 'none' }}
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
