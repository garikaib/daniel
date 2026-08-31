import React, { useEffect, useRef, useState } from 'react';
import { Church, Goal, Landmark, GraduationCap, Users, Globe, Quote, ArrowRight, Calendar, Heart, ShieldAlert } from 'lucide-react';
import { useGalleryImages, findBySlug } from '../lib/wpMedia.js';
import FlagStripe from '../lib/FlagStripe.jsx';

export default function About() {
  const revealRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { images } = useGalleryImages('about');
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
      { threshold: 0.08 }
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
    <div className="w-full bg-slate-50 dark:bg-[#090D14] font-sans text-slate-900 dark:text-white selection:bg-[#DCA11D]/30 selection:text-[#DCA11D] overflow-hidden">
      
      {/* Editorial Page Hero */}
      <section className="relative w-full bg-[#090D14] pt-28 pb-20 overflow-hidden border-b border-[#DCA11D]/30">
        <FlagStripe className="absolute top-0 left-0 w-full h-1" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="font-sans font-black text-xs sm:text-sm tracking-[0.35em] uppercase text-[#DCA11D]">
              Biographical Profile
            </span>
            <h1 className="mt-4 font-sans font-black text-4xl sm:text-6xl uppercase tracking-tight text-white leading-[1.02]">
              Born of the Coal,<br />Raised for the Fight.
            </h1>
            <div className="mt-6 flex items-center gap-4">
              <span className="h-0.5 w-12 bg-[#DCA11D]" />
              <p className="font-serif italic text-lg sm:text-xl text-white/80">
                The story of Hon. Molokele, Member of Parliament for Whange Central.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 1: The Child of Coal */}
      <section 
        ref={registerReveal}
        className="molokele-card-reveal mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Side Quote Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <Quote className="h-10 w-10 text-[#DCA11D]/40 mb-4" />
            <p className="font-serif italic text-2xl sm:text-3xl text-[#090D14] dark:text-white leading-snug border-l-4 border-[#044D29] dark:border-[#DCA11D] pl-6">
              "I am a child of coal. I was born of the coal, and I was raised for the coal."
            </p>
            <span className="mt-4 block font-sans text-xs font-black tracking-widest text-slate-500 dark:text-white/50 uppercase">
              — Whange No. 1 Colliery
            </span>
          </div>

          {/* Narrative Column */}
          <div className="lg:col-span-8 font-serif text-lg text-slate-700 dark:text-white/70 leading-relaxed space-y-6">
            <p className="text-xl sm:text-2xl font-bold text-brand-blue dark:text-white leading-relaxed">
              Fortune Daniel Molokela-Tsiye — known simply as Hon. Molokele — entered the world on Friday, January 31, 1975, at the No. 1 Colliery clinic in Whange.
            </p>
            <p>
              It is a birthplace he wears with pride, not apology. Whange is a rugged, hard-working town built on coal, where dust and grit are part of everyday life. In a country where "black" was once structurally and historically taught as something lesser, Hon. Molokele made a career of insisting on the exact opposite: that a child born black, on black soil, in a black coal town, has a fundamental, uncontested claim to the nation's future.
            </p>
            <p>
              This environment forged the resilience and commitment that define his public life. He is a leader raised by miners, shaped by struggle, and dedicated to the service of his community.
            </p>
          </div>
        </div>
      </section>

      {/* Chapter 2: Roots, Family & Reclamation */}
      <section 
        ref={registerReveal}
        className="molokele-card-reveal bg-brand-sand/30 dark:bg-white/[0.03] py-20 border-y border-brand-sand/50 dark:border-white/10"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Text Story */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm text-brand-orange">
                  <Users className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h2 className="font-sans font-black text-xl sm:text-2xl uppercase tracking-wider text-brand-blue dark:text-white">
                  Roots &amp; Reclamation
                </h2>
              </div>
              
              <div className="font-serif text-lg text-slate-700 dark:text-white/70 leading-relaxed space-y-4">
                <p>
                  His father, the late Godfrey Majahana Mguni, was a career trade unionist. Serving as Workers Committee Chairperson at the Whange mine from 1979 to 1994, he was a pivotal force in the Associated Mineworkers Union of Zimbabwe and the ZCTU. His mother, Jane Mpofu, a retired pre-school educator, taught him that organising communities and educating young minds are two sides of the same coin.
                </p>
                <p>
                  In 2000, Hon. Molokele reclaimed his ancestral name, changing it legally from Fortune Mguni to Fortune Daniel Molokela-Tsiye. This was a deep reclamation of his family's heritage, reuniting with the Batsieng clan in Mahikeng, South Africa — restoring an identity history had worn down. 
                </p>
                <p>
                  Hon. Molokele remains deeply anchored in his family roots in Whange, guided by the enduring legacy of his parents, Godfrey Majahana Mguni and Jane Mpofu, and his deep commitment to community service.
                </p>
              </div>
            </div>

            {/* Profile Photo Card */}
            <div className="lg:col-span-5 relative group">
              <div className="relative bg-white dark:bg-white/5 p-4 rounded-sm border border-slate-200 dark:border-white/10 shadow-xl">
                <img
                  {...img('daniel_profile_public_08', 'Hon. Molokele early career')}
                  className="w-full aspect-[4/5] sm:aspect-[3/4] object-cover object-top rounded-sm bg-brand-sand filter grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="mt-4 font-sans">
                  <span className="text-[10px] font-black tracking-widest text-brand-pink uppercase">Early Career Activist</span>
                  <p className="text-xs text-slate-500 dark:text-white/50 mt-1">
                    Geneva, Bulawayo, Cape Town, and Johannesburg — coordinating regional human rights networks.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Chapter 3: Educated for the Fight */}
      <section 
        ref={registerReveal}
        className="molokele-card-reveal mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Photo Left */}
          <div className="lg:col-span-5 order-2 lg:order-1 relative group">
            <div className="relative bg-white dark:bg-white/5 p-4 rounded-sm border border-slate-200 dark:border-white/10 shadow-xl">
              <img
                {...img('daniel_profile_public_05', 'Hon. Molokele at University of Zimbabwe')}
                className="w-full aspect-[4/5] sm:aspect-[3/4] object-cover object-top rounded-sm bg-brand-sand filter contrast-105"
              />
              <div className="mt-4 font-sans">
                <span className="text-[10px] font-black tracking-widest text-brand-blue uppercase">University of Zimbabwe</span>
                <p className="text-xs text-slate-500 dark:text-white/50 mt-1">
                  Mid-1990s student leadership — from SRC Secretary General to President.
                </p>
              </div>
            </div>
          </div>

          {/* Narrative Right */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm text-brand-pink">
                <GraduationCap className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h2 className="font-sans font-black text-xl sm:text-2xl uppercase tracking-wider text-brand-blue dark:text-white">
                Academic &amp; Union Vanguard
              </h2>
            </div>
            
            <div className="font-serif text-lg text-slate-700 dark:text-white/70 leading-relaxed space-y-4">
              <p>
                From St Ignatius Primary and John Tallach Secondary at Ingwenya Mission, to Fletcher High in Gweru, Hon. Molokele's academic path led to a Bachelor of Laws (Honours) at the University of Zimbabwe. There, he emerged as a principal leader of the student movement, serving consecutively as SRC Secretary General, Vice President, and ultimately President.
              </p>
              <p>
                His academic journey didn't stop there. He holds a Master of Laws in Human Rights Litigation from UNISA, an MBA from the African Leadership University in Kigali, and is currently pursuing a PhD in Leadership Studies at the International Leadership University in Nairobi.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Chapter 4: Motto & Lifestyle Pillars */}
      <section 
        ref={registerReveal}
        className="molokele-card-reveal bg-brand-blue text-white py-20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(253,244,245,0.05),transparent)] pointer-events-none" />
        
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-sans font-black text-xs sm:text-sm tracking-[0.3em] uppercase text-brand-pink">
              Motto &amp; Anchors
            </span>
            <h2 className="mt-3 font-sans font-black text-2xl sm:text-4xl uppercase tracking-tight">
              Christ. Soccer. Politics.
            </h2>
            <p className="mt-4 font-serif text-brand-sand/80 text-lg">
              Three pillars that outline a worldview: values in faith, connection in sport, and advocacy in power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Christ Card */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 hover:bg-white/10 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-pink mb-6 group-hover:scale-105 transition-all duration-300">
                <Church className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h3 className="font-sans font-black text-lg uppercase tracking-wider text-white">Christ</h3>
              <p className="mt-3 font-serif text-sm text-slate-300 leading-relaxed">
                Founder and Chairperson of the Christian Legal Society of Zimbabwe, and of the Christian Leadership Forum. He champions the conviction that faith and moral integrity belong in the center of public life.
              </p>
            </div>

            {/* Soccer Card */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 hover:bg-white/10 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-orange mb-6 group-hover:scale-105 transition-all duration-300">
                <Goal className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h3 className="font-sans font-black text-lg uppercase tracking-wider text-white">Soccer</h3>
              <p className="mt-3 font-serif text-sm text-slate-300 leading-relaxed">
                Football runs in the family blood. His father chaired Zulu Royals FC in Whange, and today Hon. Molokele serves as Chairperson of the Arsenal FC Zimbabwe Supporters Association, believing sports bridge community divides.
              </p>
            </div>

            {/* Politics Card */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 hover:bg-white/10 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-all duration-300">
                <Landmark className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h3 className="font-sans font-black text-lg uppercase tracking-wider text-white">Politics</h3>
              <p className="mt-3 font-serif text-sm text-slate-300 leading-relaxed">
                A human rights lawyer and civil society organizer for over fifteen years before standing for parliament. Conviction and grass-roots advocacy must always precede electoral politics.
              </p>
            </div>
          </div>

          {/* Mini Soccer/Community Gallery */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center border-t border-white/10 pt-16">
            <div className="space-y-4">
              <h3 className="font-sans font-black text-lg uppercase text-brand-pink tracking-wider">Community &amp; Football Legacy</h3>
              <p className="font-serif text-sm text-slate-300 leading-relaxed">
                Whether supporting local talent in Bulawayo or chairing the Zimbabwe Arsenal fans network, Hon. Molokele views football not as a pastime, but as a central institution of civic community building.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-2 rounded-sm border border-white/10">
                <img {...img('daniel_profile_public_25', 'Highlanders FC')} className="w-full aspect-[3/4] object-cover object-top rounded-sm bg-white/10 filter grayscale hover:grayscale-0 transition-all" />
                <span className="text-[9px] text-white/50 uppercase font-sans tracking-widest mt-1 block text-center">Bosso for life</span>
              </div>
              <div className="bg-white/5 p-2 rounded-sm border border-white/10">
                <img {...img('daniel_profile_public_20', 'Arsenal Zimbabwe')} className="w-full aspect-[3/4] object-cover object-top rounded-sm bg-white/10 filter grayscale hover:grayscale-0 transition-all" />
                <span className="text-[9px] text-white/50 uppercase font-sans tracking-widest mt-1 block text-center">COYG Supporters</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 5: Legislative & Executive Advocacy */}
      <section 
        ref={registerReveal}
        className="molokele-card-reveal mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Story Content Left */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm text-brand-plum">
                <Globe className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h2 className="font-sans font-black text-xl sm:text-2xl uppercase tracking-wider text-brand-blue dark:text-white">
                From the Streets to the Chamber
              </h2>
            </div>
            
            <div className="font-serif text-lg text-slate-700 dark:text-white/70 leading-relaxed space-y-4">
              <p>
                Before entering the parliament chamber, Hon. Molokele spent decades organizing on the streets and in boardrooms. He served in leadership capacities across leading organizations, including the Crisis in Zimbabwe Coalition, Transparency International Zimbabwe, the National Constitutional Assembly, and the World AIDS Campaign.
              </p>
              <p>
                Elected as MP for Whange Central in 2018 and re-elected in 2023, he chaired key portfolio committees, including Higher and Tertiary Education (2018–2023) and Health and Child Care (2023–2024). He also represents Southern and Eastern Africa on the boards of global organizations like Parliamentarians for Global Action and the UNITE Global Health Network.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="/in-parliament/"
                className="inline-flex items-center gap-2 font-sans font-black text-xs tracking-widest uppercase text-brand-pink hover:text-brand-orange transition-colors"
              >
                Explore parliamentary speeches
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Photo Right */}
          <div className="lg:col-span-5 relative group">
            <div className="relative bg-white dark:bg-white/5 p-4 rounded-sm border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
              <img
                {...img('daniel_profile_public_15', 'Hon. Molokele speaking in Parliament')}
                className="w-full aspect-[3/2] sm:aspect-[16/10] object-cover object-center rounded-sm bg-brand-sand filter contrast-105"
              />
              <div className="font-sans border-t border-brand-sand dark:border-white/10 pt-4">
                <span className="text-[10px] font-black tracking-widest text-brand-pink uppercase">Committee Chairman</span>
                <p className="text-xs text-slate-500 dark:text-white/50 mt-1">
                  Leading oversight debates on healthcare access and education infrastructure in Zimbabwe.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Chapter 6: The Voice of the Movement */}
      <section 
        ref={registerReveal}
        className="molokele-card-reveal bg-brand-sand/30 dark:bg-white/[0.03] py-20 border-t border-brand-sand/50 dark:border-white/10"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Photo Left */}
            <div className="lg:col-span-5 order-2 lg:order-1 relative group">
              <div className="relative bg-white dark:bg-white/5 p-4 rounded-sm border border-slate-200 dark:border-white/10 shadow-xl">
                <img
                  {...img('daniel_profile_public_02', 'Hon. Molokele national spokesperson')}
                  className="w-full aspect-[16/10] sm:aspect-[16/9] object-cover object-center rounded-sm bg-brand-sand filter contrast-105"
                />
                <div className="mt-4 font-sans">
                  <span className="text-[10px] font-black tracking-widest text-brand-blue uppercase">Spokesperson &amp; Voice</span>
                  <p className="text-xs text-slate-500 dark:text-white/50 mt-1">
                    Communicating national coalition policy and legislative vision to media networks.
                  </p>
                </div>
              </div>
            </div>

            {/* Narrative Right */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm text-brand-pink">
                <ShieldAlert className="h-6 w-6" strokeWidth={1.5} />
              </div>
                <h2 className="font-sans font-black text-xl sm:text-2xl uppercase tracking-wider text-brand-blue dark:text-white">
                  Democratic Movement Leadership
                </h2>
              </div>
              
              <div className="font-serif text-lg text-slate-700 dark:text-white/70 leading-relaxed space-y-4">
                <p>
                  As National Spokesperson and later Deputy Treasurer General of the MDC Alliance, Hon. Molokele held a central role in articulating the movement's policy positions and representing its national executive to global and local news networks.
                </p>
                <p>
                  He went on to serve as the Overall Chairperson of the CCC Whange Cluster, coordinating constituencies, mobilising local structures, and leading campaign logistics in Whange.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section 
        ref={registerReveal}
        className="molokele-card-reveal py-20 px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="mx-auto max-w-4xl bg-white dark:bg-brand-blue/30 border border-slate-200/80 dark:border-white/10 rounded-2xl p-8 sm:p-16 shadow-xl relative overflow-hidden">
          {/* Top subtle border */}
          <div className="absolute top-0 left-0 h-[2px] w-full bg-slate-200 dark:bg-white/10" />
          
          <div className="relative z-10">
            <p className="font-signature italic font-bold text-5xl sm:text-6xl text-brand-pink select-none leading-none mb-2">
              Christ. Soccer. Politics.
            </p>
            
            <p className="mt-4 font-serif text-lg sm:text-xl text-slate-700 dark:text-slate-200 max-w-xl mx-auto leading-relaxed">
              Three words. One life. Still the same boy from Whange No. 1 Colliery, still doing the work.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/in-parliament/"
                className="group btn-primary"
              >
                In Parliament
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="/cdf-tracker/"
                className="group btn-secondary"
              >
                CDF Tracker
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
