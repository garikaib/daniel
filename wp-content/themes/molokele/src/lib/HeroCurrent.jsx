import React from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import ZimbabweMap from './ZimbabweMap.jsx';

// The live homepage hero — full-bleed crossfade slides behind a floating
// glass card, gold progress-bar pills. Kept as its own component so Home.jsx
// can switch to HeroEditorial.jsx via the "Homepage Hero Style" display
// setting without duplicating the shared slide state/controls.
export default function HeroCurrent({
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
  return (
    <section
      ref={heroSectionRef}
      onMouseEnter={() => setIsHeroPaused(true)}
      onMouseLeave={() => setIsHeroPaused(false)}
      className="relative w-full h-[640px] md:h-[720px] bg-[#090D14] flex items-center overflow-hidden"
    >
      {/* Carousel slides */}
      {slides.map((slide, i) => {
        const url = slideImage(slide, i);
        const focalX = Number.isFinite(slide.focal_x) ? slide.focal_x : 50;
        const focalY = Number.isFinite(slide.focal_y) ? slide.focal_y : 50;

        return (
          <div
            key={slide.id || i}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out z-0 ${
              i === currentSlide ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div
              className={`absolute inset-0 w-full h-full transition-transform duration-[6000ms] ease-out ${
                i === currentSlide ? 'scale-105 translate-y-1' : 'scale-100'
              }`}
            >
              <img
                src={url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: `${focalX}% ${focalY}%` }}
              />
            </div>

            {/* Subtle Parliamentary Gradient Overlay — soft directional tint & bottom vignette */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#090D14]/65 via-[#044D29]/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090D14]/90 via-transparent to-[#090D14]/35 pointer-events-none" />
          </div>
        );
      })}

      {/* Faint editorial gridline texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:4rem_4rem] z-[1]" />

      {/* Oversized watermark map */}
      <ZimbabweMap
        className="pointer-events-none absolute -right-16 -bottom-24 h-[34rem] w-auto text-white/[0.05] hidden lg:block z-[1]"
        highlightClassName="fill-[#DCA11D]/20"
      />

      {/* Arrow navigation */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goPrevSlide}
            aria-label="Previous slide"
            className="group absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full border border-[#DCA11D]/40 bg-[#090D14]/80 text-white backdrop-blur-md transition-all duration-300 hover:bg-[#C8102E] hover:border-[#C8102E]"
          >
            <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <button
            onClick={goNextSlide}
            aria-label="Next slide"
            className="group absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full border border-[#DCA11D]/40 bg-[#090D14]/80 text-white backdrop-blur-md transition-all duration-300 hover:bg-[#C8102E] hover:border-[#C8102E]"
          >
            <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
          </button>
        </>
      )}

      {/* Hero Content Overlays */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-20 text-white">
        <div className="max-w-2xl md:ml-4 flex flex-col justify-center">

          {/* Parliamentary Hero Card */}
          <div
            key={currentSlide}
            className="animate-in fade-in slide-in-from-bottom-4 duration-700 bg-[#090D14]/85 backdrop-blur-xl border border-[#DCA11D]/30 p-8 sm:p-10 rounded-2xl shadow-2xl relative overflow-hidden"
          >
            {/* Top Flag Stripe */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#044D29] via-[#DCA11D] to-[#C8102E]" />

            {/* Badge + slide counter */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] font-black tracking-widest text-[#DCA11D] uppercase bg-[#044D29]/80 border border-[#DCA11D]/40 px-3.5 py-1.5 rounded-md flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#DCA11D]" />
                {slides[currentSlide].badge}
              </span>
              {slides.length > 1 && (
                <span className="font-serif text-xs text-white/50 tabular-nums select-none">
                  <span className="text-[#DCA11D] font-bold">{String(currentSlide + 1).padStart(2, '0')}</span>
                  {' / '}
                  {String(slides.length).padStart(2, '0')}
                </span>
              )}
            </div>

            {/* Slider Heading */}
            <h2 className="font-sans font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mt-6 select-none leading-none pr-6">
              {slides[currentSlide].title}
            </h2>

            {/* Subheading */}
            <p className="mt-4 font-serif text-sm sm:text-base text-slate-200 leading-relaxed max-w-lg">
              {slides[currentSlide].description}
            </p>

            {/* Actions row */}
            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href={slides[currentSlide].cta_url}
                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-[#DCA11D] !text-[#090D14] hover:!text-white font-black text-xs tracking-widest uppercase rounded-lg shadow-xl hover:!bg-[#090D14] border border-[#DCA11D] hover:border-[#090D14] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span className="!text-inherit">{slides[currentSlide].cta_label}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform !text-inherit" />
              </a>
              <a
                href="/contact/"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#044D29] border border-[#DCA11D]/40 !text-white hover:!text-white font-black text-xs tracking-widest uppercase rounded-lg hover:!bg-[#C8102E] hover:border-[#C8102E] transition-all duration-300"
              >
                <span className="!text-white">Constituency Office</span>
              </a>
            </div>
          </div>

          {/* Slide progress indicators — driven by rAF, not CSS animation */}
          {slides.length > 1 && (
            <div className="flex items-center gap-3 mt-8">
              {slides.map((slide, i) => {
                const isPast = i < currentSlide;
                const isCurrent = i === currentSlide;

                return (
                  <button
                    key={slide.id || i}
                    onClick={() => goToSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`group relative h-2 rounded-full overflow-hidden transition-all duration-300 ${
                      isCurrent
                        ? 'w-16 sm:w-24 bg-white/25'
                        : 'w-8 sm:w-12 bg-white/15 hover:bg-white/30'
                    }`}
                  >
                    {/* Past slides: fully filled */}
                    {isPast && (
                      <span className="absolute inset-0 bg-[#DCA11D] rounded-full" />
                    )}

                    {/* Current slide: width driven by slideProgress (0→100%) */}
                    {isCurrent && (
                      <span
                        className="absolute inset-y-0 left-0 bg-[#DCA11D] rounded-full"
                        style={{ width: `${slideProgress * 100}%`, transition: 'none' }}
                      />
                    )}

                    {/* Future slides: empty (just the bg-white/15 track) */}
                  </button>
                );
              })}

              {/* Counter */}
              <span className="font-mono text-xs font-black tracking-wider text-[#DCA11D] ml-1 tabular-nums">
                {String(currentSlide + 1).padStart(2, '0')}<span className="text-white/40 mx-0.5">/</span>{String(slides.length).padStart(2, '0')}
              </span>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
