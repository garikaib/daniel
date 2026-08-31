import React, { useEffect, useRef, useState, useCallback } from 'react';
import { User, Mail, Landmark, FileText, MessageSquare, Newspaper, ArrowRight, X, ChevronLeft, ChevronRight, Play, Square, Camera, Award, ShieldCheck, Scale, CheckCircle2 } from 'lucide-react';
import { useGalleryImages, findBySlug } from '../lib/wpMedia.js';
import FlagStripe from '../lib/FlagStripe.jsx';
import HeroCurrent from '../lib/HeroCurrent.jsx';
import HeroEditorial from '../lib/HeroEditorial.jsx';
import HeroMinimal from '../lib/HeroMinimal.jsx';

const ACCENT_BORDERS = ['border-t-[#044D29]', 'border-t-[#DCA11D]', 'border-t-[#C8102E]'];

// #044D29 reads fine on white/black cards but disappears against this section's
// own #044D29 background — use the brighter brand-plum-light (#3FBF72) instead,
// per the WCAG note on that token in index.css.
const PRIORITIES = [
  {
    icon: Scale,
    title: 'Mining Profit Sharing',
    description: 'Demanding a minimum 10% community profit share from mining corporations operating in Whange to fund local infrastructure, health, and education.',
    topBorder: 'border-t-[#C8102E]',
    iconBg: 'bg-[#C8102E] text-white',
  },
  {
    icon: ShieldCheck,
    title: 'ILO Convention 190',
    description: "Spearheading the parliamentary campaign for Zimbabwe's ratification of ILO Convention 190 to guarantee safe, violence-free workplaces.",
    topBorder: 'border-t-[#DCA11D]',
    iconBg: 'bg-[#DCA11D] text-[#090D14]',
  },
  {
    icon: CheckCircle2,
    title: 'Health & Disability Reform',
    description: 'Advocating for mental health funding, anti-stigma legislation, and an independent Disability Commission to protect vulnerable citizens.',
    topBorder: 'border-t-[#3FBF72]',
    iconBg: 'bg-[#3FBF72] text-[#090D14]',
  },
];

const DEFAULT_HERO_IMAGE = '/wp-content/uploads/2026/08/home_cropped_top_extended.webp';
const FALLBACK_SLIDES = [
  {
    id: 'slide-1',
    image: '',
    position: 'bg-top',
    focal_x: 50,
    focal_y: 50,
    badge: 'Parliament of Zimbabwe | Legislative Leadership',
    title: 'Parliamentary Action & Advocacy',
    description: "Advocating for Whange Central in the National Assembly through key debates, mining profit sharing, and workers' rights legislation.",
    cta_label: 'CDF Tracker',
    cta_url: '/cdf-tracker/',
  },
  {
    id: 'slide-2',
    image: '',
    position: 'bg-center',
    focal_x: 50,
    focal_y: 50,
    badge: 'Whange Central Constituency | Development',
    title: 'Community Empowerment',
    description: 'Auditing developments and overseeing local projects through transparent 2025 CDF initiatives across all Whange Central wards.',
    cta_label: 'Audit Map',
    cta_url: '/cdf-tracker/',
  },
  {
    id: 'slide-3',
    image: '',
    position: 'bg-center',
    focal_x: 50,
    focal_y: 50,
    badge: 'National Assembly | Committee Oversight',
    title: 'A Vision for Whange',
    description: 'Championing mining transparency, environmental protection, public health, and renewable energy policies to safeguard community livelihoods.',
    cta_label: 'Read Biography',
    cta_url: '/biography/',
  },
];
const SLIDE_DURATION = 6000;

