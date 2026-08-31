import React, { useEffect, useRef } from 'react';
import { Users, Goal, Home as HomeIcon, Award, BookOpen, GraduationCap, Landmark } from 'lucide-react';
import { useGalleryImages, findBySlug } from '../lib/wpMedia.js';
import ZimbabweMap from '../lib/ZimbabweMap.jsx';
import FlagStripe from '../lib/FlagStripe.jsx';
import AnimatedNumber from '../lib/AnimatedNumber.jsx';

const family = [
  { 
    name: 'Godfrey Majahana Mguni', 
    relation: 'Father (late)', 
    note: 'Whange mine Workers Committee Chairperson (1979–1994), veteran mineworkers leader & ZCTU trade unionist.', 
    icon: Users, 
    photoSlug: 'daniel_profile_public_30',
    directImage: null
  },
  { 
    name: 'Jane Mpofu', 
    relation: 'Mother', 
    note: 'Retired pre-school educator in Bulawayo, community leader, and International Leadership University (ILU) alumna.', 
    icon: GraduationCap, 
    photoSlug: null,
    directImage: '/wp-content/uploads/2026/08/mother_jane_mpofu_ilu_06.webp'
  },
  { 
    name: 'The Batsieng Heritage', 
    relation: 'Ancestral Lineage', 
    note: 'Connected to the Batsieng clan in Mahikeng — reclaiming his ancestral name Fortune Daniel Molokela-Tsiye in honour of family history.', 
    icon: Landmark, 
    photoSlug: null,
    directImage: null
  },
];

const motherPhotos = [
  {
    src: '/wp-content/uploads/2026/08/mother_jane_mpofu_ilu_01.webp',
    title: 'International Leadership University',
    subtitle: 'Celebrating educational excellence and leadership'
  },
  {
    src: '/wp-content/uploads/2026/08/mother_jane_mpofu_ilu_03.webp',
    title: 'ILU Leadership Convocation',
    subtitle: 'Faith-based leadership & education'
  },
  {
    src: '/wp-content/uploads/2026/08/mother_jane_mpofu_ilu_04.webp',
    title: 'Leadership Recognition',
    subtitle: 'Honouring a lifetime of dedicated teaching'
  },
  {
    src: '/wp-content/uploads/2026/08/1a4a6701-3f37-4f1b-a128-593fd0d297da.jpeg',
    title: 'ILU Academic Celebration',
    subtitle: 'Commitment to lifelong learning'
  }
];

