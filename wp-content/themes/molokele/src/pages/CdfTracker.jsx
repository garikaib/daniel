import React, { useEffect, useRef, useState } from 'react';
import {
  Droplets, CheckCircle2, Clock, HandCoins, ClipboardList, Users2,
  Hammer, ClipboardCheck, RefreshCw, TrendingUp, MapPin, ArrowRight, Newspaper,
  X, ChevronLeft, ChevronRight, Calendar, Bell, Users, MessageSquare, AlertCircle,
  Download, Share2, CalendarPlus
} from 'lucide-react';
import { useGalleryImages } from '../lib/wpMedia.js';
import ZimbabweMap from '../lib/ZimbabweMap.jsx';
import FlagStripe from '../lib/FlagStripe.jsx';
import AnimatedNumber from '../lib/AnimatedNumber.jsx';

// Icon keys stored in the backend (molokele_cdf_schedule / molokele_cdf_stages
// options) map to these already-imported lucide components — see the matching
// allow-list in molokele-tools.php.
const CDF_ICON_MAP = {
  users2: Users2,
  'clipboard-check': ClipboardCheck,
  'clipboard-list': ClipboardList,
  'message-square': MessageSquare,
  users: Users,
  clock: Clock,
  hammer: Hammer,
  bell: Bell,
  'refresh-cw': RefreshCw,
};

