import React, { useEffect, useRef } from 'react';
import { Landmark, Vote, Globe2, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useGalleryImages, findBySlug } from '../lib/wpMedia.js';
import FlagStripe from '../lib/FlagStripe.jsx';

const parliamentRoles = [
  { title: 'Member of Parliament', detail: 'Whange Central Constituency — since 2018, re-elected 2023' },
  { title: 'Chairperson', detail: 'Portfolio Committee on Health and Child Care (2023–2024)' },
  { title: 'Former Chairperson', detail: 'Portfolio Committee on Higher & Tertiary Education, Innovation, Science and Technology Development (2018–2023)' },
  { title: 'Chairperson', detail: 'Parliamentary Caucus on Tuberculosis' },
  { title: 'Chairperson', detail: 'Parliamentary Caucus on Key Populations' },
  { title: 'Vice Chairperson', detail: 'Parliamentary Caucus on Safe Abortion' },
];

const partyRoles = [
  { title: 'Overall Chairperson', detail: 'CCC Whange Cluster' },
  { title: 'Former Deputy Treasurer General', detail: 'MDC Alliance (2020–2022)' },
  { title: 'Former National Spokesperson', detail: 'MDC Alliance (2019–2020)' },
];

const internationalRoles = [
  { title: 'International Executive Committee Member', detail: 'Parliamentarians for Global Action (PGA) — elected in Mexico City, term through Dec 2027' },
  { title: 'Global Board Member', detail: 'UNITE Parliamentary Network for Global Health — Southern & Eastern Africa focal point, 25+ countries' },
  { title: 'Co-Chairperson', detail: 'Pan African Parliamentary Taskforce for Domestic Resource Mobilisation for Health' },
  { title: 'Co-Chairperson', detail: 'Zimbabwe Chapter, Inter-Parliamentary Alliance on China (IPAC)' },
  { title: 'Southern Africa Focal Person', detail: 'Coalition of Parliamentarians Engaged to End Malaria (COPEMA)' },
];

const communityRoles = [
  { title: 'Founder & Chairperson', detail: 'Christian Legal Society of Zimbabwe' },
  { title: 'Founder & Chairperson', detail: 'Christian Leadership Forum' },
  { title: 'National Chairperson', detail: 'Arsenal FC Zimbabwe Supporters Association' },
  { title: 'Board Member', detail: 'Government Board for Mental Health Patients' },
  { title: 'Board Member', detail: 'Media Institute of Southern Africa (Zimbabwe Chapter)' },
];

function RoleCard({ title, detail }) {
  return (
    <div className="flex gap-3 rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 shadow-sm hover:shadow-md hover:border-[#DCA11D]/50 transition-all duration-300">
      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#044D29] dark:text-[#DCA11D]" />
      <div>
        <p className="font-sans font-black text-sm uppercase tracking-wide text-[#090D14] dark:text-white">{title}</p>
        <p className="mt-1 font-serif text-sm text-slate-600 dark:text-white/60 leading-relaxed">{detail}</p>
      </div>
    </div>
  );
}

