import React, { useEffect, useRef, useState } from 'react';
import { HeartPulse, Scale, Leaf, HardHat, Accessibility, Palette, Quote, ArrowRight } from 'lucide-react';
import { useGalleryImages, findBySlug } from '../lib/wpMedia.js';
import ZimbabweMap from '../lib/ZimbabweMap.jsx';
import FlagStripe from '../lib/FlagStripe.jsx';

const sections = [
  {
    id: 'health-mental-health',
    tagSlug: 'health',
    icon: HeartPulse,
    label: 'Health & Mental Health',
    shortLabel: 'Health',
    quote: 'Mental health has become a huge issue in this country, and it is related to the economic crisis that we are facing.',
    body: [
      "As a public health advocate long before he was a legislator, Hon. Molokele has made mental health one of his defining causes in Parliament — exposing the overcrowding and chronic underfunding at Ingutsheni Mental Hospital, and pushing for stigma to be confronted head-on rather than legislated around.",
      'He has called for mental health institutions to be separated from drug rehabilitation services, for the Social Welfare Department to be properly resourced, and for next year\'s budget to significantly increase allocations to mental health care. On maternal health, he has pressed the Ministry on bribery in access to services and demanded that health-related taxes — on food, tobacco, sugar, mobile data — actually be ring-fenced for healthcare instead of vanishing into general revenue.',
    ],
    imageSlug: 'daniel_profile_public_14',
    imageAlt: 'Hon. Molokele at a Pan-African parliamentary health sector summit',
  },
  {
    id: 'gender-equality-womens-rights',
    tagSlug: 'gender-equality',
    icon: Scale,
    label: "Gender Equality & Women's Rights",
    shortLabel: 'Gender',
    quote: 'I am a He-for-She Champion... I am also opposed to any notion that seeks to prescribe to women in terms of their behaviour and conduct.',
    body: [
      'Hon. Molokele has been outspoken against the policing of women\'s dress, behaviour, and bodies — arguing in Parliament that men who prescribe how women should look or act are engaged in "patriarchal bullying" that has no place in a modern Zimbabwe.',
      'He has pushed for the Gender Equality Act that the 2013 Constitution promised but Zimbabwe still doesn\'t have — twelve years on, with government boards and commissions still overwhelmingly male. He has also called plainly for the repeal of the Termination of Pregnancy Act of 1977, a Rhodesian-era law he holds directly responsible for preventable deaths from unsafe abortion among Zimbabwean women.',
    ],
  },
  {
    id: 'environment-mining-energy',
    tagSlug: 'environment-mining',
    icon: Leaf,
    label: 'Environment, Mining & Energy',
    shortLabel: 'Environment',
    quote: 'I am from Whange. I was born of the coal. Where I come from, the coal is supposed to uplift our lives.',
    body: [
      "Whange sits on what Hon. Molokele calls the country's \"black diamond\" — and he has spent his time in Parliament arguing that the wealth beneath the town should actually reach the people living on top of it. He has demanded a minimum 10% community profit share from mining companies operating in Whange, transparent and democratically-run community trust funds, and an end to token board appointments that let a handful of individuals capture the benefit.",
      'He has also pressed for the relocation of Ingagula Township residents away from harmful power station pollution, and for Whange to be repositioned as a centre for renewable energy — grounding that ambition in his support for the SADC Centre for Renewable Energy and Energy Efficiency, and in Zimbabwe\'s constitutional right to an environment "not harmful to health and well-being."',
    ],
    imageSlug: 'cdf_borehole_installation_02',
    imageAlt: 'CDF-funded solar borehole installation in Whange Central',
  },
  {
    id: 'labour-workers-rights',
    tagSlug: 'labour-rights',
    icon: HardHat,
    label: "Labour & Workers' Rights",
    shortLabel: 'Labour',
    quote: 'Whange is a town built for workers, trade unionism, and labour movements.',
    body: [
      'The son of a career trade unionist, Hon. Molokele has championed Zimbabwe\'s ratification of ILO Convention 190 — the first international treaty recognising the right to a workplace free from violence and harassment — describing it as personal to a town built on organised labour.',
      "He has pushed for the Labour Relations Act, largely unchanged since 1985, to finally reflect an economy that has become predominantly informal, and for institutions like the Zimbabwe Gender Commission to be properly resourced in provinces — including his own Matabeleland North — that currently have no physical presence to enforce workplace protections at all.",
    ],
    imageSlug: 'daniel_profile_public_30',
    imageAlt: "Godfrey Majahana Mguni, Hon. Molokele's father and a career trade unionist",
  },
  {
    id: 'disability-rights',
    tagSlug: 'disability',
    icon: Accessibility,
    label: 'Disability Rights',
    shortLabel: 'Disability',
    quote: 'We are leaving the people with disabilities behind... I do not see a sign language interpreter.',
    body: [
      'A disability champion since the Ninth Parliament and Secretary of the Disability Caucus, Hon. Molokele has opposed governance reforms that would concentrate power over disability policy in a single appointed individual, arguing instead for a robust, independent Disability Commission modelled on the Gender Commission.',
      'He has also pointed out, bluntly, that sign language — one of Zimbabwe\'s sixteen official languages — has no interpreter in Parliament itself, and has called for that to change as a basic test of whether "leaving no one behind" means anything in practice.',
    ],
  },
  {
    id: 'culture-heritage',
    tagSlug: 'culture-heritage',
    icon: Palette,
    label: 'Culture & Heritage',
    shortLabel: 'Culture',
    quote: 'Black is not inferior, black is superior. Black can stand on the global stage.',
    body: [
      'Hon. Molokele has linked the widespread use of skin-lightening products directly to colonial conditioning, arguing that forty-five years after independence, Zimbabwe still needs deliberate black consciousness education — starting in primary schools — to undo generations of being taught that "black is inferior."',
      'He has also championed local cultural heritage events like Mzilikazi Day, pointing to Eswatini\'s Umhlanga Reed Dance Festival as proof that cultural tourism can be both a source of national pride and serious economic growth — and challenging government ministries to show up and support it, not just praise it from a distance.',
    ],
  },
];

