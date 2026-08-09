import React from 'react';
import { User, Mail, Landmark, FileText, MessageSquare, Newspaper, ArrowRight } from 'lucide-react';

export default function Home() {
  const quickLinks = [
    {
      title: "Meet Daniel",
      description: "Learn about Daniel's biography, union legacy, and name reclamation journey.",
      url: "/about/biography/",
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
      title: "Speeches & Media",
      description: "Access Hansard excerpts, debates, and public transcripts from parliament.",
      url: "/news-media/speeches/",
      icon: MessageSquare,
    },
    {
      title: "Press Coverage",
      description: "Read local and national press articles regarding Hwange Central.",
      url: "/news-media/press-coverage/",
      icon: Newspaper,
    },
    {
      title: "Get in Touch",
      description: "Contact the constituency office, Mr. Thulani Moyo, or send an email.",
      url: "/contact/",
      icon: Mail,
    },
  ];

  return (
    <div className="w-full bg-brand-sand/30 font-sans">
      
      {/* Hero Section */}
      <section 
        className="relative w-full h-[650px] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: "url('/wp-content/themes/molokele/images/home_hon_molokele_official.jpg')"
        }}
      >
        {/* Dark gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/80 via-brand-blue/50 to-brand-blue/10 z-0" />

        {/* Hero Content Wrapper */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-10 text-white">
          <div className="max-w-2xl md:ml-8">

            {/* Top Tagline */}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-sans font-black text-xs sm:text-sm tracking-widest uppercase text-white">
                Member of Parliament
              </span>
              <span className="h-2 w-2 rounded-full bg-brand-pink" />
            </div>

            {/* Name Branding */}
            <div className="mb-2">
              {/* Cursive Signature */}
              <span className="block font-signature text-7xl sm:text-8xl md:text-9xl text-brand-pink leading-[0.75] -mb-3 sm:-mb-5 md:-mb-7 pl-1 select-none drop-shadow-md">
                Molokele
              </span>
              {/* Bold Sans Surname */}
              <h1 className="font-sans font-black text-6xl sm:text-8xl md:text-9xl text-white tracking-tighter uppercase leading-none select-none">
                Daniel
              </h1>
            </div>

            {/* Representation Subtitle */}
            <p className="mt-4 font-serif text-base sm:text-lg md:text-xl tracking-[0.15em] uppercase text-white drop-shadow-md">
              Representing Hwange Central Constituency
            </p>

          </div>
        </div>
      </section>

      {/* Feature Quick Links Grid */}
      <section className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <a
                key={idx}
                href={link.url}
                className="group flex flex-col justify-between bg-white border border-brand-sand p-8 rounded-sm shadow-lg hover:shadow-xl hover:border-brand-pink transition-all duration-300"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-brand-sand text-brand-blue group-hover:bg-brand-pink group-hover:text-white transition-colors duration-300">
                    <Icon className="h-6 w-6 stroke-[1.8]" />
                  </div>
                  <h3 className="mt-6 font-sans font-black text-lg tracking-wider text-brand-blue uppercase group-hover:text-brand-pink transition-colors duration-300">
                    {link.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                    {link.description}
                  </p>
                </div>
                
                <div className="mt-8 flex items-center gap-2 text-xs font-black tracking-widest text-brand-blue group-hover:text-brand-pink uppercase transition-colors duration-300">
                  <span>Explore</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

    </div>
  );
}
