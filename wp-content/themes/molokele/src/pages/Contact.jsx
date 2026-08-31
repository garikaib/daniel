import React, { useState } from 'react';
import { HiPhone, HiMail, HiLocationMarker, HiPaperAirplane, HiCheckCircle, HiExternalLink } from 'react-icons/hi';
import { HiArrowRightCircle } from 'react-icons/hi2';
import ZimbabweMap from '../lib/ZimbabweMap.jsx';
import FlagStripe from '../lib/FlagStripe.jsx';

/* Shared input class — gold focus ring inspired by the header ribbon */
const inputCls =
  'w-full rounded-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-4 py-3 font-sans text-sm text-[#090D14] dark:text-white placeholder-slate-400 dark:placeholder-white/25 focus:border-[#DCA11D] focus:ring-2 focus:ring-[#DCA11D]/20 focus:outline-none transition-all duration-200 shadow-sm';

export default function Contact() {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ user_name: '', user_email: '', user_phone: '', subject: '', message: '' });
    }, 1200);
  };

  const mapEmbedUrl = "https://maps.google.com/maps?q=St+Patricks+Hospital,+Hwange,+Zimbabwe&t=&z=15&ie=UTF8&iwloc=&output=embed";
  const mapDirectUrl = "https://maps.google.com/?q=St+Patricks+Hospital,+Hwange,+Zimbabwe";

  return (
    <div className="w-full bg-slate-50 dark:bg-[#090D14] font-sans text-slate-900 dark:text-white selection:bg-[#DCA11D]/30 selection:text-[#DCA11D] min-h-screen">

      {/* Page Hero */}
      <section className="relative w-full bg-[#090D14] py-20 sm:py-24 overflow-hidden border-b border-[#DCA11D]/30">
        <FlagStripe className="absolute top-0 left-0 w-full h-1 z-10" />

        {/* Faint editorial gridline texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Oversized watermark map */}
        <ZimbabweMap
          className="pointer-events-none absolute -right-20 -bottom-28 h-[26rem] w-auto text-white/[0.04] hidden lg:block"
          highlightClassName="fill-[#DCA11D]/[0.06]"
        />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#044D29] border border-[#DCA11D]/40 text-[#DCA11D] text-xs font-black uppercase tracking-widest rounded-sm mb-4">
            <span>🇿🇼</span> Parliament of Zimbabwe • Whange Central MP Office
          </div>
          <h1 className="font-sans font-black text-4xl sm:text-5xl uppercase tracking-tight text-white leading-none">
            Get In Touch
          </h1>
          <p className="mt-4 font-serif text-white/80 text-base sm:text-lg max-w-2xl">
            Whether you have a query about the CDF project audits, need constituency support, or wish to share feedback, we are here to listen.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── Left Column: Staff Contacts & Email ── */}
          <div className="lg:col-span-5 space-y-6">

            {/* Editorial section header */}
            <div className="pb-4 border-b border-[#DCA11D]/25">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#044D29] dark:text-[#DCA11D]/70 block mb-1.5">
                Direct Support &amp; Staff
              </span>
              <h2 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#090D14] dark:text-white leading-none">
                Constituency<br />Contacts
              </h2>
            </div>

            {/* Phone & Staff Contacts Card */}
            <div className="bg-white dark:bg-[#0c121e] rounded-sm border-t-2 border-t-[#044D29] border border-slate-200/70 dark:border-white/[0.07] shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Card header strip */}
              <div className="flex items-center gap-3 px-5 py-4 bg-slate-50/80 dark:bg-white/[0.03] border-b border-slate-100 dark:border-white/[0.06]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#DCA11D]/50 text-[#DCA11D] hover:border-[#DCA11D] hover:scale-105 transition-all duration-200">
                  <HiPhone className="h-4 w-4 fill-current" />
                </div>
                <h3 className="font-sans font-black text-xs uppercase tracking-widest text-[#044D29] dark:text-[#DCA11D]">
                  Constituency Office Staff
                </h3>
              </div>

              {/* Card body */}
              <div className="p-5 space-y-4">
                <div>
                  <span className="text-[10px] font-black text-[#C8102E] uppercase tracking-[0.15em] block mb-0.5">Personal Assistant / Spokesperson</span>
                  <p className="font-sans font-black text-sm text-[#090D14] dark:text-white">Mr. Thulani Moyo</p>
                  <a href="tel:+263776483659" className="text-xs font-semibold text-slate-500 dark:text-white/60 hover:text-[#044D29] dark:hover:text-[#DCA11D] transition-colors">
                    +263 77 648 3659 (Cell)
                  </a>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-white/[0.07]">
                  <span className="text-[10px] font-black text-[#044D29] dark:text-[#DCA11D] uppercase tracking-[0.15em] block mb-0.5">Secretary / Receptionist</span>
                  <p className="font-sans font-black text-sm text-[#090D14] dark:text-white">Mrs Sukoluhle Ngwenya</p>
                  <a href="tel:+263785030133" className="text-xs font-semibold text-slate-500 dark:text-white/60 hover:text-[#044D29] dark:hover:text-[#DCA11D] transition-colors">
                    +263 78 503 0133 (Cell: 078 503 0133)
                  </a>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-white/[0.07]">
                  <span className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-[0.15em] block mb-0.5">Office Landline</span>
                  <a href="tel:+2638130598" className="font-sans font-black text-sm text-[#090D14] dark:text-white hover:text-[#044D29] dark:hover:text-[#DCA11D] transition-colors">
                    +263 81 305 98 <span className="text-xs font-normal text-slate-400 dark:text-white/40">(Whange Code: 081 305 98)</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white dark:bg-[#0c121e] rounded-sm border-t-2 border-t-[#044D29] border border-slate-200/70 dark:border-white/[0.07] shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Card header strip */}
              <div className="flex items-center gap-3 px-5 py-4 bg-slate-50/80 dark:bg-white/[0.03] border-b border-slate-100 dark:border-white/[0.06]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#DCA11D]/50 text-[#DCA11D] hover:border-[#DCA11D] hover:scale-105 transition-all duration-200">
                  <HiMail className="h-4 w-4 fill-current" />
                </div>
                <h3 className="font-sans font-black text-xs uppercase tracking-widest text-[#044D29] dark:text-[#DCA11D]">
                  General Inquiries
                </h3>
              </div>

              {/* Card body */}
              <div className="p-5">
                <a
                  href="mailto:info@danielmolokele.com"
                  className="block font-sans font-black text-base text-[#090D14] dark:text-white hover:text-[#044D29] dark:hover:text-[#DCA11D] transition-colors break-all"
                >
                  info@danielmolokele.com
                </a>
                <p className="text-xs text-slate-500 dark:text-white/50 mt-2 leading-relaxed font-serif">
                  For public relations, speaker bookings, or parliamentary affairs.
                </p>
              </div>
            </div>

          </div>

          {/* ── Right Column: Contact Form ── */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0c121e] border border-slate-200/70 dark:border-white/[0.07] rounded-sm shadow-xl overflow-hidden">

            {/* Ribbon-inspired dark header band */}
            <div className="relative bg-[#044D29] px-8 sm:px-10 py-6 border-b border-[#DCA11D]/20">
              <FlagStripe className="absolute top-0 left-0 w-full h-[3px]" />
              {/* Subtle grid texture */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:2rem_2rem]" />
              <div className="relative">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#DCA11D]/70 block mb-1">
                  Online Inquiry
                </span>
                <h2 className="font-sans font-black text-xl sm:text-2xl uppercase tracking-wider text-white leading-none">
                  Send a Message
                </h2>
                <p className="font-serif text-[11px] text-white/40 mt-2">
                  Fields marked with * are required.
                </p>
              </div>
            </div>

            {/* Form body */}
            <div className="p-8 sm:p-10">
              {isSubmitted ? (
                <div className="text-center py-12 space-y-5">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#DCA11D]/60 text-[#DCA11D]">
                    <HiCheckCircle className="h-9 w-9 fill-current" />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-xl uppercase tracking-wider text-[#090D14] dark:text-white">
                      Message Sent
                    </h3>
                    <p className="font-serif text-sm text-slate-500 dark:text-white/60 max-w-sm mx-auto leading-relaxed mt-2">
                      Thank you for reaching out. A constituency staff member or Mr. Thulani Moyo will respond to you shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="inline-flex items-center justify-between gap-3 bg-[#044D29] hover:bg-[#03381e] text-[#DCA11D] font-sans font-black text-xs uppercase tracking-widest px-7 py-3.5 rounded-sm transition-all duration-200 border border-[#DCA11D]/40 shadow-md group"
                  >
                    <span>Send another message</span>
                    <HiPaperAirplane className="h-3.5 w-3.5 fill-current rotate-90 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="user_name" className="block font-sans text-[10px] font-black uppercase tracking-[0.15em] text-[#090D14] dark:text-white/80 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="user_name"
                        required
                        value={formData.user_name}
                        onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                        className={inputCls}
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="user_email" className="block font-sans text-[10px] font-black uppercase tracking-[0.15em] text-[#090D14] dark:text-white/80 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="user_email"
                        required
                        value={formData.user_email}
                        onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                        className={inputCls}
                        placeholder="e.g. john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="user_phone" className="block font-sans text-[10px] font-black uppercase tracking-[0.15em] text-[#090D14] dark:text-white/80 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="user_phone"
                        value={formData.user_phone}
                        onChange={(e) => setFormData({ ...formData, user_phone: e.target.value })}
                        className={inputCls}
                        placeholder="e.g. +263 77..."
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block font-sans text-[10px] font-black uppercase tracking-[0.15em] text-[#090D14] dark:text-white/80 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className={inputCls}
                        placeholder="What is this regarding?"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block font-sans text-[10px] font-black uppercase tracking-[0.15em] text-[#090D14] dark:text-white/80 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows="5"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`${inputCls} resize-y`}
                      placeholder="Write your message here..."
                    />
                  </div>

                  {/* Premium full-width submit button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-between bg-[#044D29] hover:bg-[#03381e] text-[#DCA11D] font-sans font-black text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-[#DCA11D]/35 disabled:opacity-55 disabled:cursor-not-allowed group"
                    >
                      <span>{isSubmitting ? 'Sending\u2026' : 'Send Message'}</span>
                      <div className="flex items-center gap-2">
                        {isSubmitting && (
                          <span className="inline-block h-3 w-3 rounded-full border-2 border-[#DCA11D]/40 border-t-[#DCA11D] animate-spin" />
                        )}
                        <HiPaperAirplane className="h-4 w-4 fill-current rotate-90 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </button>
                  </div>

                </form>
              )}
            </div>
          </div>

        </div>

        {/* ── Full-Width Physical Address & Map ── */}
        <div className="bg-white dark:bg-[#0c121e] rounded-sm border-t-2 border-t-[#C8102E] border border-slate-200/70 dark:border-white/[0.07] shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">

            {/* Left: Address Details */}
            <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 dark:border-white/[0.06]">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C8102E]/50 text-[#C8102E] dark:border-[#DCA11D]/40 dark:text-[#DCA11D] hover:scale-105 transition-all duration-200">
                    <HiLocationMarker className="h-5 w-5 fill-current" />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-xs uppercase tracking-widest text-[#C8102E] dark:text-[#DCA11D]">Physical Address</h3>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-wider block">Whange Constituency Headquarters</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="font-sans font-black text-base sm:text-lg text-[#090D14] dark:text-white leading-snug">
                    1270 Baobab Extension
                  </p>
                  <p className="font-sans font-extrabold text-sm text-[#044D29] dark:text-[#DCA11D]">
                    (Pharmacy Complex)
                  </p>
                  <p className="font-serif italic text-sm sm:text-base text-slate-600 dark:text-white/70">
                    Opposite St Patrick's Hospital
                  </p>
                  <p className="font-sans font-black text-sm uppercase tracking-wider text-[#090D14] dark:text-white pt-1">
                    Whange, Zimbabwe
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.07] flex items-center justify-between text-xs">
                <span className="font-sans font-bold text-slate-400 dark:text-white/40 uppercase tracking-wider">Office Hours</span>
                <span className="font-sans font-black text-[#044D29] dark:text-[#DCA11D]">Mon – Fri: 8:00 AM – 5:00 PM</span>
              </div>
            </div>

            {/* Right: Interactive Map */}
            <div className="md:col-span-7 relative min-h-[260px] bg-slate-100 dark:bg-white/5 group">
              <iframe
                title="Whange Constituency Office Map Location"
                src={mapEmbedUrl}
                className="w-full h-full min-h-[260px] border-0 grayscale contrast-125 dark:invert dark:hue-rotate-180 dark:contrast-100 opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
                allowFullScreen
              />

              {/* Map control bar overlay */}
              <div className="absolute bottom-3 left-3 right-3 bg-[#090D14]/90 backdrop-blur-sm border border-[#DCA11D]/40 p-2.5 rounded-sm flex items-center justify-between gap-2 shadow-lg">
                <div className="flex items-center gap-2 text-xs font-sans font-black uppercase text-white tracking-wider truncate">
                  <HiArrowRightCircle className="h-3.5 w-3.5 text-[#DCA11D] fill-current shrink-0" />
                  <span className="truncate">Opposite St Patrick's Hospital</span>
                </div>
                <a
                  href={mapDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#044D29] hover:bg-[#03381e] !text-white font-black text-[11px] uppercase tracking-wider px-3.5 py-1.5 rounded-sm shadow-md transition-colors border border-[#DCA11D]/40 shrink-0 group/dir"
                >
                  <span className="!text-white">Get Directions</span>
                  <HiExternalLink className="h-3 w-3 text-[#DCA11D] fill-current group-hover/dir:translate-x-0.5 transition-transform duration-150" />
                </a>
              </div>
            </div>

          </div>
        </div>

      </section>
    </div>
  );
}
