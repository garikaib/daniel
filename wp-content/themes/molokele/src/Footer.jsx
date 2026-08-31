import React from 'react';
import { Phone, Mail, MapPin, ArrowUp } from 'lucide-react';
import ZimbabweMap from './lib/ZimbabweMap.jsx';
import FlagStripe from './lib/FlagStripe.jsx';

const exploreLinks = [
  { title: 'About Hon. Molokele', url: '/about/' },
  { title: 'Biography', url: '/biography/' },
  { title: 'Leadership Roles', url: '/leadership-roles/' },
  { title: 'Family & Personal', url: '/family-personal/' },
];

const workLinks = [
  { title: 'In Parliament', url: '/in-parliament/' },
  { title: 'CDF Tracker', url: '/cdf-tracker/' },
  { title: 'News & Updates', url: '/news-media/' },
  { title: 'Photo Gallery', url: '/photo-gallery/' },
];

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 1.675c-3.178 0-3.518.012-4.77.07-2.5.113-3.511 1.135-3.623 3.623-.058 1.253-.069 1.593-.069 4.77 0 3.177.011 3.517.069 4.77.112 2.484 1.121 3.509 3.623 3.623 1.252.058 1.592.069 4.77.069 3.177 0 3.517-.011 4.77-.069 2.502-.114 3.511-1.139 3.623-3.623.058-1.253.069-1.593.069-4.77 0-3.178-.011-3.517-.069-4.77-.113-2.487-1.121-3.512-3.623-3.623-1.253-.058-1.593-.07-4.77-.07zm0 2.25a5.912 5.912 0 1 1 0 11.824 5.912 5.912 0 0 1 0-11.824zm0 9.574c2.023 0 3.662-1.639 3.662-3.662S14.023 8.338 12 8.338s-3.662 1.639-3.662 3.662 1.639 3.662 3.662 3.662zM18.406 4.155a1.44 1.44 0 1 1 0 2.88 1.44 1.44 0 0 1 0-2.88z" />
    </svg>
  );
}

const socialLinks = [
  { label: 'Facebook', url: 'https://www.facebook.com/daniel.molokele', Icon: FacebookIcon },
  { label: 'X (Twitter)', url: 'https://x.com/molokele', Icon: XIcon },
  { label: 'Instagram', url: 'https://www.instagram.com/danielmolokele/', Icon: InstagramIcon },
];

function FooterNavColumn({ title, links, accentDotClass, headerColorClass }) {
  return (
    <nav>
      <p className={`font-sans font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2 ${headerColorClass || 'text-[#DCA11D]'}`}>
        <span className={`inline-block h-2 w-2 rounded-xs ${accentDotClass || 'bg-[#044D29]'}`} />
        {title}
      </p>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.title}>
            <a
              href={link.url}
              className="font-sans text-sm text-white/70 hover:text-[#DCA11D] transition-colors"
            >
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full bg-[#090D14] text-white overflow-hidden border-t border-[#DCA11D]/30">
      {/* Official 7-Stripe Zimbabwe Flag Accent Bar */}
      <FlagStripe className="w-full h-1" />

      {/* Faint editorial gridline texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Oversized watermark map */}
      <ZimbabweMap
        className="pointer-events-none absolute -right-16 top-1/2 -translate-y-1/2 h-[26rem] w-auto text-white/[0.04] hidden lg:block"
        highlightClassName="fill-[#DCA11D]/[0.08]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-4">
            <a href="/" className="inline-flex items-center gap-3">
              <ZimbabweMap className="h-11 w-auto text-white flex-shrink-0" highlightClassName="fill-[#DCA11D]" />
              <div className="flex flex-col justify-center leading-none">
                <span className="font-sans font-black uppercase tracking-tight text-lg text-white">
                  Hon. Daniel Molokele
                </span>
                <span className="font-sans font-bold uppercase tracking-[0.2em] text-[10px] text-white/60 mt-1.5">
                  MP <span className="text-[#DCA11D] font-black">Whange Central</span>
                </span>
              </div>
            </a>
            <p className="mt-5 max-w-xs font-serif text-sm text-white/60 leading-relaxed">
              Serving the constituency of Whange Central in the National Assembly of
              Zimbabwe with transparency, accountability and purpose.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map(({ label, url, Icon }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80 hover:text-[#DCA11D] hover:border-[#DCA11D] hover:bg-[#044D29] hover:scale-105 transition-all duration-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <FooterNavColumn
              title="Explore"
              links={exploreLinks}
              accentDotClass="bg-[#044D29] border border-[#DCA11D]/40"
              headerColorClass="text-[#DCA11D]"
            />
            <FooterNavColumn
              title="The Work"
              links={workLinks}
              accentDotClass="bg-[#C8102E] border border-white/40"
              headerColorClass="text-white"
            />
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <p className="font-sans font-black text-xs uppercase tracking-widest text-[#DCA11D] mb-4 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-xs bg-[#DCA11D]" />
              Get In Touch
            </p>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#044D29] text-emerald-400" />
                <div className="space-y-1">
                  <div>
                    <a href="tel:+263776483659" className="block font-sans font-bold text-xs text-white hover:text-[#DCA11D] transition-colors">
                      +263 77 648 3659
                    </a>
                    <p className="font-serif text-[11px] text-white/50">PA / Spokesperson: Mr. Thulani Moyo</p>
                  </div>
                  <div>
                    <a href="tel:+263785030133" className="block font-sans font-bold text-xs text-white hover:text-[#DCA11D] transition-colors">
                      +263 78 503 0133
                    </a>
                    <p className="font-serif text-[11px] text-white/50">Secretary / Receptionist: Mrs Sukoluhle Ngwenya</p>
                  </div>
                  <div>
                    <a href="tel:+2638130598" className="block font-sans font-bold text-xs text-white hover:text-[#DCA11D] transition-colors">
                      +263 81 305 98 <span className="font-normal text-[10px] text-white/40">(Landline Code: 081 305 98)</span>
                    </a>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#C8102E]" />
                <a
                  href="mailto:info@danielmolokele.com"
                  className="font-sans font-bold text-xs text-white hover:text-[#DCA11D] transition-colors break-all"
                >
                  info@danielmolokele.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#DCA11D]" />
                <p className="font-serif text-xs text-white/60 leading-relaxed">
                  1270 Baobab Extension (Pharmacy Complex)<br />
                  Opposite St Patrick's Hospital<br />
                  Whange, Zimbabwe
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-white/50 text-center sm:text-left">
            &copy; {year} Hon. Molokele MP. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C8102E] text-white shadow-md hover:bg-[#044D29] hover:text-[#DCA11D] hover:scale-105 transition-all duration-200"
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </footer>
  );
}
