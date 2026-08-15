import React, { useEffect, useRef, useState } from 'react';
import { User, Mail, Landmark, FileText, MessageSquare, Newspaper, ArrowRight, X, ChevronLeft, ChevronRight, Play, Square, Camera, Award, ShieldCheck, Scale, CheckCircle2 } from 'lucide-react';
import { useGalleryImages, findBySlug } from '../lib/wpMedia.js';
import ZimbabweMap from '../lib/ZimbabweMap.jsx';
import FlagStripe from '../lib/FlagStripe.jsx';

const ACCENT_BORDERS = ['border-t-[#044D29]', 'border-t-[#DCA11D]', 'border-t-[#C8102E]'];

const DEFAULT_HERO_IMAGE = '/wp-content/uploads/2026/08/home_cropped_top_extended.webp';
const FALLBACK_SLIDES = [
  {
    id: 'slide-1',
    image: '',
    position: 'bg-top',
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
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const { images: wpGalleryImages } = useGalleryImages('photo-gallery');

  const galleryImages = wpGalleryImages.map((img) => ({
    src: img.url || '',
    alt: img.alt || img.title || 'Gallery Image',
  }));

  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  useEffect(() => {
    fetch('/wp-json/molokele/v1/hero-slides')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
          setCurrentSlide((prev) => (prev < data.length ? prev : 0));
        }
      })
      .catch(() => {});
  }, []);

  const slideImage = (slide, i) => slide.image || galleryImages[i]?.src || DEFAULT_HERO_IMAGE;

  const goToSlide = (i) => setCurrentSlide(((i % slides.length) + slides.length) % slides.length);
  const goPrevSlide = () => goToSlide(currentSlide - 1);
  const goNextSlide = () => goToSlide(currentSlide + 1);

  useEffect(() => {
    if (slides.length <= 1 || isHeroPaused) return undefined;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [slides.length, isHeroPaused, currentSlide]);

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
      

      {/* Hero Section with Zimbabwe Flag Theme Fills */}
      <section
        ref={heroSectionRef}
        onMouseEnter={() => setIsHeroPaused(true)}
        onMouseLeave={() => setIsHeroPaused(false)}
        className="relative w-full h-[640px] md:h-[720px] bg-[#090D14] flex items-center overflow-hidden"
      >
        {/* Carousel slides */}
        {slides.map((slide, i) => {
          const url = slideImage(slide, i);
          const posClass = slide.position === 'bg-top' 
            ? 'object-top' 
            : slide.position === 'bg-bottom' 
              ? 'object-bottom' 
              : 'object-[75%_35%]';

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
                  className={`absolute inset-0 w-full h-full object-cover ${posClass}`}
                />
              </div>

              {/* Subtle Parliamentary Gradient Overlay — soft directional tint & bottom vignette */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#090D14]/65 via-[#044D29]/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090D14]/90 via-transparent to-black/20 pointer-events-none" />
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

            {/* Slide progress indicators */}
            {slides.length > 1 && (
              <div className="flex items-center gap-2.5 mt-8 ml-2">
                {slides.map((slide, i) => (
                  <button
                    key={slide.id || i}
                    onClick={() => goToSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className="group relative h-2 w-10 sm:w-14 rounded-full bg-white/20 overflow-hidden"
                  >
                    {i < currentSlide && <span className="absolute inset-y-0 left-0 w-full rounded-full bg-[#DCA11D]" />}
                    {i === currentSlide && (
                      <span
                        key={`progress-${currentSlide}`}
                        className="absolute inset-y-0 left-0 rounded-full bg-[#DCA11D] animate-molokele-hero-progress"
                        style={{
                          animationDuration: `${SLIDE_DURATION}ms`,
                          animationPlayState: isHeroPaused ? 'paused' : 'running',
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>
      </section>

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
            <span className="inline-flex items-center gap-2 font-sans font-black text-xs uppercase tracking-[0.25em] text-[#DCA11D] bg-black/40 border border-[#DCA11D]/30 px-4 py-1.5 rounded-full">
              <Award className="h-4 w-4" />
              Parliamentary Advocacy &amp; Pillars
            </span>
            <h2 className="mt-4 font-sans font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-tight">
              Championing Whange Central in Parliament
            </h2>
            <p className="mt-4 font-serif text-base sm:text-lg text-slate-200 leading-relaxed">
              Legislative leadership grounded in trade union legacy, community profit-sharing, worker rights, and public health accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#090D14]/80 border border-[#DCA11D]/30 rounded-xl p-8 hover:border-[#DCA11D] transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#C8102E] text-white mb-6">
                <Scale className="h-6 w-6" />
              </div>
              <h3 className="font-sans font-black text-xl uppercase tracking-wide text-white">
                Mining Profit Sharing
              </h3>
              <p className="mt-3 font-serif text-sm text-slate-300 leading-relaxed">
                Demanding a minimum 10% community profit share from mining corporations operating in Whange to fund local infrastructure, health, and education.
              </p>
            </div>

            <div className="bg-[#090D14]/80 border border-[#DCA11D]/30 rounded-xl p-8 hover:border-[#DCA11D] transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#DCA11D] text-black mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-sans font-black text-xl uppercase tracking-wide text-white">
                ILO Convention 190
              </h3>
              <p className="mt-3 font-serif text-sm text-slate-300 leading-relaxed">
                Spearheading the parliamentary campaign for Zimbabwe's ratification of ILO Convention 190 to guarantee safe, violence-free workplaces.
              </p>
            </div>

            <div className="bg-[#090D14]/80 border border-[#DCA11D]/30 rounded-xl p-8 hover:border-[#DCA11D] transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#044D29] text-white border border-[#DCA11D]/40 mb-6">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-sans font-black text-xl uppercase tracking-wide text-white">
                Health &amp; Disability Reform
              </h3>
              <p className="mt-3 font-serif text-sm text-slate-300 leading-relaxed">
                Advocating for mental health funding, anti-stigma legislation, and an independent Disability Commission to protect vulnerable citizens.
              </p>
            </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:divide-x md:divide-slate-200/60 dark:md:divide-white/10">
            {latestPosts.map((post, index) => {
              const image = post._embedded?.['wp:featuredmedia']?.[0];
              const postNum = String(index + 1).padStart(2, '0');

              return (
                <a
                  key={post.id}
                  href={post.link}
                  className={`group block overflow-hidden transition-all duration-300 relative ${
                    index > 0 ? 'md:pl-8' : ''
                  }`}
                >
                  {image && (
                    <div className="aspect-[16/10] overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 mb-4 shadow-sm">
                      <img
                        src={image.source_url}
                        alt={image.alt_text || ''}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div>
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
                        className="mt-2 font-serif text-[13px] text-slate-600 dark:text-white/60 leading-relaxed line-clamp-2 pr-4"
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
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const track = galleryTrackRef.current;
                    if (track) track.scrollBy({ left: -320, behavior: 'smooth' });
                  }} 
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DCA11D]/30 text-white hover:bg-[#C8102E] hover:border-[#C8102E] transition-all"
                  aria-label="Previous photos"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => {
                    const track = galleryTrackRef.current;
                    if (track) track.scrollBy({ left: 320, behavior: 'smooth' });
                  }} 
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DCA11D]/30 text-white hover:bg-[#C8102E] hover:border-[#C8102E] transition-all"
                  aria-label="Next photos"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div
            ref={galleryTrackRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {galleryImages.map((img, i) => (
              <div
                key={i}
                ref={(el) => (galleryItemRefs.current[i] = el)}
                onClick={() => {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }}
                className="group relative aspect-[4/3] w-[85%] sm:w-[45%] lg:w-[31%] flex-shrink-0 snap-start overflow-hidden rounded-xl cursor-pointer border border-[#DCA11D]/30 hover:border-[#DCA11D] transition-all duration-300"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="h-full w-full bg-white/5 object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95 group-hover:brightness-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#090D14]/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                  <span className="text-black font-sans font-black text-[9px] tracking-widest uppercase bg-[#DCA11D] px-4 py-2 rounded-full shadow-lg scale-95 group-hover:scale-100 transition-all duration-300">
                    Expand Photo
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && galleryImages.length > 0 && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#090D14]/95 backdrop-blur-md py-6 px-4 animate-in fade-in duration-300">
          <div className="w-full max-w-7xl flex items-center justify-between text-white font-sans">
            <span className="text-xs font-black tracking-widest uppercase text-[#DCA11D]">
              Image {lightboxIndex + 1} of {galleryImages.length}
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 text-white hover:text-[#C8102E] transition-colors focus:outline-none"
              aria-label="Close slideshow"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="relative flex-1 w-full flex items-center justify-center">
            <button
              onClick={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
              className="absolute left-2 sm:left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-[#C8102E] hover:border-[#C8102E] transition-all duration-200 focus:outline-none"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="max-h-[60vh] max-w-[85vw] md:max-h-[70vh] flex items-center justify-center bg-black/60 p-2 border border-[#DCA11D]/30 rounded-xl shadow-2xl overflow-hidden">
              <img
                src={galleryImages[lightboxIndex].src}
                alt={galleryImages[lightboxIndex].alt}
                className="max-h-[58vh] max-w-full md:max-h-[68vh] object-contain rounded-lg animate-in fade-in zoom-in-95 duration-300 select-none"
              />
            </div>

            <button
              onClick={() => setLightboxIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
              className="absolute right-2 sm:right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-[#C8102E] hover:border-[#C8102E] transition-all duration-200 focus:outline-none"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div className="w-full max-w-2xl flex flex-col items-center gap-4 text-center">
            {galleryImages[lightboxIndex].alt && (
              <p className="font-serif text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
                {galleryImages[lightboxIndex].alt}
              </p>
            )}

            <div className="flex gap-3 justify-center items-center overflow-x-auto py-2 px-4 max-w-full">
              {galleryImages.map((img, idx) => {
                const isActive = idx === lightboxIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className={`relative w-12 aspect-[4/3] rounded-md overflow-hidden flex-shrink-0 transition-all duration-300 outline-none ${
                      isActive 
                        ? 'ring-2 ring-[#DCA11D] scale-110 opacity-100 shadow-md' 
                        : 'opacity-40 hover:opacity-100 border border-white/10'
                    }`}
                  >
                    <img src={img.src} alt="" className="h-full w-full object-cover" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