function RelatedSpeeches({ tagSlug }) {
  const [speeches, setSpeeches] = useState([]);

  useEffect(() => {
    if (!tagSlug) return;
    fetch(`/wp-json/wp/v2/tags?slug=${encodeURIComponent(tagSlug)}`)
      .then((res) => res.json())
      .then((tags) => {
        if (!tags.length) return;
        return fetch(`/wp-json/wp/v2/posts?tags=${tags[0].id}&per_page=3`).then((res) => res.json());
      })
      .then((posts) => setSpeeches(Array.isArray(posts) ? posts : []))
      .catch(() => {});
  }, [tagSlug]);

  if (!speeches.length) return null;

  return (
    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
      <p className="font-sans font-black text-xs tracking-widest uppercase text-[#044D29] dark:text-[#DCA11D] mb-3">
        Hansard Speeches &amp; Parliamentary Records
      </p>
      <ul className="space-y-2">
        {speeches.map((s) => (
          <li key={s.id}>
            <a
              href={s.link}
              className="font-serif text-sm sm:text-base text-slate-700 dark:text-white/80 hover:text-[#044D29] dark:hover:text-[#DCA11D] transition-colors underline decoration-slate-300 dark:decoration-white/20 underline-offset-4"
              dangerouslySetInnerHTML={{ __html: s.title.rendered }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

const FLAG_VARIATIONS = [
  {
    borderTop: 'border-t-[#044D29]',
    iconBg: 'bg-[#044D29] text-[#DCA11D]',
    quoteBox: 'bg-[#044D29]/5 dark:bg-white/5 border-l-4 border-l-[#044D29]',
    quoteIcon: 'text-[#044D29] dark:text-[#DCA11D]',
    eyebrow: 'text-[#044D29] dark:text-[#DCA11D]',
    btnHover: 'group-hover:text-[#044D29] dark:group-hover:text-[#DCA11D]',
  },
  {
    borderTop: 'border-t-[#DCA11D]',
    iconBg: 'bg-[#DCA11D] text-[#090D14]',
    quoteBox: 'bg-[#DCA11D]/10 dark:bg-white/5 border-l-4 border-l-[#DCA11D]',
    quoteIcon: 'text-[#090D14] dark:text-[#DCA11D]',
    eyebrow: 'text-[#090D14] dark:text-[#DCA11D]',
    btnHover: 'group-hover:text-[#090D14] dark:group-hover:text-[#DCA11D]',
  },
  {
    borderTop: 'border-t-[#C8102E]',
    iconBg: 'bg-[#C8102E] text-white',
    quoteBox: 'bg-[#C8102E]/5 dark:bg-white/5 border-l-4 border-l-[#C8102E]',
    quoteIcon: 'text-[#C8102E] dark:text-[#DCA11D]',
    eyebrow: 'text-[#C8102E] dark:text-[#DCA11D]',
    btnHover: 'group-hover:text-[#C8102E] dark:group-hover:text-[#DCA11D]',
  },
];

export default function InParliament() {
  const revealRefs = useRef({});
  const { images } = useGalleryImages('in-parliament');
  const heroImg = findBySlug(images, 'daniel_profile_public_13');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.05 }
    );
    
    Object.values(revealRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Deep-link support
  useEffect(() => {
    const slug = window.molokeleThemeData?.pageSlug;
    if (slug && slug !== 'in-parliament') {
      const el = document.getElementById(slug);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }, []);

  const [activeSection, setActiveSection] = useState(sections[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220;
      let currentSection = sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= scrollPosition) {
          currentSection = s.id;
        }
      }
      setActiveSection(currentSection);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full bg-slate-50 dark:bg-[#090D14] font-sans overflow-x-hidden">

      {/* Hero Banner */}
      <section className="relative w-full bg-[#090D14] py-20 sm:py-28 border-b border-[#DCA11D]/30 overflow-hidden">
        <FlagStripe className="absolute top-0 left-0 w-full h-1 z-10" />

        {/* Faint gridline texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Watermark map */}
        <ZimbabweMap
          className="pointer-events-none absolute -right-24 -bottom-32 h-[30rem] w-auto text-white/[0.04] hidden lg:block"
          highlightClassName="fill-[#DCA11D]/[0.06]"
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <p className="font-sans font-black text-xs sm:text-sm tracking-[0.3em] uppercase text-[#DCA11D]">
                Parliament of Zimbabwe • Legislative Record
              </p>
              <h1 className="mt-4 font-sans font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-[1.05]">
                Six Fights, One Seat
              </h1>
              <p className="mt-6 font-serif italic text-lg sm:text-xl text-white/80 max-w-xl leading-relaxed">
                Health. Gender. Environment. Labour. Disability. Culture. Six areas where Hon. Molokele
                has taken real positions in the National Assembly — in his own words.
              </p>
            </div>
            {heroImg && (
              <div className="lg:col-span-5">
                <div className="overflow-hidden rounded-sm border border-white/10 shadow-2xl">
                  <img
                    src={heroImg.url}
                    alt="Hon. Molokele, official portrait, Parliament of Zimbabwe"
                    className="w-full aspect-[4/3] object-cover bg-white/10"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* At a glance — scannable cards */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#044D29] text-[#DCA11D] shadow-sm">
            <Scale className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#044D29] dark:text-[#DCA11D] block mb-1">
              National Assembly Focus Areas
            </span>
            <h2 className="font-sans font-black text-xl sm:text-3xl uppercase tracking-wide text-[#090D14] dark:text-white">
              The Six Parliamentary Fights
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((s, i) => {
            const Icon = s.icon;
            const theme = FLAG_VARIATIONS[i % FLAG_VARIATIONS.length];
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`group flex flex-col justify-between overflow-hidden rounded-sm border-x border-b border-slate-200 dark:border-white/10 border-t-4 ${theme.borderTop} bg-white dark:bg-[#0c121e] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
              >
                <div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-sm ${theme.iconBg} shadow-sm`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className={`mt-4 font-sans font-black text-lg uppercase tracking-wide text-[#090D14] dark:text-white ${theme.btnHover} transition-colors`}>
                    {s.label}
                  </h3>
                  <p className="mt-3 font-serif italic text-sm text-slate-600 dark:text-white/70 leading-relaxed">
                    "{s.quote}"
                  </p>
                </div>

                <span className={`mt-5 inline-flex items-center gap-1.5 font-sans font-black text-xs tracking-widest uppercase ${theme.eyebrow} group-hover:translate-x-1 transition-transform`}>
                  <span>Read Position</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* Quick jump sticky navigation bar */}
      <div className="sticky top-20 z-20 border-y border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#090D14]/95 backdrop-blur-md py-3.5 shadow-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 w-full">
            {sections.map((s) => {
              const isActive = activeSection === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`rounded-sm py-2.5 text-center font-sans font-black text-[11px] tracking-wider uppercase transition-all duration-200 border ${
                    isActive
                      ? '!bg-[#044D29] !border-[#DCA11D] !text-white shadow-md'
                      : '!bg-white dark:!bg-[#0c121e] border-slate-200 dark:border-white/10 !text-slate-700 dark:!text-white/70 hover:border-[#044D29] hover:!text-[#044D29] dark:hover:!text-[#DCA11D]'
                  }`}
                >
                  {s.shortLabel}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Position Sections */}
      {sections.map((s, i) => {
        const Icon = s.icon;
        const img = s.imageSlug ? findBySlug(images, s.imageSlug) : null;
        const theme = FLAG_VARIATIONS[i % FLAG_VARIATIONS.length];
        const reverse = i % 2 === 1;
        return (
          <section
            key={s.id}
            id={s.id}
            ref={(el) => (revealRefs.current[s.id] = el)}
            className={`scroll-mt-28 py-16 sm:py-24 border-b border-slate-200 dark:border-white/10 ${
              reverse ? 'bg-white dark:bg-[#0c121e]' : 'bg-slate-50 dark:bg-[#090D14]'
            }`}
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                <div className={`${img ? 'lg:col-span-7' : 'lg:col-span-12'} ${reverse ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-sm ${theme.iconBg} shadow-sm`}>
                      <Icon className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <div>
                      <span className={`text-xs font-black uppercase tracking-widest ${theme.eyebrow} block mb-0.5`}>
                        Parliamentary Position
                      </span>
                      <h2 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-wide text-[#090D14] dark:text-white">
                        {s.label}
                      </h2>
                    </div>
                  </div>

                  {/* Speech Quote Box */}
                  <div className={`mt-6 p-6 ${theme.quoteBox} rounded-r-sm`}>
                    <div className="flex items-start gap-4">
                      <Quote className={`h-7 w-7 flex-shrink-0 ${theme.quoteIcon}`} />
                      <p className="font-serif italic text-lg sm:text-xl text-[#090D14] dark:text-white leading-relaxed">
                        "{s.quote}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 font-serif text-base sm:text-lg text-slate-700 dark:text-white/80 leading-relaxed space-y-4">
                    {s.body.map((p, pi) => (
                      <p key={pi}>{p}</p>
                    ))}
                  </div>

                  <RelatedSpeeches tagSlug={s.tagSlug} />
                </div>

                {img && (
                  <div className={`lg:col-span-5 ${reverse ? 'lg:order-1' : ''}`}>
                    <div className="overflow-hidden rounded-sm border border-slate-200 dark:border-white/10 shadow-md">
                      <img
                        src={img.url}
                        alt={s.imageAlt}
                        className="w-full aspect-[4/3] object-cover bg-slate-100 dark:bg-white/5"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {/* Closing CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center bg-slate-50 dark:bg-[#090D14]">
        <div className="mx-auto max-w-4xl bg-white dark:bg-[#0c121e] border-t-4 border-t-[#044D29] border-x border-b border-slate-200 dark:border-white/10 rounded-sm p-8 sm:p-16 shadow-md relative overflow-hidden">
          <FlagStripe className="absolute top-0 left-0 w-full h-1" />
          
          <div className="relative z-10">
            <span className="text-xs font-black uppercase tracking-widest text-[#044D29] dark:text-[#DCA11D] block mb-2">
              From Policy to Real Delivery
            </span>
            <h2 className="font-sans font-black text-2xl sm:text-4xl uppercase tracking-wide text-[#090D14] dark:text-white">
              See It in Delivery
            </h2>
            <p className="mt-4 font-serif text-lg sm:text-xl text-slate-700 dark:text-white/80 max-w-xl mx-auto leading-relaxed">
              Policy positions are one thing. Here's where the CDF money actually went.
            </p>
            <a
              href="/cdf-tracker/"
              className="group mt-8 btn-primary"
            >
              CDF Tracker
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 text-[#DCA11D]" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
