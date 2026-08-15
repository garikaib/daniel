import React from 'react';
import { Home, Landmark, Droplets, Newspaper, Mail, ArrowRight } from 'lucide-react';
import ZimbabweMap from '../lib/ZimbabweMap.jsx';
import FlagStripe from '../lib/FlagStripe.jsx';
import AnimatedNumber from '../lib/AnimatedNumber.jsx';

const quickLinks = [
  { label: 'Home', url: '/', icon: Home },
  { label: 'In Parliament', url: '/in-parliament/', icon: Landmark },
  { label: 'CDF Tracker', url: '/cdf-tracker/', icon: Droplets },
  { label: 'News & Updates', url: '/news-media/', icon: Newspaper },
  { label: 'Contact', url: '/contact/', icon: Mail },
];

export default function NotFound() {
  return (
    <div className="relative w-full min-h-[85vh] bg-[#090D14] overflow-hidden flex flex-col items-center justify-center py-24 px-4 sm:px-6 lg:px-8 border-b border-[#DCA11D]/30">
      <FlagStripe className="absolute top-0 left-0 w-full h-1 z-10" />

      {/* Faint editorial gridline texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Oversized watermark map */}
      <ZimbabweMap
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[42rem] w-auto text-white/[0.03]"
        highlightClassName="fill-[#DCA11D]/[0.06]"
      />

      <div className="relative z-10 text-center max-w-xl">
        <span className="font-serif text-[7rem] sm:text-[9rem] font-extralight text-[#DCA11D] leading-none select-none">
          <AnimatedNumber value={404} duration={900} />
        </span>

        <h1 className="mt-2 font-sans font-black text-2xl sm:text-3xl uppercase tracking-tight text-white leading-tight">
          This Page Isn't In Our Constituency
        </h1>
        <p className="mt-4 font-serif italic text-base sm:text-lg text-white/80 leading-relaxed">
          The link you followed doesn't lead anywhere we represent. Let's get you back to
          the record.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
          {quickLinks.map(({ label, url, icon: Icon }) => (
            <a
              key={label}
              href={url}
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-4 py-2.5 font-sans font-black text-[11px] tracking-widest uppercase text-white hover:bg-[#044D29] hover:border-[#DCA11D] hover:text-[#DCA11D] transition-all duration-300"
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2} />
              {label}
              <ArrowRight className="h-3 w-3 opacity-0 -ml-1.5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