function Category({ id, icon: Icon, label, description, roles, imageSlug, imageAlt, reverse }) {
  const revealRef = useRef(null);
  const { images } = useGalleryImages('leadership');

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
    if (revealRef.current) observer.observe(revealRef.current);
    return () => observer.disconnect();
  }, []);

  const img = imageSlug ? findBySlug(images, imageSlug) : null;
  const fallbackMap = {
    'gemini_generated_image_n8e86yn8e86yn8e8-1': '/wp-content/uploads/2026/08/Gemini_Generated_Image_n8e86yn8e86yn8e8-1-scaled.webp',
    'whatsapp-image-2026-08-12-at-07-05-35-1': '/wp-content/uploads/2026/08/WhatsApp-Image-2026-08-12-at-07.05.35-1.jpeg',
    'daniel_profile_public_28': '/wp-content/uploads/2026/08/daniel_profile_public_28.webp',
  };
  const imgSrc = img?.url || (imageSlug ? fallbackMap[imageSlug] : null);

  return (
    <section id={id} ref={revealRef} className="molokele-card-reveal py-16 sm:py-20 border-b border-slate-200 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          <div className={`lg:col-span-4 ${reverse ? 'lg:order-2' : ''}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#044D29]/10 text-[#044D29] dark:bg-white/5 dark:text-[#DCA11D]">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="font-sans font-black text-xl uppercase tracking-wide text-[#090D14] dark:text-white">{label}</h2>
            </div>
            <p className="font-serif text-sm text-slate-600 dark:text-white/60 leading-relaxed">{description}</p>
            
            {imgSrc && (
              <div className="mt-6 overflow-hidden rounded-sm border border-brand-sand dark:border-white/10 shadow-md">
                <img
                  src={imgSrc}
                  alt={imageAlt}
                  className="w-full aspect-[16/10] sm:aspect-[4/3] object-cover object-top bg-brand-sand dark:bg-white/5"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          <div className={`lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 ${reverse ? 'lg:order-1' : ''}`}>
            {roles.map((role, i) => (
              <RoleCard key={i} {...role} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Leadership() {
  const { images } = useGalleryImages('leadership');
  const heroImg = findBySlug(images, 'daniel_profile_public_13');

  return (
    <div className="w-full bg-slate-50 dark:bg-[#090D14] font-sans">

      {/* Hero */}
      <section className="relative w-full bg-[#090D14] py-12 sm:py-16 md:py-20 overflow-hidden border-b border-[#DCA11D]/30">
        <FlagStripe className="absolute top-0 left-0 w-full h-1 z-10" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <p className="font-sans font-black text-xs tracking-[0.3em] uppercase text-[#DCA11D]">
                Parliament of Zimbabwe • Leadership Portfolio
              </p>
              <h1 className="font-sans font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-[1.05]">
                From Whange<br />to the World Stage
              </h1>
              <p className="font-serif italic text-base sm:text-lg text-white/80 max-w-xl leading-relaxed">
                Parliament, party, and a dozen tables in between — where he holds the pen, and why
                it matters for Whange Central.
              </p>
            </div>
            {heroImg && (
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="overflow-hidden rounded-sm border border-white/15 shadow-xl max-w-xs sm:max-w-[320px] w-full bg-white/5">
                  <img
                    src={heroImg.url}
                    alt="Hon. Molokele, official portrait, Parliament of Zimbabwe"
                    className="w-full aspect-[4/3] object-cover object-top max-h-[280px]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick jump nav */}
      <div className="sticky top-24 z-20 hidden md:block border-b border-brand-sand dark:border-white/10 bg-white/95 dark:bg-brand-blue/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-8">
          {[
            { id: 'parliament', label: 'Parliament' },
            { id: 'party', label: 'Party' },
            { id: 'international', label: 'International' },
            { id: 'community', label: 'Community' },
          ].map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="font-sans font-black text-xs tracking-widest uppercase text-slate-500 dark:text-white/70 hover:text-brand-pink transition-colors"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <Category
        id="parliament"
        icon={Landmark}
        label="In Parliament"
        description="Six years in the National Assembly, spent chairing the committees that decide how health and education actually get funded."
        roles={parliamentRoles}
        imageSlug="gemini_generated_image_n8e86yn8e86yn8e8-1"
        imageAlt="Hon. Daniel Molokele active in parliamentary debates and committee leadership"
      />

      <Category
        id="party"
        icon={Vote}
        label="In the Party"
        description="From national spokesperson to party treasurer — a decade of movement politics, carried through two parties and one constituency."
        roles={partyRoles}
        reverse
      />

      <Category
        id="international"
        icon={Globe2}
        label="On the World Stage"
        description="Zimbabwe's coal towns rarely get a seat at global health and governance tables. Hon. Molokele has built five."
        roles={internationalRoles}
        imageSlug="daniel_profile_public_28"
        imageAlt="Hon. Molokele with an international delegation"
      />

      <Category
        id="community"
        icon={Users}
        label="In the Community"
        description="Faith, football, and the free press — the institutions built and chaired outside of government, because leadership doesn't stop at the chamber door."
        roles={communityRoles}
        imageSlug="whatsapp-image-2026-08-12-at-07-05-35-1"
        imageAlt="Hon. Daniel Molokele participating in community leadership and civic engagements"
        reverse
      />

      {/* Closing CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-4xl bg-white dark:bg-brand-blue/30 border border-slate-200/80 dark:border-white/10 rounded-2xl p-8 sm:p-16 shadow-xl relative overflow-hidden">
          {/* Subtle light/color glow behind card */}
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-gradient-to-tr from-brand-pink/10 to-brand-orange/5 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-brand-plum-light/5 to-transparent blur-3xl" />
          
          {/* Top subtle flag colors border */}
          <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-brand-plum-light via-brand-orange to-brand-pink" />
          
          <div className="relative z-10">
            <p className="font-signature italic font-bold text-5xl sm:text-6xl text-brand-pink select-none leading-none mb-2">
              Molokele
            </p>
            
            <p className="mt-4 font-serif text-lg sm:text-xl text-slate-700 dark:text-slate-200 max-w-xl mx-auto leading-relaxed">
              Every role traces back to the same seat: Whange Central.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/biography/"
                className="group btn-primary"
              >
                Read the Biography
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="/in-parliament/"
                className="group btn-secondary"
              >
                In Parliament
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
