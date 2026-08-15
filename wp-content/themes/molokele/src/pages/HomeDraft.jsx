import React, { useEffect, useRef, useState } from 'react';
import { User, Mail, Landmark, FileText, MessageSquare, Newspaper, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGalleryImages, findBySlug } from '../lib/wpMedia.js';

// Zimbabwe flag palette accent cycle — green, gold, red — used as the top
// border on card grids so the flag's colours read as a deliberate rhythm
// rather than a one-off flourish. Shared so the sequence never drifts
// between sections.
const ACCENT_BORDERS = ['border-t-brand-plum', 'border-t-brand-orange', 'border-t-brand-pink'];

export default function Home() {
  const heroSectionRef = useRef(null);
  const heroNameRef = useRef(null);
  const subtitleRef = useRef(null);
  const subtitleDeltaRef = useRef(null);
  const cardRefs = useRef([]);
  const galleryTrackRef = useRef(null);
  const galleryItemRefs = useRef([]);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const { images: wpGalleryImages } = useGalleryImages('photo-gallery');
  const galleryImages = wpGalleryImages.map((img) => ({
    src: img.url || '',
    alt: img.alt || img.title || 'Gallery Image',
  }));

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [gallerySettings, setGallerySettings] = useState({
    columns: '3',
    shadow: 'shadow-md',
    border_radius: 'rounded-sm',
    autoplay: false,
    autoplay_speed: '3000',
    backdrop_blur: 'backdrop-blur-md',
  });

  useEffect(() => {
    fetch('/wp-json/molokele/v1/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.code) {
          setGallerySettings(data);
        }
      })
      .catch(() => {});
  }, []);

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

  // Track which gallery image is most centered in view, to highlight the right dot.
  useEffect(() => {
    const track = galleryTrackRef.current;
    if (!track) return;

    let ticking = false;
    const handleTrackScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const trackRect = track.getBoundingClientRect();
        const trackCenter = trackRect.left + trackRect.width / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;
        galleryItemRefs.current.forEach((el, i) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const itemCenter = rect.left + rect.width / 2;
          const distance = Math.abs(itemCenter - trackCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
          }
        });
        setActiveGalleryIndex(closestIndex);
        ticking = false;
      });
    };

    track.addEventListener('scroll', handleTrackScroll, { passive: true });
    return () => track.removeEventListener('scroll', handleTrackScroll);
  }, []);

  const scrollToGalleryImage = (index) => {
    const track = galleryTrackRef.current;
    const el = galleryItemRefs.current[index];
    if (track && el) {
      const trackWidth = track.clientWidth;
      const elOffset = el.offsetLeft;
      const elWidth = el.clientWidth;
      const targetScroll = elOffset - (trackWidth / 2) + (elWidth / 2);
      track.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  // Reveal the quick-links cards with a staggered fade-up as each scrolls into view.
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

  // On scroll: the hero name lockup flies off to the right and fades out, while
  // the subtitle instead migrates to the bottom-right corner of the hero image
  // and shrinks into a compact caption. The subtitle and the hero section are
  // normal in-flow siblings, so their relative offset never changes as the page
  // scrolls — only their shared viewport position does. That means the delta
  // between the subtitle's rest spot and its target corner only needs to be
  // measured once (on mount/resize); once captionProgress hits 1 the transform
  // stops changing and the caption then scrolls naturally with the image,
  // staying locked in place instead of drifting.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const threshold = 260;
    const captionThreshold = 120;
    const nameDistance = 180;
    const captionInset = 32;
    const captionFinalScale = 0.7;

    const measureCaptionDelta = () => {
      const subEl = subtitleRef.current;
      const sectionEl = heroSectionRef.current;
      if (!subEl || !sectionEl) return;

      const prevTransform = subEl.style.transform;
      subEl.style.transform = 'none';
      const restRect = subEl.getBoundingClientRect();
      const sectionRect = sectionEl.getBoundingClientRect();
      subEl.style.transform = prevTransform;

      const targetLeft = sectionRect.right - captionInset - restRect.width;
      const targetTop = sectionRect.bottom - captionInset - restRect.height;

      subtitleDeltaRef.current = {
        x: targetLeft - restRect.left,
        y: targetTop - restRect.top,
      };
    };

    measureCaptionDelta();
    window.addEventListener('resize', measureCaptionDelta);

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const progress = Math.min(Math.max(window.scrollY / threshold, 0), 1);
        const captionProgress = Math.min(Math.max(window.scrollY / captionThreshold, 0), 1);

        const nameEl = heroNameRef.current;
        if (nameEl) {
          nameEl.style.transform = `translateX(${progress * nameDistance}px)`;
          nameEl.style.opacity = String(1 - progress);
        }

        const subEl = subtitleRef.current;
        const delta = subtitleDeltaRef.current;
        if (subEl && delta) {
          const scale = 1 - captionProgress * (1 - captionFinalScale);
          subEl.style.transform =
            `translate(${delta.x * captionProgress}px, ${delta.y * captionProgress}px) scale(${scale})`;
        }

        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', measureCaptionDelta);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const quickLinks = [
    {
      title: "Meet Hon. Molokele",
      description: "Learn about Hon. Molokele's biography, union legacy, and name reclamation journey.",
      url: "/biography/",
      icon: User,
    },
    {
      title: "CDF Tracker",
      description: "Live status updates and audits of Constituency Development Fund projects.",
      url: "/cdf-tracker/",
      icon: Landmark,
    },
    {
      title: "In Parliament",
      description: "Read about legislative policies, gender equality, health, and labor conventions.",
      url: "/in-parliament/",
      icon: FileText,
    },
    {
      title: "Speeches",
      description: "Access Hansard excerpts, debates, and public transcripts from parliament.",
      url: "/category/speeches/",
      icon: MessageSquare,
    },
    {
      title: "Press Coverage",
      description: "Read local and national press articles regarding Whange Central.",
      url: "/category/press-coverage/",
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
    <div className="w-full bg-brand-sand font-sans relative">
      {/* Editorial Grid Gridline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-[linear-gradient(to_right,var(--color-brand-plum)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-brand-plum)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] z-0" />
      
      {/* Hero Section */}
      <section
        ref={heroSectionRef}
        className="relative w-full h-[500px] md:h-auto md:aspect-[1408/875] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: "url('/wp-content/uploads/2026/08/home_cropped_top_extended.webp')"
        }}
      >
        {/* Gradient fade mask: dark on left for text contrast, transparent on right for portrait clarity */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/90 via-brand-blue/50 to-transparent z-0" />

        {/* Hero Content Wrapper */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-10 text-white">
          <div className="max-w-2xl md:ml-8">

            {/* Name Branding — flies toward the header logo on scroll (see useEffect above) */}
            <div
              ref={heroNameRef}
              className="relative mb-2"
              style={{
                willChange: 'transform, opacity',
                transition: 'transform 150ms ease-out, opacity 150ms ease-out',
              }}
            >
              {/* Top Tagline — floated right, aligned with the top of the "M" */}
              <div className="molokele-anim-tagline absolute right-0 -top-4 sm:-top-8 md:-top-12 flex items-center gap-2 z-10">
                <span className="font-sans font-black text-xs sm:text-sm tracking-[0.25em] uppercase text-brand-orange">
                  Member of Parliament
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-brand-pink animate-pulse" />
              </div>

              {/* Cursive Signature — types in as a pink outline, then inks solid */}
              <span className="molokele-anim-type molokele-anim-type-signature block font-signature italic font-bold text-[7rem] sm:text-[10rem] md:text-[13rem] leading-[0.75] -mb-3 sm:-mb-5 md:-mb-7 pl-1 select-none drop-shadow-md">
                Molokele
              </span>
              {/* Bold Sans Surname — types in as a white outline, then inks solid + bold */}
              <h1 className="molokele-anim-type molokele-anim-type-daniel font-sans font-black text-6xl sm:text-8xl md:text-9xl tracking-tighter uppercase leading-none select-none">
                Hon. Molokele
              </h1>
            </div>

            {/* Representation Subtitle */}
            <p
              ref={subtitleRef}
              className="molokele-anim-subtitle mt-4 font-serif font-bold text-base sm:text-lg md:text-xl tracking-[0.15em] uppercase text-white drop-shadow-md"
              style={{
                transformOrigin: 'top left',
                willChange: 'transform',
                transition: 'transform 150ms ease-out',
              }}
            >
              Representing Whange Central Constituency
              <span className="block mt-3 h-1 w-16 rounded-full bg-brand-plum-light" />
            </p>

          </div>
        </div>
      </section>

      {/* Feature Quick Links Grid */}
      <section className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16 pb-24">
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
                className={`molokele-card-reveal group relative flex flex-col justify-between overflow-hidden bg-white border border-brand-sand/80 border-t-4 ${activeBorder} p-8 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 z-10`}
                style={{ transitionDelay: `${idx * 70}ms` }}
              >
                {/* Large faint background number */}
                <span className="absolute bottom-4 right-6 font-serif font-black text-7xl select-none pointer-events-none text-slate-100/70 group-hover:text-brand-orange/15 transition-colors duration-300">
                  {padIndex}
                </span>

                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-plum/5 text-brand-plum border border-brand-plum/10 transition-all duration-300 ease-out group-hover:scale-105 group-hover:bg-brand-plum group-hover:text-white group-hover:shadow-md">
                    <Icon className="h-6 w-6 stroke-[2]" />
                  </div>
                  <h3 className="mt-6 font-sans font-black text-lg tracking-wider text-brand-blue uppercase group-hover:text-brand-plum transition-colors duration-300">
                    {link.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-[90%]">
                    {link.description}
                  </p>
                </div>

                <div className="relative mt-8 flex items-center gap-2 text-xs font-black tracking-widest text-brand-blue group-hover:text-brand-plum uppercase transition-colors duration-300">
                  <span>Explore</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Latest from the Office */}
      {latestPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-plum text-white shadow-sm">
                <Newspaper className="h-5 w-5" />
              </div>
              <h2 className="font-sans font-black text-xl sm:text-2xl uppercase tracking-wide text-brand-blue">
                Latest From the Office
              </h2>
            </div>
            <a
              href="/news-media/"
              className="hidden sm:inline-flex items-center gap-1.5 font-sans font-black text-xs tracking-widest uppercase text-brand-pink hover:text-brand-orange transition-colors"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {latestPosts.map((post, index) => {
              const image = post._embedded?.['wp:featuredmedia']?.[0];
              const activeBorder = ACCENT_BORDERS[index % ACCENT_BORDERS.length];
              const postNum = String(index + 1).padStart(2, '0');

              return (
                <a
                  key={post.id}
                  href={post.link}
                  className={`group block overflow-hidden rounded-xl border border-brand-sand/80 border-t-4 ${activeBorder} bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative`}
                >
                  {image && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={image.source_url}
                        alt={image.alt_text || ''}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5 relative">
                    <span className="absolute bottom-2 right-4 font-serif font-black text-6xl select-none pointer-events-none text-slate-100/50 group-hover:text-brand-orange/10 transition-colors duration-300">
                      {postNum}
                    </span>
                    <h3
                      className="font-sans font-black text-sm uppercase tracking-wide text-brand-blue group-hover:text-brand-plum transition-colors leading-snug relative z-10 pr-8"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Gallery Section — black editorial block, matching the dark-hero
          treatment used on every other page; flag colours appear as
          deliberate accents (stripe, heading, hover) rather than a full wash */}
      <section className="bg-brand-blue py-20 sm:py-24 relative overflow-hidden">
        {/* Flag stripe */}
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-brand-plum-light via-brand-orange to-brand-pink" />
        {/* Subtle geometric lines for gallery texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:3rem_3rem] z-0" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-10 flex justify-between items-end border-b border-white/10 pb-4">
            <div>
              <h2 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-wide text-white">
                Gallery
              </h2>
              <div className="mt-2 h-1 w-14 rounded-full bg-brand-orange" />
            </div>
          </div>

          <div
            ref={galleryTrackRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {galleryImages.map((img, i) => {
              const colWidthClass = 
                gallerySettings.columns === '2' ? 'lg:w-[48%]' :
                gallerySettings.columns === '4' ? 'lg:w-[23%]' : 'lg:w-[31%]';
              return (
                <div
                  key={i}
                  ref={(el) => (galleryItemRefs.current[i] = el)}
                  onClick={() => {
                    setLightboxIndex(i);
                    setLightboxOpen(true);
                  }}
                  className={`group relative aspect-[4/3] w-[85%] sm:w-[45%] ${colWidthClass} flex-shrink-0 snap-start overflow-hidden ${gallerySettings.shadow} ${gallerySettings.border_radius} cursor-pointer border border-white/10 hover:border-brand-orange transition-all duration-300`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full bg-white/5 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                    <span className="text-white font-sans font-black text-[10px] tracking-widest uppercase bg-brand-orange px-4 py-2 rounded-full shadow-md scale-90 group-hover:scale-100 transition-all duration-300">
                      Zoom Image
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scroll dots */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {galleryImages.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToGalleryImage(i)}
                aria-label={`Scroll to gallery image ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeGalleryIndex === i
                    ? 'w-8 bg-brand-orange'
                    : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox / Slideshow Modal */}
      {lightboxOpen && galleryImages.length > 0 && (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-between bg-brand-blue/95 ${gallerySettings.backdrop_blur} py-6 px-4 animate-in fade-in duration-300`}>
          
          {/* Header Bar */}
          <div className="w-full max-w-7xl flex items-center justify-between text-white font-sans">
            <span className="text-xs font-black tracking-widest uppercase opacity-60">
              Image {lightboxIndex + 1} of {galleryImages.length}
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 text-white hover:text-brand-pink transition-colors focus:outline-none"
              aria-label="Close slideshow"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Main Visual Frame */}
          <div className="relative flex-1 w-full flex items-center justify-center">
            {/* Left Navigation Arrow */}
            <button
              onClick={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
              className="absolute left-2 sm:left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-brand-pink hover:border-brand-pink transition-all duration-200 focus:outline-none"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Current Active Slide Image */}
            <div className="max-h-[60vh] max-w-[85vw] md:max-h-[70vh] flex items-center justify-center bg-brand-blue/50 p-2 border border-white/5 rounded-sm shadow-2xl overflow-hidden">
              <img
                src={galleryImages[lightboxIndex].src}
                alt={galleryImages[lightboxIndex].alt}
                className="max-h-[58vh] max-w-full md:max-h-[68vh] object-contain rounded-sm animate-in fade-in zoom-in-95 duration-300 select-none"
              />
            </div>

            {/* Right Navigation Arrow */}
            <button
              onClick={() => setLightboxIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
              className="absolute right-2 sm:right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-brand-pink hover:border-brand-pink transition-all duration-200 focus:outline-none"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Footer Caption & Thumbnails Strip */}
          <div className="w-full max-w-2xl flex flex-col items-center gap-4 text-center">
            {/* Image Description Caption */}
            {galleryImages[lightboxIndex].alt && (
              <p className="font-serif text-sm sm:text-base text-brand-sand leading-relaxed max-w-xl">
                {galleryImages[lightboxIndex].alt}
              </p>
            )}

            {/* Thumbnails Row */}
            <div className="flex gap-3 justify-center items-center overflow-x-auto py-2 px-4 max-w-full">
              {galleryImages.map((img, idx) => {
                const isActive = idx === lightboxIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className={`relative w-12 aspect-[4/3] rounded-sm overflow-hidden flex-shrink-0 transition-all duration-300 outline-none ${
                      isActive 
                        ? 'ring-2 ring-brand-pink scale-110 opacity-100 shadow-md' 
                        : 'opacity-40 hover:opacity-100 border border-white/10'
                    }`}
                  >
                    <img
                      src={img.src}
                      alt=""
                      className="h-full w-full object-cover"
                    />
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