export default function Family() {
  const revealRefs = useRef([]);
  const { images } = useGalleryImages('family');
  const img = (slug, fallbackAlt) => {
    const found = findBySlug(images, slug);
    return { src: found?.url || '', alt: found?.alt || fallbackAlt };
  };

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
      { threshold: 0.12 }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  let revealCount = 0;
  const registerReveal = (el) => {
    revealRefs.current[revealCount] = el;
    revealCount += 1;
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#090D14] font-sans">

      {/* Hero */}
      <section className="relative w-full bg-[#090D14] py-20 sm:py-28 overflow-hidden border-b border-[#DCA11D]/30">
        {/* Flag stripe */}
        <FlagStripe className="absolute top-0 left-0 w-full h-1" />

        {/* Faint editorial gridline texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Oversized watermark map */}
        <ZimbabweMap
          className="pointer-events-none absolute -left-24 -bottom-24 h-[28rem] w-auto text-white/[0.04] hidden lg:block"
          highlightClassName="fill-[#DCA11D]/[0.06]"
        />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans font-black text-xs sm:text-sm tracking-[0.3em] uppercase text-[#DCA11D]">
            Parents &amp; Family Heritage
          </p>
          <h1 className="mt-4 font-sans font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-[1.05]">
            The People Who<br className="hidden sm:block" /> Made Him
          </h1>
          <p className="mt-6 font-serif italic text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
            Hon. Molokele’s values were forged in the trade union halls of Whange and the early childhood classrooms of Bulawayo — grounded by his parents, Godfrey Majahana Mguni and Jane Mpofu.
          </p>

          {/* Tabular stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 sm:gap-8 border-t border-white/10 pt-8 max-w-xl mx-auto">
            <div className="flex flex-col items-center">
              <span className="font-serif text-4xl sm:text-5xl font-extralight text-[#DCA11D] leading-none">
                <AnimatedNumber value={3} />
              </span>
              <span className="text-[9px] sm:text-[10px] font-sans font-black tracking-wider uppercase text-white/50 mt-3 text-center">
                Generations in Whange
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-4xl sm:text-5xl font-extralight text-brand-orange leading-none">
                <AnimatedNumber value={15} />
              </span>
              <span className="text-[9px] sm:text-[10px] font-sans font-black tracking-wider uppercase text-white/50 mt-3 text-center">
                Years Mine Union Chairmanship
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-serif text-4xl sm:text-5xl font-extralight text-brand-orange leading-none">
                <AnimatedNumber value={30} />
              </span>
              <span className="text-[9px] sm:text-[10px] font-sans font-black tracking-wider uppercase text-white/50 mt-3 text-center">
                Years Early Childhood Service
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Parents & Family Heritage */}
      <section ref={registerReveal} className="molokele-card-reveal mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm text-brand-pink">
            <Users className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="font-sans font-black text-xl sm:text-2xl uppercase tracking-wide text-brand-blue dark:text-white">
              Parents &amp; Family Legacy
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-white/60 font-serif italic mt-0.5">
              Rooted in trade union advocacy, early childhood education, and community service
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {family.map((member, i) => {
            const Icon = member.icon;
            const photo = member.directImage 
              ? { src: member.directImage, alt: member.name }
              : member.photoSlug ? img(member.photoSlug, member.name) : null;
            return (
              <div
                key={member.name}
                ref={registerReveal}
                style={{ transitionDelay: `${i * 80}ms` }}
                className="molokele-card-reveal group flex flex-col overflow-hidden rounded-xl border border-brand-sand/80 dark:border-white/10 border-t-4 border-t-brand-pink bg-white dark:bg-white/[0.03] shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300"
              >
                {photo?.src ? (
                  <div className="aspect-[4/3] overflow-hidden bg-brand-sand">
                    <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-brand-blue to-brand-blue/80">
                    <Icon className="h-12 w-12 text-brand-orange" strokeWidth={1.25} />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <span className="font-sans text-[10px] font-black uppercase tracking-widest text-brand-pink">
                    {member.relation}
                  </span>
                  <h3 className="mt-1 font-sans font-black text-lg uppercase tracking-wide text-brand-blue dark:text-white leading-snug">
                    {member.name}
                  </h3>
                  <p className="mt-3 font-serif text-sm text-slate-600 dark:text-white/70 leading-relaxed flex-1">
                    {member.note}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* The House That Raised Him */}
      <section
        ref={registerReveal}
        className="molokele-card-reveal bg-[#090D14] text-white py-20 sm:py-28 border-y border-[#DCA11D]/30 relative overflow-hidden"
      >
        {/* Faint editorial gridline texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6 mb-12">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-pink to-brand-orange text-white shadow-md shadow-brand-pink/20">
                <BookOpen className="h-5 w-5" />
              </div>
              <h2 className="font-sans font-black text-xl sm:text-2xl uppercase tracking-wide text-white">
                The House That Raised Him
              </h2>
            </div>
            <div className="font-serif text-base sm:text-lg text-white/80 leading-relaxed space-y-4">
              <p>
                His father, the late <strong>Godfrey Majahana Mguni</strong>, was a career trade unionist — Workers
                Committee Chairperson at the Whange mine from 1979 to 1994, and a leading figure in
                both the Associated Mineworkers Union of Zimbabwe and the ZCTU. It was a household
                where organising wasn't abstract; it was the family business.
              </p>
              <p>
                His mother, <strong>Jane Mpofu</strong>, spent over three decades teaching pre-school in Bulawayo, where she
                is now retired. A passionate advocate for early childhood development and community leadership, she went on to complete leadership training with the International Leadership University (ILU). If his father taught him how to organise workers, his mother taught
                him how to nurture communities — lessons that continue to guide Hon. Molokele in Parliament.
              </p>
            </div>
          </div>

          {/* Side-by-side portraits in a balanced horizontal row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl">
            <div className="overflow-hidden rounded-xl border border-white/15 bg-white/5 backdrop-blur-md shadow-xl group hover:border-[#DCA11D]/40 transition-all duration-300">
              <div className="aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-white/5">
                <img
                  {...img('daniel_profile_public_30', "Portrait of Godfrey Majahana Mguni, Hon. Molokele's father")}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="px-5 py-4 bg-[#0c121e] border-t border-white/10">
                <p className="font-sans text-xs font-black uppercase tracking-widest text-[#DCA11D]">
                  Godfrey Majahana Mguni
                </p>
                <p className="font-serif text-xs text-white/60 mt-1">
                  Workers Committee Chair, Whange Mine (1979–1994)
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/15 bg-white/5 backdrop-blur-md shadow-xl group hover:border-[#DCA11D]/40 transition-all duration-300">
              <div className="aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-white/5">
                <img
                  src="/wp-content/uploads/2026/08/mother_jane_mpofu_ilu_06.webp"
                  alt="Mrs Jane Mpofu"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="px-5 py-4 bg-[#0c121e] border-t border-white/10">
                <p className="font-sans text-xs font-black uppercase tracking-widest text-[#DCA11D]">
                  Mrs Jane Mpofu
                </p>
                <p className="font-serif text-xs text-white/60 mt-1">
                  Retired Educator &amp; Community Leader
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mother & Parents Showcase Gallery */}
      <section
        ref={registerReveal}
        className="molokele-card-reveal bg-brand-sand/60 dark:bg-white/[0.03] py-16 sm:py-20 border-y border-slate-200/60 dark:border-white/10"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-pink to-brand-orange text-white shadow-md shadow-brand-pink/20">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-sans font-black text-xl sm:text-2xl uppercase tracking-wide text-brand-blue dark:text-white">
                  Mother &amp; Educational Heritage
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-white/60 font-serif italic">
                  Celebrating Mrs Jane Mpofu and International Leadership University (ILU)
                </p>
              </div>
            </div>
            <span className="font-sans text-[10px] font-black tracking-widest uppercase text-brand-pink bg-brand-pink/10 px-3 py-1.5 rounded-full self-start md:self-auto">
              Mother's Leadership Legacy
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {motherPhotos.map((photo, index) => (
              <div
                key={index}
                className="group overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-brand-blue/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden bg-brand-sand/50 relative">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-sans font-black text-sm uppercase tracking-wide text-brand-blue dark:text-white leading-snug">
                    {photo.title}
                  </h3>
                  <p className="mt-1 font-serif text-xs text-slate-600 dark:text-white/70">
                    {photo.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports, Community, and Civic Life */}
      <section
        ref={registerReveal}
        className="molokele-card-reveal bg-brand-blue text-white py-16 sm:py-20"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-pink to-brand-orange text-white shadow-md shadow-brand-pink/20">
              <Goal className="h-5 w-5" />
            </div>
            <h2 className="font-sans font-black text-xl sm:text-2xl uppercase tracking-wide text-white">
              Sports, Community, and the Beautiful Game
            </h2>
          </div>
          <p className="mt-6 font-serif text-base sm:text-lg text-white/70 leading-relaxed max-w-3xl">
            Soccer and civic organising have always been central to Hon. Molokele’s community ethos. Growing up in a coal-mining town where his father played in and chaired the Zulu Royals Football Club under the Wankie Football Association, he learned early that sports bridge social divides and unify communities. Today, as Chairperson of the Arsenal FC Zimbabwe Supporters Association and an active champion of grassroots athletics in Whange Central, he continues to advocate for youth recreation, sports development, and community empowerment.
          </p>
        </div>
      </section>

      {/* Home, Still */}
      <section
        ref={registerReveal}
        className="molokele-card-reveal py-16 sm:py-20"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-center">
            <div className="md:col-span-2 order-2 md:order-1">
              <div className="overflow-hidden rounded-xl border border-brand-sand dark:border-white/10 shadow-md group">
                <img {...img('daniel_profile_public_22', 'Hon. Daniel Molokele with community members during a local rice donation drive in Whange')} className="w-full aspect-[4/3] object-cover bg-brand-sand dark:bg-white/5 group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <p className="px-3 py-2 font-sans text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 dark:bg-brand-blue">
                  Community outreach &amp; food security drive in Whange
                </p>
              </div>
            </div>
            <div className="md:col-span-3 order-1 md:order-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-pink to-brand-orange text-white shadow-md shadow-brand-pink/20">
                  <HomeIcon className="h-5 w-5" />
                </div>
                <h2 className="font-sans font-black text-xl sm:text-2xl uppercase tracking-wide text-brand-blue dark:text-white">
                  Home, Still
                </h2>
              </div>
              <p className="font-serif text-base sm:text-lg text-slate-600 dark:text-white/70 leading-relaxed">
                For all the international boards and parliamentary duties, the constant has stayed the
                same: Whange. It's where the family name was earned, where his parents taught him the power of community,
                and where — every time he's home — he's still just Godfrey and Jane's son before
                he's anyone's MP.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-4xl bg-white dark:bg-brand-blue/30 border border-slate-200/80 dark:border-white/10 rounded-2xl p-8 sm:p-16 shadow-xl relative overflow-hidden">
          {/* Subtle light/color glow behind card */}
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-gradient-to-tr from-brand-pink/10 to-brand-orange/5 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-brand-plum-light/5 to-transparent blur-3xl" />
          
          {/* Top subtle flag colors border */}
          <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-brand-plum-light via-brand-orange to-brand-pink" />
          
          <div className="relative z-10">
            <p className="font-signature italic font-bold text-5xl sm:text-6xl text-brand-pink select-none leading-none mb-2">
              Faith. Family. Service.
            </p>
            
            <p className="mt-4 font-serif text-lg sm:text-xl text-slate-700 dark:text-slate-200 max-w-xl mx-auto leading-relaxed">
              Faith, parents, and community — everything else follows from there.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
