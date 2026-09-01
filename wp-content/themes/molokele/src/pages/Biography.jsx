import React, { useEffect, useRef } from 'react';
import { Baby, School, Scale, Users, Heart, Landmark, Vote, Globe2, Compass, ArrowRight } from 'lucide-react';
import { useGalleryImages, findBySlug } from '../lib/wpMedia.js';
import FlagStripe from '../lib/FlagStripe.jsx';

const timeline = [
  {
    year: '1975',
    icon: Baby,
    title: 'Born of the Coal',
    body: 'Fortune Daniel Molokela-Tsiye is born on Friday, 31 January, at the No. 1 Colliery clinic in Whange — a coal-mining town that will shape everything about how he sees the world.',
  },
  {
    year: '1982–1994',
    icon: School,
    title: 'A Coal-Town Education',
    body: 'St Ignatius Primary School, then John Tallach Secondary at Ingwenya Mission, then A-Levels at Fletcher High in Gweru — a childhood spent moving toward the next chance.',
  },
  {
    year: '1995–1999',
    icon: Scale,
    title: 'University of Zimbabwe: Law and Leadership',
    imageSlug: 'daniel_profile_public_07',
    imageAlt: 'A young Hon. Molokele on the University of Zimbabwe campus',
    body: "Reading for a Bachelor of Laws (Honours), he simultaneously rises through the Students' Representative Council — Secretary General, then Vice President, then President — the first proof that organising and advocacy were always going to be the same instinct.",
  },
  {
    year: '1999',
    icon: Scale,
    title: 'Called to the Bar',
    imageSlug: 'daniel_profile_public_04',
    imageAlt: 'Hon. Molokele in legal robes with his parents',
    body: 'He joins Ben Baron & Partners in Bulawayo as a practising attorney — flanked, at his admission, by the two people who made it possible: his mother, Jane, and his father, Godfrey.',
  },
  {
    year: '2000',
    icon: Users,
    title: 'Reclaiming the Name',
    imageSlug: 'daniel_profile_public_30',
    imageAlt: 'Portrait of Godfrey Majahana Mguni, Hon. Molokele\'s father',
    aspectRatio: 'aspect-[3/4] sm:aspect-[4/5]',
    objectPosition: 'object-cover object-center',
    body: 'He legally changes his name from Fortune Mguni to Fortune Daniel Molokela-Tsiye, reuniting with the Batsieng clan in Mahikeng, South Africa — restoring a family identity that history had worn away. In honour of his father, Godfrey Majahana Mguni, a career trade unionist and Workers Committee Chairperson at the Whange mine from 1979 to 1994.',
  },
  {
    year: '2001–2010',
    icon: Globe2,
    title: 'A Decade in the Trenches',
    body: 'In the years that follow, human rights and civil society work carries him through the National Constitutional Assembly, Transparency International Zimbabwe, the Crisis in Zimbabwe Coalition, the Global Zimbabwe Forum, the World AIDS Campaign, and SAPAM — Bulawayo to Johannesburg, Cape Town to Geneva.',
  },
  {
    year: '2018',
    icon: Vote,
    title: 'Whange Central Elects Its MP',
    imageSlug: 'daniel_profile_public_22',
    imageAlt: 'Hon. Molokele supporting community outreach and food security in Whange',
    body: 'He is elected Member of Parliament for Whange Central — the seat that turns a career of organising for other people\'s causes into direct responsibility for his own community\'s.',
  },
  {
    year: '2019–2023',
    icon: Landmark,
    title: 'Party, Committees, and a Second Term',
    imageSlug: 'daniel_profile_public_11',
    imageAlt: 'Hon. Molokele with colleagues',
    body: 'National Spokesperson, then Deputy Treasurer General of the MDC Alliance. Chairperson of the Portfolio Committee on Higher and Tertiary Education. Re-elected to a second term in 2023, and appointed to chair the Portfolio Committee on Health and Child Care.',
  },
  {
    year: 'Today',
    icon: Compass,
    title: 'Still Building',
    imageSlug: '785288024_10165529318904282_5261809633193675246_n',
    imageAlt: 'Hon. Molokele continuing his constituency leadership and international work',
    body: 'Overall Chairperson of the CCC Whange Cluster. A seat on the International Executive Committee of Parliamentarians for Global Action. A place on the Global Board of the UNITE Parliamentary Network for Global Health. Still the same boy from No. 1 Colliery.',
  },
];

const FLAG_THEMES = [
  {
    // Theme 0: Emerald Green
    markerBg: 'bg-[#044D29] text-[#DCA11D] border-[#DCA11D]/50 group-hover:bg-[#03381e] group-hover:scale-110 group-hover:border-[#DCA11D]',
    cardBorder: 'border-l-[#044D29] group-hover:border-l-[#DCA11D]',
    badgeText: 'text-[#044D29] dark:text-[#DCA11D]',
    headingHover: 'group-hover:text-[#044D29] dark:group-hover:text-[#DCA11D]',
  },
  {
    // Theme 1: Flag Gold
    markerBg: 'bg-[#DCA11D] text-[#090D14] border-[#044D29]/50 group-hover:bg-[#b88514] group-hover:text-white group-hover:scale-110 group-hover:border-[#044D29]',
    cardBorder: 'border-l-[#DCA11D] group-hover:border-l-[#044D29]',
    badgeText: 'text-[#9e700c] dark:text-[#DCA11D]',
    headingHover: 'group-hover:text-[#9e700c] dark:group-hover:text-[#DCA11D]',
  },
  {
    // Theme 2: Crimson Red
    markerBg: 'bg-[#C8102E] text-white border-[#DCA11D]/50 group-hover:bg-[#a10b22] group-hover:scale-110 group-hover:border-[#DCA11D]',
    cardBorder: 'border-l-[#C8102E] group-hover:border-l-[#DCA11D]',
    badgeText: 'text-[#C8102E] dark:text-red-400',
    headingHover: 'group-hover:text-[#C8102E] dark:group-hover:text-red-400',
  },
];