// Zimbabwe (CAT) is UTC+2 year-round, no DST — every datetime_iso value from
// the backend (a bare "YYYY-MM-DDTHH:mm" from a <input type="datetime-local">)
// is Whange Central local time. Anchoring it explicitly here means every
// visitor, in any timezone, sees the same correct wall-clock time and the
// same computed event status — a browser-local `new Date(iso)` parse would
// silently shift both for anyone outside CAT.
function toHarareDate(datetimeIso) {
  if (!datetimeIso) return null;
  const withSeconds = datetimeIso.length === 16 ? `${datetimeIso}:00` : datetimeIso;
  const d = new Date(`${withSeconds}+02:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

const HARARE_TZ = 'Africa/Harare';
const EVENT_DATE_FORMATTER = new Intl.DateTimeFormat('en-ZW', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: HARARE_TZ });
const EVENT_TIME_FORMATTER = new Intl.DateTimeFormat('en-ZW', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: HARARE_TZ });
const EVENT_DAY_FORMATTER = new Intl.DateTimeFormat('en-ZW', { day: 'numeric', timeZone: HARARE_TZ });
const EVENT_WEEKDAY_FORMATTER = new Intl.DateTimeFormat('en-ZW', { weekday: 'short', timeZone: HARARE_TZ });
const EVENT_MONTH_FORMATTER = new Intl.DateTimeFormat('en-ZW', { month: 'short', timeZone: HARARE_TZ });
const EVENT_DAY_KEY_FORMATTER = new Intl.DateTimeFormat('en-CA', { timeZone: HARARE_TZ, year: 'numeric', month: '2-digit', day: '2-digit' });

const formatEventDate = (d) => (d ? EVENT_DATE_FORMATTER.format(d) : '');
const formatEventTime = (d) => (d ? EVENT_TIME_FORMATTER.format(d) : '');
const harareDayKey = (d) => EVENT_DAY_KEY_FORMATTER.format(d);

function getEventTimes(item) {
  const start = toHarareDate(item.datetime_iso);
  if (!start) return null;
  const end = new Date(start.getTime() + (item.duration_minutes || 120) * 60000);
  return { start, end };
}

// The consultation schedule's status badge used to be a hardcoded string
// ("Active Today", "Tonight") frozen at whatever day the code was written —
// once that date passed, the tracker kept showing stale status forever.
// This derives status from the real clock instead, with a manual override
// for when reality diverges from the calendar (cancelled/postponed meetings).
function computeScheduleStatus(item, now) {
  if (item.status_override && item.status_override !== 'auto') {
    return item.status_override;
  }
  const times = getEventTimes(item);
  if (!times) return 'upcoming';
  if (now > times.end) return 'completed';
  if (now >= times.start && now <= times.end) return 'live';
  if (harareDayKey(now) === harareDayKey(times.start)) return 'today';
  return 'upcoming';
}

function pad2(n) { return String(n).padStart(2, '0'); }

function toGoogleCalUTC(date) {
  return `${date.getUTCFullYear()}${pad2(date.getUTCMonth() + 1)}${pad2(date.getUTCDate())}T${pad2(date.getUTCHours())}${pad2(date.getUTCMinutes())}${pad2(date.getUTCSeconds())}Z`;
}

function eventLocation(item) {
  return item.is_whatsapp
    ? 'WhatsApp Live Online — Whange Central Community Group'
    : 'Whange Central Constituency Office, 1270 Baobab Extension, Whange, Zimbabwe';
}

function generateGoogleCalendarUrl(item) {
  const times = getEventTimes(item);
  if (!times) return '#';
  const title = encodeURIComponent(`[CDF 2025] ${item.event}`);
  const details = encodeURIComponent(
    `Parliament of Zimbabwe — Whange Central CDF 2025 Campaign.\nEvent: ${item.event}\nType: ${item.type}\nAgenda: Review and submit 2025 Constituency Development Fund project proposals.\nHosted by: Hon. Fortune Daniel Molokele-Tsiye, MP.`
  );
  const location = encodeURIComponent(eventLocation(item));

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${toGoogleCalUTC(times.start)}/${toGoogleCalUTC(times.end)}&details=${details}&location=${location}`;
}

function downloadICSFile(item) {
  const times = getEventTimes(item);
  if (!times) return;
  const title = `[CDF 2025] ${item.event}`;
  const details = `Parliament of Zimbabwe — Whange Central CDF 2025 Campaign.\\nEvent: ${item.event}\\nType: ${item.type}\\nAgenda: Review and submit 2025 Constituency Development Fund project proposals.\\nHosted by: Hon. Fortune Daniel Molokele-Tsiye, MP.`;
  const location = eventLocation(item);

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hon. Daniel Molokele MP//Whange Central CDF//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${details}`,
    `LOCATION:${location}`,
    `DTSTART:${toGoogleCalUTC(times.start)}`,
    `DTEND:${toGoogleCalUTC(times.end)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${item.event.toLowerCase().replace(/[^a-z0-9]/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Fallback content — matches molokele-tools.php's default-seed functions
// exactly, so the page renders correctly before anyone touches the admin
// screen (same convention as FALLBACK_SLIDES in Home.jsx), and degrades
// gracefully if the REST fetch below ever fails.
const DEFAULT_CDF_CAMPAIGN = {
  announcement_badge: 'Parliament Announcement • August CDF Month',
  campaign_badge: '2025 Campaign',
  title: 'CDF 2025 Project Proposal Campaign',
  description: 'The Parliament of Zimbabwe has officially opened the call for 2025 Constituency Development Fund (CDF) project proposals for August. All residents, ward committees, and civil society groups in Whange Central are invited to participate in the upcoming consultation meetings.',
  deadline_label: 'Final Submission Deadline',
  deadline_datetime_iso: '2025-08-31T17:00',
  deadline_note: 'Submit completed ward proposal forms to the Whange Central Constituency Office.',
};

// Note: the submission deadline is deliberately NOT duplicated as a 7th
// schedule card — it already has its own callout box above. Repeating it
// here is what used to orphan a lone card in the grid's last row.
const DEFAULT_CDF_SCHEDULE = [
  { id: 'evt-1', event: 'CDF Executive Committee Meeting', datetime_iso: '2025-08-14T17:00', duration_minutes: 120, type: 'Executive Meeting', is_whatsapp: false, icon: 'users2', status_override: 'auto' },
  { id: 'evt-2', event: 'CDF Implementation Committee Meeting', datetime_iso: '2025-08-15T11:00', duration_minutes: 120, type: 'Committee Meeting', is_whatsapp: false, icon: 'clipboard-check', status_override: 'auto' },
  { id: 'evt-3', event: 'Launch of Online Consultations (WhatsApp Live)', datetime_iso: '2025-08-15T19:00', duration_minutes: 120, type: 'WhatsApp Live Online', is_whatsapp: true, icon: 'message-square', status_override: 'auto' },
  { id: 'evt-4', event: '2nd Online Consultation (WhatsApp Live)', datetime_iso: '2025-08-18T19:00', duration_minutes: 120, type: 'WhatsApp Live Online', is_whatsapp: true, icon: 'message-square', status_override: 'auto' },
  { id: 'evt-5', event: '3rd Online Consultation (WhatsApp Live)', datetime_iso: '2025-08-21T19:00', duration_minutes: 120, type: 'WhatsApp Live Online', is_whatsapp: true, icon: 'message-square', status_override: 'auto' },
  { id: 'evt-6', event: 'CDF Public Consultation Town Hall Meeting', datetime_iso: '2025-08-22T13:00', duration_minutes: 120, type: 'Public Town Hall', is_whatsapp: false, icon: 'users', status_override: 'auto' },
];

const DEFAULT_CDF_WARDS = [
  { ward: 'Ward 1', place: 'Chibondo', status: 'complete', note: 'Solar-powered borehole at Megawatts Primary School — operational, serving pupils and residents.' },
  { ward: 'Ward 4', place: 'Baghdad', status: 'complete', note: 'Fully installed and delivering fresh water since February.' },
  { ward: 'Ward 5', place: 'Empumalanga', status: 'mp-funded', note: 'Installation stalled when CDF funds ran out — the MP personally covered the outstanding US$2,000 to finish the job.' },
  { ward: 'Ward 6', place: 'Phase Four', status: 'complete', note: 'Installed and operational, easing water challenges for local residents.' },
  { ward: 'Ward 14', place: 'Ngumija', status: 'pending', note: 'Water scarcity remains severe. Initial CDF funds were exhausted — the office is now sourcing external funding.' },
];

const DEFAULT_CDF_STAGES = [
  { icon: 'users2', title: 'Ward Development Committee Meetings', body: 'Councillors, PR reps, and ward committees convene to open the project cycle.' },
  { icon: 'clipboard-list', title: 'Public Consultations & Resident Briefs', body: 'Communities are briefed directly and given the chance to raise concerns before drilling starts.' },
  { icon: 'hammer', title: 'Borehole Drilling & Solar Installation', body: 'Jimmy Jimmy Borehole Company carries out the physical works, ward by ward.' },
  { icon: 'clipboard-check', title: 'Project Review & Technical Audits', body: "The MP's office and contractor jointly verify completed work against what was promised." },
  { icon: 'refresh-cw', title: 'Feedback & Next-Cycle Proposals', body: 'Lessons from this cycle — including funding gaps — feed directly into next year\'s CDF proposal.' },
];

// Unified status-pill language for both the Ward Status Board and the
// Consultation Schedule — one style system instead of two ad-hoc ones, kept
// in the flag palette (green = done, gold = today/funded gap, red = needs
// attention, neutral = informational).
const STATUS_STYLES = {
  // Ward Status Board
  complete: { label: 'Complete', badge: 'bg-[#044D29] text-white border border-[#DCA11D]/30', border: 'border-l-[#044D29]', bar: 'bg-[#044D29]', icon: CheckCircle2 },
  'mp-funded': { label: 'Complete — MP-Funded Gap', badge: 'bg-[#DCA11D] text-[#090D14] font-black', border: 'border-l-[#DCA11D]', bar: 'bg-[#DCA11D]', icon: HandCoins },
  pending: { label: 'Pending', badge: 'bg-[#C8102E] text-white font-black', border: 'border-l-[#C8102E]', bar: 'bg-[#C8102E]', icon: Clock },
  // Consultation Schedule
  completed: { label: 'Completed', badge: 'bg-[#044D29] text-white border border-[#DCA11D]/30', border: 'border-l-[#044D29]', bar: 'bg-[#044D29]', icon: CheckCircle2 },
  live: { label: 'Live Now', badge: 'bg-[#C8102E] text-white font-black animate-pulse', border: 'border-l-[#C8102E]', bar: 'bg-[#C8102E]', icon: MessageSquare },
  ongoing: { label: 'Ongoing', badge: 'bg-[#DCA11D] text-[#090D14] font-black animate-pulse', border: 'border-l-[#DCA11D]', bar: 'bg-[#DCA11D]', icon: RefreshCw },
  today: { label: 'Today', badge: 'bg-[#DCA11D] text-[#090D14] font-black', border: 'border-l-[#DCA11D]', bar: 'bg-[#DCA11D]', icon: Bell },
  upcoming: { label: 'Upcoming', badge: 'bg-[#044D29]/10 dark:bg-white/10 text-[#044D29] dark:text-white/80 border border-[#044D29]/20 dark:border-white/10', border: 'border-l-[#044D29]/30 dark:border-l-white/20', bar: 'bg-[#044D29]/30 dark:bg-white/20', icon: Calendar },
  cancelled: { label: 'Cancelled', badge: 'bg-[#090D14] text-white/70 line-through decoration-2 decoration-[#C8102E]', border: 'border-l-[#090D14]/60 dark:border-l-white/20', bar: 'bg-[#090D14]/60 dark:bg-white/20', icon: X },
  postponed: { label: 'Postponed', badge: 'bg-transparent border-2 border-[#DCA11D] text-[#DCA11D] font-black', border: 'border-l-[#DCA11D]', bar: 'bg-[#DCA11D]', icon: AlertCircle },
};

const WARD_STATUS_KEYS = ['complete', 'mp-funded', 'pending'];

function FilterButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-sm px-4 py-2 font-sans font-black text-xs tracking-widest uppercase transition-all duration-200 ${
        active
          ? 'bg-[#044D29] text-[#DCA11D] shadow-md border border-[#DCA11D]/40'
          : 'bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );
}

export default function CdfTracker() {
  const revealRefs = useRef([]);
  const { images } = useGalleryImages('cdf-tracker');
  const [photoFilter, setPhotoFilter] = useState('all');

  // Campaign header, consultation schedule, ward status board, and project
  // stages are all admin-editable (Molokele Tools → CDF Tracker). Seed with
  // the same defaults the backend ships with so the page never renders
  // empty/broken before the fetch resolves — same convention as the
  // homepage hero slider (FALLBACK_SLIDES in Home.jsx).
  const [cdfCampaign, setCdfCampaign] = useState(DEFAULT_CDF_CAMPAIGN);
  const [cdfSchedule, setCdfSchedule] = useState(DEFAULT_CDF_SCHEDULE);
  const [cdfWards, setCdfWards] = useState(DEFAULT_CDF_WARDS);
  const [cdfStages, setCdfStages] = useState(DEFAULT_CDF_STAGES);

  useEffect(() => {
    fetch('/wp-json/molokele/v1/cdf-campaign').then((res) => res.json()).then((data) => {
      if (data && !data.code) setCdfCampaign(data);
    }).catch(() => {});

    fetch('/wp-json/molokele/v1/cdf-schedule').then((res) => res.json()).then((data) => {
      if (Array.isArray(data) && data.length > 0) setCdfSchedule(data);
    }).catch(() => {});

    fetch('/wp-json/molokele/v1/cdf-wards').then((res) => res.json()).then((data) => {
      if (Array.isArray(data) && data.length > 0) setCdfWards(data);
    }).catch(() => {});

    fetch('/wp-json/molokele/v1/cdf-stages').then((res) => res.json()).then((data) => {
      if (Array.isArray(data) && data.length > 0) setCdfStages(data);
    }).catch(() => {});
  }, []);

  // Drives the auto-computed schedule status (Completed / Live Now / Today /
  // Upcoming) — ticks every minute so a "Live Now" badge doesn't need a page
  // refresh to flip to "Completed" once an event ends.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const filteredPhotos = images.filter((img) => {
    if (photoFilter === 'all') return true;
    if (photoFilter === 'meetings') return img.slug.includes('committee_meeting');
    if (photoFilter === 'boreholes') return img.slug.includes('borehole_installation');
    return true;
  });

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredPhotos.length - 1));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev < filteredPhotos.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        setLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, filteredPhotos?.length]);

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
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [images, photoFilter]);

  let revealCount = 0;
  const registerReveal = (el) => {
    revealRefs.current[revealCount] = el;
    revealCount += 1;
  };

  const completeCount = cdfWards.filter((w) => w.status !== 'pending').length;

  return (
    <div className="w-full bg-slate-50 dark:bg-[#090D14] font-sans">

      {/* Hero Banner */}
      <section className="relative w-full py-20 sm:py-28 bg-[#090D14] border-b border-[#DCA11D]/30 overflow-hidden">
        <FlagStripe className="absolute top-0 left-0 w-full h-1 z-10" />

        {/* Faint gridline texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Watermark map */}
        <ZimbabweMap
          className="pointer-events-none absolute -right-24 -bottom-20 h-[34rem] w-auto text-white/[0.04] hidden lg:block"
          highlightClassName="fill-[#DCA11D]/[0.06]"
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <span className="font-sans font-black text-xs tracking-[0.4em] uppercase text-[#DCA11D] mb-6">
                Parliament of Zimbabwe &bull; CDF Audit
              </span>
              
              <h1 className="font-sans font-black text-white text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight leading-[1.05]">
                Water, Delivered.<br />
                <span className="text-[#DCA11D]">Ward by Ward.</span>
              </h1>
              
              <p className="mt-6 font-serif text-base sm:text-lg text-white/80 max-w-xl leading-relaxed">
                This isn’t just about promises—it’s about real progress you can see and feel in our local communities. 
                From our very first town hall planning meetings to the moment clean, fresh water flows from a new tap in your neighborhood, 
                we’re tracking every single step transparently together.
              </p>

              {/* High Contrast Stats */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-8">
                <div className="flex flex-col bg-white/5 border border-white/10 p-4 rounded-sm">
                  <span className="font-sans font-black text-4xl text-[#DCA11D] leading-none">
                    <AnimatedNumber value={completeCount} /><span className="text-lg text-white/40 font-normal ml-1">/{cdfWards.length}</span>
                  </span>
                  <span className="text-[10px] font-sans font-black tracking-wider uppercase text-white/70 mt-2">
                    Wards Fully Active
                  </span>
                </div>

                <div className="flex flex-col bg-white/5 border border-white/10 p-4 rounded-sm">
                  <span className="font-sans font-black text-4xl text-[#C8102E] leading-none">
                    $<AnimatedNumber value={2} />K
                  </span>
                  <span className="text-[10px] font-sans font-black tracking-wider uppercase text-white/70 mt-2">
                    MP Personal Bridge
                  </span>
                </div>

                <div className="flex flex-col bg-white/5 border border-white/10 p-4 rounded-sm">
                  <span className="font-sans font-black text-4xl text-[#3FBF72] leading-none">
                    <AnimatedNumber value={images.length} />
                  </span>
                  <span className="text-[10px] font-sans font-black tracking-wider uppercase text-white/70 mt-2">
                    Verified Site Photos
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Photograph Frame */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="relative w-full aspect-[4/5] bg-slate-900 overflow-hidden shadow-2xl border border-white/10 rounded-sm">
                <img
                  src="/wp-content/uploads/2026/08/cdf_borehole.jpg"
                  alt="Hon. Daniel Molokele inspecting a CDF solar borehole project in Whange Central"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="flex items-center justify-between text-xs font-sans font-black uppercase tracking-wider text-white/60 px-1">
                <span>Hon. Molokele, MP</span>
                <span className="text-[#DCA11D]">Whange Central</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Official CDF 2025 Campaign Announcement & Consultation Schedule */}
      <section ref={registerReveal} className="molokele-card-reveal mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="bg-white dark:bg-[#0c121e] border-t-4 border-t-[#044D29] border-x border-b border-slate-200 dark:border-white/10 rounded-sm p-8 sm:p-10 shadow-md relative overflow-hidden">
          <FlagStripe className="absolute top-0 left-0 w-full h-1" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-white/10">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-[#044D29] text-white px-3.5 py-1 rounded-sm border border-[#DCA11D]/40 shadow-sm">
                  <Bell className="h-3.5 w-3.5 text-[#DCA11D]" />
                  {cdfCampaign.announcement_badge}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-[#C8102E] text-white px-3 py-1 rounded-sm shadow-sm">
                  {cdfCampaign.campaign_badge}
                </span>
              </div>
              <h2 className="font-sans font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-[#090D14] dark:text-white leading-tight">
                {cdfCampaign.title}
              </h2>
              <p className="mt-2 font-serif text-sm sm:text-base text-slate-700 dark:text-white/80 max-w-3xl leading-relaxed">
                {cdfCampaign.description}
              </p>
            </div>

            {/* Deadline Callout Box */}
            <div className="bg-[#044D29] text-white p-6 rounded-sm border border-[#DCA11D]/40 shrink-0 lg:max-w-xs flex flex-col justify-center shadow-md">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#DCA11D]">
                <AlertCircle className="h-4 w-4 text-[#DCA11D]" />
                {cdfCampaign.deadline_label}
              </div>
              <p className="mt-2 font-sans font-black text-xl text-white">
                {formatEventDate(toHarareDate(cdfCampaign.deadline_datetime_iso))}
              </p>
              <p className="mt-1 font-serif text-xs text-white/80">
                {cdfCampaign.deadline_note}
              </p>
            </div>
          </div>

          {/* Consultation Schedule Grid with Interactive Calendar Links */}
          <div className="mt-10">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-[#044D29] dark:text-[#DCA11D]" />
                <h3 className="font-sans font-black text-lg sm:text-xl uppercase tracking-wide text-[#090D14] dark:text-white">
                  Proposed Consultation Schedule
                </h3>
              </div>
              <span className="text-xs font-sans font-bold text-[#044D29]/70 dark:text-[#DCA11D]/70">
                Add to Device Calendar &bull; Sync Events
              </span>
            </div>

            {/* flex-wrap + fixed card widths (not a CSS grid) so a trailing
                incomplete row centers instead of hugging left with a stark
                empty void — resilient for any future event count. */}
            <div className="flex flex-wrap justify-center gap-6">
              {cdfSchedule.map((item) => {
                const times = getEventTimes(item);
                const status = computeScheduleStatus(item, now);
                const style = STATUS_STYLES[status] || STATUS_STYLES.upcoming;
                const StatusIcon = style.icon;

                return (
                  <div
                    key={item.id}
                    className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                  >
                    <div
                      className={`group flex h-full flex-col justify-between overflow-hidden rounded-sm border-l-4 ${style.border} border-y border-r border-slate-200 dark:border-white/10 bg-white dark:bg-[#090D14] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                    >
                      <div className="p-5 flex gap-4">
                        {/* Calendar tile — day-at-a-glance, replaces the old cramped mono-text date */}
                        <div className="flex-shrink-0 w-16 rounded-sm border border-slate-200 dark:border-white/10 overflow-hidden self-start">
                          <div className="bg-[#044D29] text-center py-1 text-[9px] font-black uppercase tracking-widest text-[#DCA11D]">
                            {times ? EVENT_WEEKDAY_FORMATTER.format(times.start) : '—'}
                          </div>
                          <div className="flex flex-col items-center bg-slate-50 dark:bg-white/5 py-1.5">
                            <span className="font-sans font-black text-2xl leading-none text-[#090D14] dark:text-white">
                              {times ? EVENT_DAY_FORMATTER.format(times.start) : '?'}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-white/50 mt-0.5">
                              {times ? EVENT_MONTH_FORMATTER.format(times.start) : ''}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm ${style.badge}`}>
                            <StatusIcon className="h-2.5 w-2.5" />
                            {style.label}
                          </span>
                          <h4 className="mt-2 font-sans font-black text-sm uppercase tracking-wide text-[#090D14] dark:text-white leading-snug">
                            {item.event}
                          </h4>
                          <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px]">
                            <span className="inline-flex items-center gap-1 font-mono font-black text-[#C8102E] dark:text-[#DCA11D]">
                              <Clock className="h-3 w-3" />
                              {times ? formatEventTime(times.start) : ''}
                            </span>
                            <span className="text-slate-300 dark:text-white/20">&bull;</span>
                            <span className="font-sans font-semibold text-slate-500 dark:text-white/40">
                              {item.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Calendar Actions (Google, iCal/iOS, WhatsApp) */}
                      <div className="px-5 pb-5 pt-1 flex items-center gap-1.5">
                        <a
                          href={generateGoogleCalendarUrl(item)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Add to Google Calendar (Android / Desktop)"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#044D29] hover:bg-[#03381e] text-white !text-white text-[10px] font-black uppercase tracking-wider py-2 px-2 rounded-lg transition-colors border border-[#DCA11D]/30"
                        >
                          <CalendarPlus className="h-3.5 w-3.5 text-[#DCA11D]" />
                          <span>Google</span>
                        </a>

                        <button
                          onClick={() => downloadICSFile(item)}
                          title="Download .ics Calendar File (Apple iOS / Outlook)"
                          className="flex h-8 w-8 flex-shrink-0 items-center justify-center bg-[#DCA11D]/10 hover:bg-[#DCA11D]/20 dark:bg-white/10 dark:hover:bg-white/20 text-[#044D29] dark:text-[#DCA11D] rounded-lg transition-colors border border-[#DCA11D]/30 dark:border-white/10"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>

                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                            `📌 *Whange Central CDF 2025 Campaign*\n\nEvent: ${item.event}\nDate: ${times ? formatEventDate(times.start) : ''}\nTime: ${times ? formatEventTime(times.start) : ''}\nType: ${item.type}\n\nJoin us for constituency progress planning! Hosted by Hon. Fortune Daniel Molokele-Tsiye, MP.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Share event on WhatsApp"
                          className="flex h-8 w-8 flex-shrink-0 items-center justify-center bg-[#C8102E] hover:bg-[#A00C24] text-white rounded-lg shadow-xs transition-colors"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Ward Status Board */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div ref={registerReveal} className="molokele-card-reveal flex items-center gap-4 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#044D29] text-[#DCA11D] shadow-sm">
            <Droplets className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#044D29] dark:text-[#DCA11D] block mb-1">
              Active Constituency Work
            </span>
            <h2 className="font-sans font-black text-xl sm:text-3xl uppercase tracking-wide text-[#090D14] dark:text-white">
              Ward-by-Ward Status Board
            </h2>
          </div>
        </div>

        {/* Segmented Progress Bar */}
        <div ref={registerReveal} className="molokele-card-reveal mb-10">
          <div className="flex w-full h-3 rounded-sm overflow-hidden bg-slate-200 dark:bg-white/10 shadow-inner">
            {cdfWards.map((w, i) => (
              <div
                key={w.ward}
                className={`flex-1 ${STATUS_STYLES[w.status].bar} ${
                  i > 0 ? 'border-l-2 border-white dark:border-[#090D14]' : ''
                }`}
                title={`${w.ward} — ${STATUS_STYLES[w.status].label}`}
              />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            {WARD_STATUS_KEYS.map((key) => (
              <div key={key} className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-sm ${STATUS_STYLES[key].bar}`} />
                <span className="font-sans text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-white/70">
                  {STATUS_STYLES[key].label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {cdfWards.map((w, i) => {
            const style = STATUS_STYLES[w.status];
            const StatusIcon = style.icon;
            const wardNum = w.ward.replace('Ward ', '').padStart(2, '0');
            return (
              <div
                key={w.ward}
                ref={registerReveal}
                style={{ transitionDelay: `${i * 80}ms` }}
                className={`molokele-card-reveal group relative flex flex-col justify-between overflow-hidden rounded-sm border-y border-r border-slate-200 dark:border-white/10 border-l-4 ${style.border} bg-white dark:bg-[#0c121e] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
              >
                <span className="absolute bottom-2 right-3 font-serif font-black text-6xl select-none pointer-events-none text-slate-200/50 dark:text-white/[0.04]">
                  {wardNum}
                </span>
                
                <div>
                  <div className="relative flex items-center gap-1.5 text-[#044D29] dark:text-[#DCA11D] mb-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="font-sans text-[10px] font-black uppercase tracking-widest">{w.place}</span>
                  </div>
                  
                  <h3 className="relative font-sans font-black text-xl uppercase tracking-wide text-[#090D14] dark:text-white">
                    {w.ward}
                  </h3>
                  
                  <span className={`relative mt-3 inline-flex w-fit items-center gap-1.5 rounded-sm px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${style.badge}`}>
                    <StatusIcon className="h-3 w-3" />
                    {style.label}
                  </span>
                  
                  <p className="relative mt-4 font-serif text-sm text-slate-700 dark:text-white/70 leading-relaxed">
                    {w.note}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5-Stage Project Cycle Timeline */}
      <section className="bg-white dark:bg-[#0c121e] border-t border-slate-200 dark:border-white/10 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          <div ref={registerReveal} className="molokele-card-reveal flex items-center gap-4 mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#044D29] text-[#DCA11D] shadow-sm">
              <TrendingUp className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#044D29] dark:text-[#DCA11D] block mb-1">
                Transparent Governance
              </span>
              <h2 className="font-sans font-black text-xl sm:text-3xl uppercase tracking-wide text-[#090D14] dark:text-white">
                How a CDF Project Actually Happens
              </h2>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-7 top-0 bottom-0 w-1 bg-[#044D29] hidden sm:block" />
            
            <div className="space-y-10">
              {cdfStages.map((s, i) => {
                const Icon = CDF_ICON_MAP[s.icon] || Bell;
                return (
                  <div
                    key={i}
                    ref={registerReveal}
                    style={{ transitionDelay: `${i * 80}ms` }}
                    className="molokele-card-reveal relative flex items-start gap-6 sm:pl-0 group"
                  >
                    <div className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#044D29] text-[#DCA11D] border-2 border-[#DCA11D]/40 shadow-md ring-4 ring-white dark:ring-[#090D14] transition-all duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    
                    <div className="pt-2 bg-slate-50 dark:bg-[#090D14] border-l-4 border-l-[#044D29] border-y border-r border-slate-200 dark:border-white/10 p-6 rounded-sm shadow-sm flex-1 group-hover:shadow-md transition-shadow">
                      <span className="font-sans font-black text-xs tracking-widest uppercase text-[#044D29] dark:text-[#DCA11D] block mb-1">
                        Stage {i + 1}
                      </span>
                      <h3 className="font-sans font-black text-lg sm:text-xl uppercase tracking-wide text-[#090D14] dark:text-white">
                        {s.title}
                      </h3>
                      <p className="mt-2 font-serif text-sm sm:text-base text-slate-700 dark:text-white/70 leading-relaxed max-w-2xl">
                        {s.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* Photo Evidence Gallery */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div ref={registerReveal} className="molokele-card-reveal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#044D29] dark:text-[#DCA11D] block mb-1">
              Field Documentation
            </span>
            <h2 className="font-sans font-black text-xl sm:text-3xl uppercase tracking-wide text-[#090D14] dark:text-white">
              Photo Evidence Archive
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterButton active={photoFilter === 'all'} onClick={() => setPhotoFilter('all')}>All ({images.length})</FilterButton>
            <FilterButton active={photoFilter === 'meetings'} onClick={() => setPhotoFilter('meetings')}>Committee Meetings</FilterButton>
            <FilterButton active={photoFilter === 'boreholes'} onClick={() => setPhotoFilter('boreholes')}>Boreholes</FilterButton>
          </div>
        </div>

        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
          {filteredPhotos.map((img, idx) => (
            <div
              key={img.id}
              ref={registerReveal}
              style={{ transitionDelay: `${(idx % 8) * 60}ms` }}
              onClick={() => {
                setLightboxIndex(idx);
                setLightboxOpen(true);
              }}
              className="molokele-card-reveal group relative overflow-hidden rounded-sm shadow-sm break-inside-avoid cursor-pointer border border-slate-200 dark:border-white/10 hover:border-[#044D29] transition-all duration-300"
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full object-cover bg-slate-100 dark:bg-white/5 transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#090D14]/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                <span className="text-[#090D14] font-sans font-black text-xs tracking-widest uppercase bg-[#DCA11D] px-4 py-2 rounded-sm shadow-md scale-90 group-hover:scale-100 transition-all duration-300 border border-[#044D29]">
                  Zoom Photo
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Press Coverage Callout */}
      <section className="relative bg-[#090D14] py-16 sm:py-24 border-t border-[#DCA11D]/30 overflow-hidden">
        <FlagStripe className="absolute top-0 left-0 w-full h-1" />

        <div ref={registerReveal} className="molokele-card-reveal mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-sm bg-white/5 border border-white/10 p-8 sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm bg-[#044D29] text-[#DCA11D]">
                <Newspaper className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <div>
                <span className="font-sans font-black text-xs tracking-widest uppercase text-[#DCA11D] block mb-1">
                  Independently Reported Press Coverage
                </span>
                <h3 className="font-sans font-black text-xl sm:text-2xl text-white uppercase tracking-wide">
                  "Whange records progress in borehole drilling exercise"
                </h3>
                <p className="mt-2 font-serif text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl">
                  Southern Eye / NewsDay confirmed the same ward-by-ward progress independently — including the Ward 5 funding gap the MP covered personally.
                </p>
              </div>
            </div>

            <a
              href="/whange-records-progress-in-borehole-drilling-exercise/"
              className="flex-shrink-0 inline-flex items-center gap-2.5 bg-[#044D29] hover:bg-[#03381e] text-white !text-white font-sans font-black text-xs tracking-widest uppercase px-6 py-3.5 rounded-sm shadow-md transition-colors border border-[#DCA11D]/40"
            >
              <span>Read Article</span>
              <ArrowRight className="h-4 w-4 text-[#DCA11D]" />
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox / Slideshow Modal */}
      {lightboxOpen && filteredPhotos.length > 0 && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#090D14]/95 backdrop-blur-md py-6 px-4 animate-in fade-in duration-300">
          
          {/* Header Bar */}
          <div className="w-full flex items-center justify-between max-w-5xl">
            <span className="font-sans font-black text-xs tracking-widest uppercase text-[#DCA11D]">
              CDF Project Evidence Archive
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-sm bg-white/10 text-white hover:bg-[#C8102E] transition-colors focus:outline-none"
              aria-label="Close slideshow"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Main Visual Frame */}
          <div className="relative flex-1 w-full flex items-center justify-center my-4">
            <button
              onClick={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredPhotos.length - 1))}
              className="absolute left-2 sm:left-4 z-10 flex h-12 w-12 items-center justify-center rounded-sm bg-[#044D29] border border-[#DCA11D]/40 text-[#DCA11D] hover:bg-[#03381e] transition-all duration-200 focus:outline-none"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="max-h-[60vh] max-w-[85vw] md:max-h-[70vh] flex items-center justify-center bg-[#090D14] p-2 border border-white/10 rounded-sm shadow-2xl overflow-hidden">
              <img
                src={filteredPhotos[lightboxIndex].url}
                alt={filteredPhotos[lightboxIndex].alt || ''}
                className="max-h-[58vh] max-w-full md:max-h-[68vh] object-contain rounded-sm select-none"
              />
            </div>

            <button
              onClick={() => setLightboxIndex((prev) => (prev < filteredPhotos.length - 1 ? prev + 1 : 0))}
              className="absolute right-2 sm:right-4 z-10 flex h-12 w-12 items-center justify-center rounded-sm bg-[#044D29] border border-[#DCA11D]/40 text-[#DCA11D] hover:bg-[#03381e] transition-all duration-200 focus:outline-none"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Caption & Thumbnails */}
          <div className="w-full max-w-2xl flex flex-col items-center gap-4 text-center">
            {filteredPhotos[lightboxIndex].alt && (
              <p className="font-serif text-sm sm:text-base text-white/90 leading-relaxed max-w-xl">
                {filteredPhotos[lightboxIndex].alt}
              </p>
            )}

            <div className="flex gap-3 justify-center items-center overflow-x-auto py-2 px-4 max-w-full">
              {filteredPhotos.map((img, idx) => {
                const isActive = idx === lightboxIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className={`relative w-12 aspect-[4/3] rounded-sm overflow-hidden flex-shrink-0 transition-all duration-300 outline-none ${
                      isActive 
                        ? 'border-2 border-[#DCA11D] scale-110 opacity-100 shadow-md' 
                        : 'opacity-40 hover:opacity-100 border border-white/10'
                    }`}
                  >
                    <img
                      src={img.url}
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