export default function Home() {
  const heroSectionRef = useRef(null);
  const cardRefs = useRef([]);
  const galleryTrackRef = useRef(null);
  const galleryItemRefs = useRef([]);
  const lightboxTouchRef = useRef(0);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const { images: wpGalleryImages } = useGalleryImages('photo-gallery');

  const galleryImages = wpGalleryImages.map((img) => ({
    src: img.url || '',
    alt: img.alt || img.title || 'Gallery Image',
  }));

  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0); // 0 → 1

  /* --- Unified rAF progress engine ---
     One clock drives both the gold progress bar AND slide advancement.
     No CSS animation, no setInterval — impossible to desync. */
  const rafRef = useRef(null);
  const slideStartRef = useRef(performance.now());
  const pausedElapsedRef = useRef(0); // how much time had elapsed when we paused

  const advanceSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    slideStartRef.current = performance.now();
    pausedElapsedRef.current = 0;
    setSlideProgress(0);
  }, [slides.length]);

  const goToSlide = useCallback((i) => {
    const idx = ((i % slides.length) + slides.length) % slides.length;
    setCurrentSlide(idx);
    slideStartRef.current = performance.now();
    pausedElapsedRef.current = 0;
    setSlideProgress(0);
  }, [slides.length]);

  const goPrevSlide = useCallback(() => goToSlide(currentSlide - 1), [goToSlide, currentSlide]);
  const goNextSlide = useCallback(() => goToSlide(currentSlide + 1), [goToSlide, currentSlide]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const tick = (now) => {
      if (!isHeroPaused) {
        const elapsed = pausedElapsedRef.current + (now - slideStartRef.current);
        const progress = Math.min(elapsed / SLIDE_DURATION, 1);
        setSlideProgress(progress);

        if (progress >= 1) {
          advanceSlide();
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [slides.length, isHeroPaused, advanceSlide]);

  // When pausing, snapshot elapsed time; when resuming, reset the start reference
  useEffect(() => {
    if (isHeroPaused) {
      pausedElapsedRef.current += performance.now() - slideStartRef.current;
    } else {
      slideStartRef.current = performance.now();
    }
  }, [isHeroPaused]);

  // Fetch slides from WP API
  useEffect(() => {
    fetch('/wp-json/molokele/v1/hero-slides')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
          setCurrentSlide((prev) => (prev < data.length ? prev : 0));
          slideStartRef.current = performance.now();
          pausedElapsedRef.current = 0;
          setSlideProgress(0);
        }
      })
      .catch(() => {});
  }, []);

  // Which hero layout renders — "current" (default) or "alternative", set
  // from Molokele Tools → Display Settings so it can be swapped without a
  // deploy. Both read the same slides/state above.
  const [heroDisplayMode, setHeroDisplayMode] = useState('current');
  useEffect(() => {
    fetch('/wp-json/molokele/v1/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hero_display_mode) {
          setHeroDisplayMode(data.hero_display_mode);
        }
      })
      .catch(() => {});
  }, []);

  const slideImage = (slide, i) => slide.image || galleryImages[i]?.src || DEFAULT_HERO_IMAGE;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        setLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, galleryImages.length]);

  const [latestPosts, setLatestPosts] = useState([]);
  useEffect(() => {
    fetch('/wp-json/wp/v2/posts?per_page=3&_embed')
      .then((res) => res.json())
      .then((data) => setLatestPosts(Array.isArray(data) ? data : []))
      .catch(() => {});
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
      { threshold: 0.15 }
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const quickLinks = [
    {
      title: "Meet Hon. Molokele",
      description: "Learn about Hon. Molokele's biography, union legacy, education, and name reclamation journey.",
      url: "/biography/",
      icon: User,
    },
    {
      title: "CDF Tracker",
      description: "Live status updates and audits of Constituency Development Fund projects across Whange Central.",
      url: "/cdf-tracker/",
      icon: Landmark,
    },
    {
      title: "In Parliament",
      description: "Read about legislative debates, mining profit-sharing policies, public health, and labor conventions.",
      url: "/in-parliament/",
      icon: Scale,
    },
    {
      title: "Speeches & Debates",
      description: "Access Hansard excerpts, parliamentary debates, and public transcripts from the National Assembly.",
      url: "/category/speeches/",
      icon: MessageSquare,
    },
    {
      title: "News & Updates",
      description: "Read local and national press updates, constituency news, and media releases regarding Whange Central.",
      url: "/news-media/",
      icon: Newspaper,
    },
    {
      title: "Get in Touch",
      description: "Contact the constituency office, Mr. Thulani Moyo (PA / Spokesperson), Mrs Sukoluhle Ngwenya, or send an email.",
      url: "/contact/",
      icon: Mail,
    },
  ];

  return (
    <div className="w-full bg-[#FAF9F5] dark:bg-[#090D14] font-sans relative overflow-x-hidden">
      

      {/* Homepage hero — swaps between HeroCurrent.jsx,
          HeroEditorial.jsx, and HeroMinimal.jsx based on the "Homepage Hero Style"
          display setting (Molokele Tools → Display Settings). All share the same
          slide state/controls above. */}
      {heroDisplayMode === 'minimal' ? (
        <HeroMinimal
          heroSectionRef={heroSectionRef}
          setIsHeroPaused={setIsHeroPaused}
          slides={slides}
          currentSlide={currentSlide}
          slideProgress={slideProgress}
          goPrevSlide={goPrevSlide}
          goNextSlide={goNextSlide}
          goToSlide={goToSlide}
          slideImage={slideImage}
        />
      ) : heroDisplayMode === 'alternative' ? (
        <HeroEditorial
          heroSectionRef={heroSectionRef}
          setIsHeroPaused={setIsHeroPaused}
          slides={slides}
          currentSlide={currentSlide}
          slideProgress={slideProgress}
          goPrevSlide={goPrevSlide}
          goNextSlide={goNextSlide}
          goToSlide={goToSlide}
          slideImage={slideImage}
        />
      ) : (
        <HeroCurrent
          heroSectionRef={heroSectionRef}
          setIsHeroPaused={setIsHeroPaused}
          slides={slides}
          currentSlide={currentSlide}
          slideProgress={slideProgress}
          goPrevSlide={goPrevSlide}
          goNextSlide={goNextSlide}
          goToSlide={goToSlide}
          slideImage={slideImage}
        />
      )}

      {/* Feature Quick Links Grid */}
      <section className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link, idx) => {
            const Icon = link.icon;
            const activeBorder = ACCENT_BORDERS[idx % ACCENT_BORDERS.length];
            const padIndex = String(idx + 1).padStart(2, '0');

            return (
              <a
                key={idx}
                ref={(el) => (cardRefs.current[idx] = el)}
                href={link.url}
                className={`molokele-card-reveal group relative flex flex-col justify-between overflow-hidden bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 border-t-4 ${activeBorder} p-8 rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 z-10`}
                style={{ transitionDelay: `${idx * 70}ms` }}
              >
                <span className="absolute bottom-4 right-6 font-serif font-black text-7xl select-none pointer-events-none text-slate-100 dark:text-white/[0.04] group-hover:text-[#DCA11D]/20 transition-colors duration-300">
                  {padIndex}
                </span>

                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#044D29]/10 text-[#044D29] dark:text-[#DCA11D] border border-[#044D29]/20 transition-all duration-300 ease-out group-hover:scale-105 group-hover:bg-[#044D29] group-hover:text-[#DCA11D] group-hover:shadow-md">
                    <Icon className="h-6 w-6 stroke-[2]" />
                  </div>
                  <h3 className="mt-6 font-sans font-black text-lg tracking-wider text-[#090D14] dark:text-white uppercase group-hover:text-[#044D29] dark:group-hover:text-[#DCA11D] transition-colors duration-300">
                    {link.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 dark:text-white/60 leading-relaxed max-w-[92%] font-serif">
                    {link.description}
                  </p>
                </div>

                <div className="relative mt-8 flex items-center gap-2 text-xs font-black tracking-widest text-[#044D29] dark:text-[#DCA11D] group-hover:text-[#C8102E] uppercase transition-colors duration-300">
                  <span>Explore Section</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Official Parliamentary Priorities Section */}
      <section className="bg-[#044D29] text-white py-20 relative overflow-hidden border-y border-[#DCA11D]/30">
        {/* Subtle background texture */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#DCA11D_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 font-sans font-black text-xs uppercase tracking-[0.25em] text-[#DCA11D] bg-[#090D14]/60 border border-[#DCA11D]/30 px-4 py-1.5 rounded-full">
              <Award className="h-4 w-4" />
              Parliamentary Advocacy &amp; Pillars
            </span>
            <h2 className="mt-4 font-sans font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-tight">
              Championing Whange Central in Parliament
            </h2>
            <p className="mt-4 font-serif text-base sm:text-lg text-white/80 leading-relaxed">
              Legislative leadership grounded in trade union legacy, community profit-sharing, worker rights, and public health accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRIORITIES.map((item, idx) => {
              const Icon = item.icon;
              const padIndex = String(idx + 1).padStart(2, '0');

              return (
                <div
                  key={item.title}
                  className={`group relative overflow-hidden bg-[#090D14]/80 border border-[#DCA11D]/20 border-t-4 ${item.topBorder} rounded-xl p-8 hover:border-[#DCA11D]/50 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300`}
                >
                  <span className="absolute bottom-3 right-5 font-serif font-black text-6xl select-none pointer-events-none text-white/[0.04] group-hover:text-[#DCA11D]/10 transition-colors duration-300">
                    {padIndex}
                  </span>

                  <div className={`relative flex h-12 w-12 items-center justify-center rounded-lg mb-6 ${item.iconBg}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="relative font-sans font-black text-xl uppercase tracking-wide text-white">
                    {item.title}
                  </h3>
                  <p className="relative mt-3 font-serif text-sm text-white/65 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest News and Updates */}
      {latestPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#044D29] border border-[#DCA11D]/30 shadow-md text-[#DCA11D]">
                <Newspaper className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-sans font-black text-xl sm:text-2xl uppercase tracking-wide text-[#090D14] dark:text-white">
                  News &amp; Updates
                </h2>
                <p className="font-serif text-xs text-slate-500 dark:text-white/50">
                  Latest announcements and press coverage from Whange Central
                </p>
              </div>
            </div>
            <a
              href="/news-media/"
              className="hidden sm:inline-flex items-center gap-2 font-sans font-black text-xs tracking-widest uppercase !text-white hover:!text-white bg-[#044D29] hover:!bg-[#C8102E] transition-all border border-[#DCA11D]/40 rounded-full px-6 py-2.5 shadow-md"
            >
              <span className="!text-white">View All Updates</span>
              <ArrowRight className="h-3.5 w-3.5 !text-white" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {latestPosts.map((post, index) => {
              const image = post._embedded?.['wp:featuredmedia']?.[0];
              const postNum = String(index + 1).padStart(2, '0');
              const activeBorder = ACCENT_BORDERS[index % ACCENT_BORDERS.length];

              return (
                <a
                  key={post.id}
                  href={post.link}
                  className={`group flex flex-col overflow-hidden bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 border-t-4 ${activeBorder} rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300`}
                >
                  {image && (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={image.source_url}
                        alt={image.alt_text || ''}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="h-2 w-2 rounded-full bg-[#C8102E]" />
                      <span className="font-sans font-black text-[9px] tracking-widest uppercase text-[#044D29] dark:text-[#DCA11D]">
                        Constituency Update • {postNum}
                      </span>
                    </div>
                    <h3
                      className="font-sans font-bold text-base sm:text-lg uppercase tracking-wide text-[#090D14] dark:text-white group-hover:text-[#C8102E] transition-colors leading-snug"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                    {post.excerpt?.rendered && (
                      <div
                        className="mt-2 font-serif text-[13px] text-slate-600 dark:text-white/60 leading-relaxed line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                      />
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Constituency Photo Gallery Section */}
      <section className="bg-[#090D14] py-20 sm:py-24 relative overflow-hidden border-t border-[#DCA11D]/30">
        <FlagStripe className="absolute top-0 left-0" />

        {/* Ambient flag-colour glow + texture — without this the section is a flat
            void on large screens; the gold dot grid and green/red blooms give it the
            same "designed" depth as the Priorities section instead of reading as empty. */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(#DCA11D_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="absolute -top-40 -right-24 h-[30rem] w-[30rem] rounded-full bg-[#044D29]/40 blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-24 h-[24rem] w-[24rem] rounded-full bg-[#C8102E]/[0.07] blur-[130px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-10 flex justify-between items-center border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#044D29] border border-[#DCA11D]/40 text-[#DCA11D]">
                <Camera className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-sans font-black text-xl sm:text-2xl uppercase tracking-wide text-white">
                  Constituency Gallery
                </h2>
                <p className="font-serif text-xs text-[#DCA11D]/80">
                  Photographs from Whange Central community events &amp; parliamentary visits
                </p>
              </div>
            </div>
            
            {galleryImages.length > 0 && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const track = galleryTrackRef.current;
                    if (!track) return;
                    const itemWidth = track.querySelector('[data-gallery-item]')?.offsetWidth || 320;
                    track.scrollBy({ left: -(itemWidth + 24), behavior: 'smooth' });
                  }} 
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 hover:bg-[#044D29] hover:text-[#DCA11D] hover:border-[#DCA11D]/50 transition-all duration-200"
                  aria-label="Previous photos"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => {
                    const track = galleryTrackRef.current;
                    if (!track) return;
                    const itemWidth = track.querySelector('[data-gallery-item]')?.offsetWidth || 320;
                    track.scrollBy({ left: itemWidth + 24, behavior: 'smooth' });
                  }} 
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 hover:bg-[#044D29] hover:text-[#DCA11D] hover:border-[#DCA11D]/50 transition-all duration-200"
                  aria-label="Next photos"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Scrollable gallery track */}
          <div
            ref={galleryTrackRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            onScroll={() => {
              const track = galleryTrackRef.current;
              if (!track || galleryImages.length === 0) return;
              const scrollRatio = track.scrollLeft / (track.scrollWidth - track.clientWidth || 1);
              const idx = Math.round(scrollRatio * (galleryImages.length - 1));
              setActiveGalleryIndex(Math.max(0, Math.min(idx, galleryImages.length - 1)));
            }}
          >
            {galleryImages.map((img, i) => (
              <div
                key={i}
                data-gallery-item
                ref={(el) => (galleryItemRefs.current[i] = el)}
                onClick={() => {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }}
                className="group relative aspect-[4/3] w-[82%] sm:w-[44%] lg:w-[30%] flex-shrink-0 snap-start cursor-pointer rounded-xl bg-gradient-to-b from-white/[0.09] to-white/[0.02] border border-white/15 p-1.5 shadow-xl shadow-black/40 hover:border-[#DCA11D]/60 hover:shadow-[#DCA11D]/10 transition-all duration-300"
              >
                {/* Matted inner frame — separates the photo from the section's own
                    dark background instead of letting dark photos melt into it. */}
                <div className="relative h-full w-full overflow-hidden rounded-lg">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full bg-white/5 object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Hover overlay with gentle gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090D14]/85 via-[#090D14]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5">
                    <span className="text-[#090D14] font-sans font-black text-[9px] tracking-widest uppercase bg-[#DCA11D] px-5 py-2 rounded-full shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      View Photo
                    </span>
                  </div>
                  {/* Photo number badge */}
                  <span className="absolute top-3 left-3 font-mono text-[10px] font-black tracking-widest text-white/70 bg-[#090D14]/70 border border-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {/* Flag-accent hairline on hover */}
                  <span className="absolute bottom-0 left-0 h-[2.5px] w-full bg-gradient-to-r from-[#044D29] via-[#DCA11D] to-[#C8102E] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>

          {/* Scroll position dots */}
          {galleryImages.length > 3 && (
            <div className="flex justify-center gap-1.5 mt-4">
              {galleryImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const el = galleryItemRefs.current[i];
                    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
                  }}
                  aria-label={`Scroll to photo ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeGalleryIndex
                      ? 'w-6 bg-[#DCA11D]'
                      : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && galleryImages.length > 0 && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-[#090D14]/95 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) setLightboxOpen(false); }}
          onTouchStart={(e) => { lightboxTouchRef.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - (lightboxTouchRef.current || 0);
            if (Math.abs(dx) > 60) {
              if (dx > 0) setLightboxIndex((p) => (p > 0 ? p - 1 : galleryImages.length - 1));
              else setLightboxIndex((p) => (p < galleryImages.length - 1 ? p + 1 : 0));
            }
          }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 sm:px-8 py-4 flex-shrink-0">
            <span className="text-xs font-black tracking-widest uppercase text-[#DCA11D] font-sans">
              {String(lightboxIndex + 1).padStart(2, '0')} <span className="text-white/30">/ {String(galleryImages.length).padStart(2, '0')}</span>
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 text-white/70 hover:text-[#C8102E] transition-colors focus:outline-none"
              aria-label="Close gallery"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Main image area */}
          <div className="relative flex-1 flex items-center justify-center px-4 min-h-0">
            <button
              onClick={() => setLightboxIndex((p) => (p > 0 ? p - 1 : galleryImages.length - 1))}
              className="absolute left-2 sm:left-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-[#044D29] hover:text-[#DCA11D] hover:border-[#DCA11D]/50 transition-all duration-200 focus:outline-none"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="max-h-[65vh] max-w-[85vw] md:max-h-[72vh] md:max-w-[75vw] flex items-center justify-center overflow-hidden rounded-xl">
              <img
                key={lightboxIndex}
                src={galleryImages[lightboxIndex].src}
                alt={galleryImages[lightboxIndex].alt}
                className="max-h-[65vh] max-w-full md:max-h-[72vh] object-contain rounded-xl select-none animate-in fade-in zoom-in-95 duration-300"
                draggable={false}
              />
            </div>

            <button
              onClick={() => setLightboxIndex((p) => (p < galleryImages.length - 1 ? p + 1 : 0))}
              className="absolute right-2 sm:right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-[#044D29] hover:text-[#DCA11D] hover:border-[#DCA11D]/50 transition-all duration-200 focus:outline-none"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Caption + thumbnail strip */}
          <div className="flex-shrink-0 px-4 sm:px-8 pb-4 pt-3">
            {galleryImages[lightboxIndex].alt && (
              <p className="font-serif text-sm text-slate-300 text-center mb-3 leading-relaxed max-w-xl mx-auto">
                {galleryImages[lightboxIndex].alt}
              </p>
            )}

            <div className="flex gap-2 justify-center items-center overflow-x-auto py-2 px-4 max-w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`relative w-14 aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 outline-none ${
                    idx === lightboxIndex 
                      ? 'ring-2 ring-[#DCA11D] ring-offset-1 ring-offset-[#090D14] scale-105 opacity-100' 
                      : 'opacity-30 hover:opacity-80 grayscale hover:grayscale-0'
                  }`}
                >
                  <img src={img.src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