export default function Biography() {
  const revealRefs = useRef([]);
  const { images } = useGalleryImages('biography');

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
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full bg-slate-50 dark:bg-[#090D14] font-sans">

      {/* Hero */}
      <section className="relative w-full bg-[#090D14] py-20 sm:py-28 overflow-hidden border-b border-[#DCA11D]/30">
        <FlagStripe className="absolute top-0 left-0 w-full h-1 z-10" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans font-black text-xs sm:text-sm tracking-[0.3em] uppercase text-[#DCA11D]">
            Parliament of Zimbabwe • Official Biography
          </p>
          <h1 className="mt-4 font-sans font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-[1.05]">
            A Life, In Order
          </h1>
          <p className="mt-6 font-serif italic text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
            From a coal-mining clinic in Whange to the floor of Parliament — the full chronology,
            year by year.
          </p>
        </div>
      </section>

      {/* Chronology */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden">
        <div className="relative">
          {/* Connecting spine — Solid Emerald Green */}
          <div className="absolute left-6 sm:left-8 lg:left-1/2 lg:-translate-x-1/2 top-0 bottom-0 w-1 bg-[#044D29]" />

          <div className="space-y-12 lg:space-y-16">
            {timeline.map((entry, i) => {
              const Icon = entry.icon;
              const entryImg = entry.imageSlug ? findBySlug(images, entry.imageSlug) : null;
              const isRight = i % 2 === 1;
              const theme = FLAG_THEMES[i % FLAG_THEMES.length];

              return (
                <div
                  key={i}
                  ref={(el) => (revealRefs.current[i] = el)}
                  className="molokele-card-reveal relative pl-16 sm:pl-24 lg:pl-0 group"
                  style={{ transitionDelay: `${Math.min(i, 6) * 60}ms` }}
                >
                  {/* Icon marker with Flag Theme variations and hover scale */}
                  <div
                    className={`absolute left-0 lg:left-1/2 lg:-translate-x-1/2 top-0 z-10 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full shadow-md border-2 ring-4 ring-white dark:ring-[#090D14] transition-all duration-300 ${theme.markerBg}`}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  {/* Card with Flag Left Border variation and Hover elevation */}
                  <div
                    className={`relative overflow-hidden rounded-sm border-l-4 border-y border-r border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c121e] p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 lg:w-[calc(50%-3rem)] ${
                      theme.cardBorder
                    } ${isRight ? 'lg:ml-auto' : ''}`}
                  >
                    {/* Oversized faint year numeral watermark */}
                    <span className="absolute top-3 right-4 sm:right-6 font-serif font-black text-4xl sm:text-5xl text-slate-200/60 dark:text-white/[0.04] group-hover:text-[#044D29]/15 dark:group-hover:text-[#DCA11D]/15 select-none pointer-events-none leading-none whitespace-nowrap transition-colors duration-300">
                      {entry.year}
                    </span>

                    <span className={`relative font-sans font-black text-xs tracking-widest uppercase transition-colors duration-300 ${theme.badgeText}`}>
                      {entry.year}
                    </span>
                    <h2 className={`relative mt-1 font-sans font-black text-xl sm:text-2xl uppercase tracking-wide text-[#090D14] dark:text-white transition-colors duration-300 ${theme.headingHover}`}>
                      {entry.title}
                    </h2>
                    <p className="relative mt-3 font-serif text-base text-slate-600 dark:text-white/70 leading-relaxed">
                      {entry.body}
                    </p>

                    {entryImg && (
                      <div className="relative mt-5 overflow-hidden rounded-sm border border-slate-200 dark:border-white/10 shadow-sm">
                        <img
                          src={entryImg.url}
                          alt={entry.imageAlt}
                          className={`w-full ${entry.aspectRatio || 'aspect-[4/3]'} ${entry.objectPosition || 'object-cover object-top'} bg-slate-100 dark:bg-white/5 group-hover:scale-105 transition-transform duration-500`}
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-4xl bg-white dark:bg-[#0c121e] border-t-4 border-t-[#044D29] border border-slate-200 dark:border-white/10 rounded-sm p-8 sm:p-16 shadow-md relative overflow-hidden">
          <FlagStripe className="absolute top-0 left-0 w-full h-1" />
          
          <div className="relative z-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#044D29] dark:text-[#DCA11D] block mb-2">
              Parliamentary Portfolio
            </span>
            <h2 className="font-sans font-black text-2xl sm:text-4xl uppercase tracking-wide text-[#090D14] dark:text-white">
              The Roles, In Detail
            </h2>
            <p className="mt-4 font-serif text-lg sm:text-xl text-slate-700 dark:text-slate-200 max-w-xl mx-auto leading-relaxed">
              Parliament, party, and the wider world — see the full picture of where he leads today.
            </p>
            <a
              href="/leadership-roles/"
              className="group mt-8 btn-primary"
            >
              Leadership Roles
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
