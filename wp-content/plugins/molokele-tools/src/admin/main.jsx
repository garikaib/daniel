import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Settings, Image as ImageIcon, Save, Trash2, Plus, Check, Edit2, Loader2, ExternalLink,
  Layers, ChevronUp, ChevronDown, ChevronRight, ArrowRight, ImagePlus, X,
  Calendar, LayoutDashboard, Sliders, MapPin, Users, Users2, MessageSquare,
  Clock, Hammer, Bell, RefreshCw, ClipboardCheck, ClipboardList, Eye,
  CheckCircle2, AlertCircle, Search, ArrowUpRight, Landmark, ShieldCheck
} from 'lucide-react';
import './index.css';

// Available icons for CDF items
const CDF_ICON_MAP = {
  'users2': { label: 'Users (Group)', icon: Users2 },
  'clipboard-check': { label: 'Clipboard Check', icon: ClipboardCheck },
  'clipboard-list': { label: 'Clipboard List', icon: ClipboardList },
  'message-square': { label: 'Message / WhatsApp', icon: MessageSquare },
  'users': { label: 'Users (Public)', icon: Users },
  'clock': { label: 'Clock', icon: Clock },
  'hammer': { label: 'Hammer (Works)', icon: Hammer },
  'bell': { label: 'Bell (Announcement)', icon: Bell },
  'refresh-cw': { label: 'Refresh (Cycle)', icon: RefreshCw },
};

const CDF_ICON_OPTIONS = Object.entries(CDF_ICON_MAP).map(([value, { label }]) => ({
  value,
  label,
}));

const CDF_STATUS_OVERRIDE_OPTIONS = [
  { value: 'auto', label: 'Auto (compute from date/time)' },
  { value: 'completed', label: 'Force: Completed' },
  { value: 'ongoing', label: 'Force: Ongoing' },
  { value: 'cancelled', label: 'Force: Cancelled' },
  { value: 'postponed', label: 'Force: Postponed' },
];

const CDF_WARD_STATUS_OPTIONS = [
  { value: 'complete', label: 'Complete' },
  { value: 'mp-funded', label: 'Complete — MP-Funded Gap' },
  { value: 'pending', label: 'Pending' },
];

const BLANK_CDF_EVENT = () => ({
  id: `evt-${Date.now()}`,
  event: '',
  datetime_iso: '',
  duration_minutes: 120,
  type: '',
  is_whatsapp: false,
  icon: 'bell',
  status_override: 'auto',
});

const BLANK_CDF_WARD = () => ({ ward: '', place: '', status: 'pending', note: '' });
const BLANK_CDF_STAGE = () => ({ icon: 'bell', title: '', body: '' });

const BLANK_SLIDE = () => ({
  id: `slide-${Date.now()}`,
  image: '',
  image_id: 0,
  position: 'bg-center',
  badge: '',
  title: '',
  description: '',
  cta_label: '',
  cta_url: '',
});

// Toast notification component
function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border animate-molokele-slide-in-right backdrop-blur-md transition-all ${
              isSuccess
                ? 'bg-slate-900 border-[#044D29] text-white shadow-black/40'
                : isError
                ? 'bg-slate-900 border-[#C8102E] text-white shadow-black/40'
                : 'bg-slate-900 border-slate-700 text-white shadow-black/40'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {isSuccess ? (
                <CheckCircle2 className="h-5 w-5 text-[#3FBF72]" />
              ) : isError ? (
                <AlertCircle className="h-5 w-5 text-[#C8102E]" />
              ) : (
                <Clock className="h-5 w-5 text-[#DCA11D]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-white">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-xs mt-0.5 text-slate-300 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// Aspect ratio evaluation for hero slides
function getSlideAspectWarning(slide) {
  if (!slide.image) return null;
  const w = slide.img_width;
  const h = slide.img_height;
  if (!w || !h) return null;

  const ratio = w / h;

  if (ratio < 1.35) {
    return {
      type: 'danger',
      badge: `${w}×${h}px • ${ratio.toFixed(2)}:1`,
      title: 'Suboptimal Aspect Ratio (Portrait/Square)',
      message: `Portrait or square photos crop heavily on desktop hero banners. For best results, use a 16:7 (1920×840px) or 16:9 (1920×1080px) landscape photo with the subject on the right.`,
    };
  }

  if (w < 1400) {
    return {
      type: 'warning',
      badge: `${w}×${h}px • Low Res`,
      title: 'Low Resolution Warning',
      message: `Image width (${w}px) is low resolution for full-screen desktop headers. Recommend at least 1920px width.`,
    };
  }

  if (ratio > 2.8) {
    return {
      type: 'warning',
      badge: `${w}×${h}px • ${ratio.toFixed(2)}:1`,
      title: 'Ultra-Wide Panorama Warning',
      message: `Image is ultra-wide. Vertical details may crop on taller mobile phone screens.`,
    };
  }

  return {
    type: 'success',
    badge: `${w}×${h}px • ${ratio.toFixed(2)}:1`,
    title: 'Optimal Hero Banner Ratio',
    message: `Perfect landscape dimensions (${ratio.toFixed(2)}:1). Image will render full-bleed and crisp across all displays.`,
  };
}

const REPEATER_INPUT_CLASS =
  'w-full border border-slate-300 bg-white p-2.5 rounded-lg focus:border-[#044D29] focus:ring-2 focus:ring-[#044D29]/15 outline-none text-sm text-slate-900 transition-all shadow-sm';

function RepeaterField({ field, value, onChange }) {
  if (field.type === 'textarea') {
    return (
      <textarea
        rows={field.rows || 2}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={`${REPEATER_INPUT_CLASS} resize-y`}
      />
    );
  }
  if (field.type === 'select') {
    return (
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={REPEATER_INPUT_CLASS}
      >
        {field.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 text-[#044D29] focus:ring-[#044D29] border-slate-300 rounded"
        />
        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          {field.checkboxLabel || 'Enabled'}
        </span>
      </label>
    );
  }
  if (field.type === 'number') {
    return (
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={REPEATER_INPUT_CLASS}
      />
    );
  }
  if (field.type === 'datetime-local') {
    return (
      <input
        type="datetime-local"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={REPEATER_INPUT_CLASS}
      />
    );
  }
  return (
    <input
      type="text"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      className={REPEATER_INPUT_CLASS}
    />
  );
}

function SchemaForm({ item, onChange, fields }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {fields.map((field) => (
        <div key={field.key} className={`space-y-1.5 ${field.wide ? 'sm:col-span-2' : ''}`}>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
            {field.label}
          </label>
          <RepeaterField
            field={field}
            value={item[field.key]}
            onChange={(val) => onChange({ ...item, [field.key]: val })}
          />
          {field.help && <p className="text-[11px] text-slate-500 mt-1">{field.help}</p>}
        </div>
      ))}
    </div>
  );
}

function RepeaterList({
  items,
  onChange,
  fields,
  blankItem,
  getTitle,
  getSubtitle,
  addLabel = 'Add Item',
  emptyLabel = 'No items yet.',
}) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const addItem = () => {
    onChange([...items, blankItem()]);
    setExpandedIndex(items.length);
  };
  const removeItem = (index) => {
    if (!confirm('Remove this item?')) return;
    onChange(items.filter((_, i) => i !== index));
    setExpandedIndex((cur) => (cur === index ? null : cur));
  };
  const moveItem = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    setExpandedIndex((cur) => (cur === index ? target : cur === target ? index : cur));
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
        <p className="text-slate-500 text-sm font-medium">{emptyLabel}</p>
        <button
          onClick={addItem}
          className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#C8102E] hover:text-[#A00C24] transition-colors"
        >
          <Plus className="h-4 w-4" />
          {addLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isExpanded = expandedIndex === index;
        return (
          <div
            key={index}
            className={`border rounded-xl transition-all duration-200 overflow-hidden ${
              isExpanded
                ? 'border-[#044D29] shadow-md bg-white'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3 p-3.5 bg-slate-50 border-b border-transparent">
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-200 transition-all"
                  aria-label="Move item up"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => moveItem(index, 1)}
                  disabled={index === items.length - 1}
                  className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-200 transition-all"
                  aria-label="Move item down"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-sans font-bold text-sm text-slate-900 truncate">
                  {getTitle(item) || <span className="text-slate-400 italic font-normal">Untitled Item</span>}
                </p>
                {getSubtitle && (
                  <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate mt-0.5">
                    {getSubtitle(item)}
                  </p>
                )}
              </div>

              <button
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex-shrink-0 ${
                  isExpanded
                    ? 'bg-[#044D29] text-white shadow-sm'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {isExpanded ? 'Done' : 'Edit'}
                <ChevronRight
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    isExpanded ? 'rotate-90 text-white' : ''
                  }`}
                />
              </button>

              <button
                onClick={() => removeItem(index)}
                className="p-2 text-slate-400 hover:text-[#C8102E] hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {isExpanded && (
              <div className="p-5 border-t border-slate-100 bg-white animate-molokele-fade-in">
                <SchemaForm
                  item={item}
                  fields={fields}
                  onChange={(next) => onChange(items.map((it, i) => (i === index ? next : it)))}
                />
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={addItem}
        className="inline-flex items-center gap-2 rounded-xl bg-slate-50 border-2 border-dashed border-slate-300 hover:border-[#044D29] hover:bg-white text-slate-700 hover:text-[#044D29] px-4 py-3.5 font-sans font-black text-xs tracking-widest uppercase transition-all w-full justify-center shadow-sm"
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>
    </div>
  );
}

// Helper to determine initial page from URL query
function parseCurrentPage() {
  const params = new URLSearchParams(window.location.search);
  const page = params.get('page') || window.molokeleToolsData?.initialPage || 'molokele-tools';

  if (page === 'molokele-tools-hero') return 'hero';
  if (page === 'molokele-tools-cdf') return 'cdf';
  if (page === 'molokele-tools-images') return 'images';
  if (page === 'molokele-tools-settings') return 'settings';
  return 'overview';
}

function App() {
  const [activePage, setActivePage] = useState(parseCurrentPage);
  const [toasts, setToasts] = useState([]);

  // Gallery settings
  const [settings, setSettings] = useState({
    columns: '3',
    shadow: 'shadow-md',
    border_radius: 'rounded-sm',
    autoplay: false,
    autoplay_speed: '3000',
    backdrop_blur: 'backdrop-blur-md',
    hero_display_mode: 'current',
  });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Gallery Media
  const [images, setImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [termId, setTermId] = useState(null);
  const [editingImageId, setEditingImageId] = useState(null);
  const [editFields, setEditFields] = useState({ title: '', alt: '' });
  const [isSavingMedia, setIsSavingMedia] = useState(false);
  const [imageSearch, setImageSearch] = useState('');

  // Hero Slider
  const [heroSlides, setHeroSlides] = useState([]);
  const [heroSlidesLoading, setHeroSlidesLoading] = useState(true);
  const [isSavingHero, setIsSavingHero] = useState(false);
  const [expandedSlideId, setExpandedSlideId] = useState(null);
  const [previewSlideIndex, setPreviewSlideIndex] = useState(0);

  // CDF Tracker
  const [cdfSubTab, setCdfSubTab] = useState('campaign');
  const [cdfCampaign, setCdfCampaign] = useState({
    announcement_badge: '',
    campaign_badge: '',
    title: '',
    description: '',
    deadline_label: '',
    deadline_datetime_iso: '',
    deadline_note: '',
  });
  const [cdfCampaignLoading, setCdfCampaignLoading] = useState(true);
  const [isSavingCdfCampaign, setIsSavingCdfCampaign] = useState(false);

  const [cdfSchedule, setCdfSchedule] = useState([]);
  const [cdfScheduleLoading, setCdfScheduleLoading] = useState(true);
  const [isSavingCdfSchedule, setIsSavingCdfSchedule] = useState(false);

  const [cdfWards, setCdfWards] = useState([]);
  const [cdfWardsLoading, setCdfWardsLoading] = useState(true);
  const [isSavingCdfWards, setIsSavingCdfWards] = useState(false);

  const [cdfStages, setCdfStages] = useState([]);
  const [cdfStagesLoading, setCdfStagesLoading] = useState(true);
  const [isSavingCdfStages, setIsSavingCdfStages] = useState(false);

  // Toast dispatch
  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, ...toast }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // URL Sync
  const navigateTo = (page, subtab = null) => {
    setActivePage(page);
    if (subtab) setCdfSubTab(subtab);

    const slugMap = {
      overview: 'molokele-tools',
      hero: 'molokele-tools-hero',
      cdf: 'molokele-tools-cdf',
      images: 'molokele-tools-images',
      settings: 'molokele-tools-settings',
    };

    const targetSlug = slugMap[page] || 'molokele-tools';
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('page', targetSlug);
    if (page === 'cdf' && subtab) {
      newUrl.searchParams.set('tab', subtab);
    } else {
      newUrl.searchParams.delete('tab');
    }
    window.history.pushState({}, '', newUrl.toString());
  };

  // Listen to popstate
  useEffect(() => {
    const handlePopState = () => {
      setActivePage(parseCurrentPage());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch initial data
  useEffect(() => {
    const nonceHeaders = { headers: { 'X-WP-Nonce': window.molokeleToolsData?.nonce } };

    // 1. CDF Data
    fetch('/wp-json/molokele/v1/cdf-campaign', nonceHeaders)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.code) setCdfCampaign(data);
        setCdfCampaignLoading(false);
      })
      .catch(() => setCdfCampaignLoading(false));

    fetch('/wp-json/molokele/v1/cdf-schedule', nonceHeaders)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCdfSchedule(data);
        setCdfScheduleLoading(false);
      })
      .catch(() => setCdfScheduleLoading(false));

    fetch('/wp-json/molokele/v1/cdf-wards', nonceHeaders)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCdfWards(data);
        setCdfWardsLoading(false);
      })
      .catch(() => setCdfWardsLoading(false));

    fetch('/wp-json/molokele/v1/cdf-stages', nonceHeaders)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCdfStages(data);
        setCdfStagesLoading(false);
      })
      .catch(() => setCdfStagesLoading(false));

    // 2. Settings
    fetch('/wp-json/molokele/v1/settings', nonceHeaders)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.code) setSettings(data);
        setSettingsLoading(false);
      })
      .catch(() => setSettingsLoading(false));

    // 3. Hero Slides
    fetch('/wp-json/molokele/v1/hero-slides', nonceHeaders)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setHeroSlides(data);
        setHeroSlidesLoading(false);
      })
      .catch(() => setHeroSlidesLoading(false));

    // 4. Photo Gallery Media
    fetch('/wp-json/wp/v2/site_gallery?slug=photo-gallery')
      .then((res) => res.json())
      .then((terms) => {
        if (Array.isArray(terms) && terms.length > 0) {
          const tId = terms[0].id;
          setTermId(tId);
          fetchMediaForTerm(tId);
        } else {
          setImagesLoading(false);
        }
      })
      .catch(() => setImagesLoading(false));
  }, []);

  const fetchMediaForTerm = (tId) => {
    setImagesLoading(true);
    fetch(`/wp-json/wp/v2/media?site_gallery=${tId}&per_page=100`)
      .then((res) => res.json())
      .then((mediaItems) => {
        if (Array.isArray(mediaItems)) {
          setImages(
            mediaItems.map((item) => ({
              id: item.id,
              url: item.source_url,
              title: item.title?.rendered || '',
              alt: item.alt_text || '',
              link: item.link || '',
            }))
          );
        }
        setImagesLoading(false);
      })
      .catch(() => setImagesLoading(false));
  };

  // CDF Saves
  const saveCdfResource = (route, payload, setSaving, onSuccess, successTitle) => {
    setSaving(true);
    fetch(`/wp-json/molokele/v1/${route}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.molokeleToolsData?.nonce,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        setSaving(false);
        onSuccess(data);
        addToast({
          type: 'success',
          title: successTitle,
          message: 'Changes saved and published to the live site.',
        });
      })
      .catch(() => {
        setSaving(false);
        addToast({
          type: 'error',
          title: 'Save Failed',
          message: 'Unable to communicate with the WordPress REST endpoint.',
        });
      });
  };

  const handleSaveCdfCampaign = () =>
    saveCdfResource(
      'cdf-campaign',
      cdfCampaign,
      setIsSavingCdfCampaign,
      (data) => data.campaign && setCdfCampaign(data.campaign),
      'Campaign & Deadline Saved'
    );

  const handleSaveCdfSchedule = () =>
    saveCdfResource(
      'cdf-schedule',
      cdfSchedule,
      setIsSavingCdfSchedule,
      (data) => Array.isArray(data.schedule) && setCdfSchedule(data.schedule),
      'Consultation Schedule Saved'
    );

  const handleSaveCdfWards = () =>
    saveCdfResource(
      'cdf-wards',
      cdfWards,
      setIsSavingCdfWards,
      (data) => Array.isArray(data.wards) && setCdfWards(data.wards),
      'Ward Status Board Saved'
    );

  const handleSaveCdfStages = () =>
    saveCdfResource(
      'cdf-stages',
      cdfStages,
      setIsSavingCdfStages,
      (data) => Array.isArray(data.stages) && setCdfStages(data.stages),
      'Project Cycle Stages Saved'
    );

  // Settings Save
  const handleSaveSettings = () => {
    setIsSavingSettings(true);
    fetch('/wp-json/molokele/v1/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.molokeleToolsData?.nonce,
      },
      body: JSON.stringify(settings),
    })
      .then((res) => res.json())
      .then(() => {
        setIsSavingSettings(false);
        addToast({
          type: 'success',
          title: 'Display Settings Saved',
          message: 'Frontend gallery and lightbox configuration updated.',
        });
      })
      .catch(() => {
        setIsSavingSettings(false);
        addToast({
          type: 'error',
          title: 'Save Failed',
          message: 'Could not update gallery display settings.',
        });
      });
  };

  // Hero Slider Handlers
  const updateSlide = (id, patch) => {
    setHeroSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const addSlide = () => {
    const slide = BLANK_SLIDE();
    setHeroSlides((prev) => [...prev, slide]);
    setExpandedSlideId(slide.id);
  };

  const removeSlide = (id) => {
    if (!confirm('Remove this slide from the homepage hero?')) return;
    setHeroSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const moveSlide = (index, direction) => {
    setHeroSlides((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const pickSlideImage = (id) => {
    if (!window.wp?.media) return;
    const frame = window.wp.media({
      title: 'Select Hero Slide Image',
      button: { text: 'Use This Image' },
      multiple: false,
    });

    frame.on('select', () => {
      const selection = frame.state().get('selection').first().toJSON();
      const w = selection.width || 0;
      const h = selection.height || 0;
      const ratio = h > 0 ? parseFloat((w / h).toFixed(2)) : null;

      updateSlide(id, {
        image: selection.url,
        image_id: selection.id,
        img_width: w,
        img_height: h,
        img_ratio: ratio,
      });
    });

    frame.open();
  };

  const handleSaveHeroSlides = () => {
    setIsSavingHero(true);
    fetch('/wp-json/molokele/v1/hero-slides', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.molokeleToolsData?.nonce,
      },
      body: JSON.stringify(heroSlides),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsSavingHero(false);
        if (Array.isArray(data.slides)) {
          setHeroSlides(data.slides);
        }
        addToast({
          type: 'success',
          title: 'Hero Slider Saved',
          message: 'Homepage hero slides have been updated.',
        });
      })
      .catch(() => {
        setIsSavingHero(false);
        addToast({
          type: 'error',
          title: 'Save Failed',
          message: 'Could not save homepage hero slides.',
        });
      });
  };

  // Media Gallery Handlers
  const handleAddMedia = () => {
    if (!termId) {
      addToast({
        type: 'error',
        title: 'Missing Taxonomy',
        message: '"photo-gallery" taxonomy term was not found in WordPress.',
      });
      return;
    }

    if (!window.wp?.media) return;

    const frame = window.wp.media({
      title: 'Select Images to Add to Photo Gallery',
      button: { text: 'Add to Gallery' },
      multiple: true,
    });

    frame.on('select', () => {
      const selections = frame.state().get('selection').toJSON();
      const mediaIds = selections.map((s) => s.id);

      const promises = mediaIds.map((id) =>
        fetch(`/wp-json/wp/v2/media/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': window.molokeleToolsData?.nonce,
          },
          body: JSON.stringify({ site_gallery: [termId] }),
        })
      );

      Promise.all(promises)
        .then(() => {
          fetchMediaForTerm(termId);
          addToast({
            type: 'success',
            title: 'Media Added',
            message: `${mediaIds.length} image(s) linked to photo-gallery.`,
          });
        })
        .catch(() => {
          addToast({
            type: 'error',
            title: 'Error Linking Media',
            message: 'Failed to associate some selected images.',
          });
        });
    });

    frame.open();
  };

  const handleRemoveImage = (mediaId) => {
    if (!confirm('Remove this image from the constituency gallery?')) return;

    fetch(`/wp-json/wp/v2/media/${mediaId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.molokeleToolsData?.nonce,
      },
      body: JSON.stringify({ site_gallery: [] }),
    })
      .then(() => {
        setImages((prev) => prev.filter((img) => img.id !== mediaId));
        addToast({
          type: 'info',
          title: 'Image Unlinked',
          message: 'Image removed from constituency gallery.',
        });
      })
      .catch(() => {
        addToast({
          type: 'error',
          title: 'Action Failed',
          message: 'Failed to remove image association.',
        });
      });
  };

  const startEdit = (img) => {
    setEditingImageId(img.id);
    setEditFields({ title: img.title, alt: img.alt });
  };

  const saveMediaDetails = (mediaId) => {
    setIsSavingMedia(true);
    fetch(`/wp-json/wp/v2/media/${mediaId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.molokeleToolsData?.nonce,
      },
      body: JSON.stringify({
        title: editFields.title,
        alt_text: editFields.alt,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setImages((prev) =>
          prev.map((img) =>
            img.id === mediaId
              ? { ...img, title: editFields.title, alt: editFields.alt }
              : img
          )
        );
        setEditingImageId(null);
        setIsSavingMedia(false);
        addToast({
          type: 'success',
          title: 'Details Updated',
          message: 'Image title and alt tags updated.',
        });
      })
      .catch(() => {
        setIsSavingMedia(false);
        addToast({
          type: 'error',
          title: 'Update Failed',
          message: 'Could not save image details.',
        });
      });
  };

  // Filtered Images
  const filteredImages = useMemo(() => {
    if (!imageSearch.trim()) return images;
    const q = imageSearch.toLowerCase();
    return images.filter(
      (img) => img.title.toLowerCase().includes(q) || img.alt.toLowerCase().includes(q)
    );
  }, [images, imageSearch]);

  // Ward statistics
  const wardStats = useMemo(() => {
    const complete = cdfWards.filter((w) => w.status === 'complete').length;
    const mpFunded = cdfWards.filter((w) => w.status === 'mp-funded').length;
    const pending = cdfWards.filter((w) => w.status === 'pending').length;
    return { complete, mpFunded, pending, total: cdfWards.length };
  }, [cdfWards]);

  // Active slide for preview
  const activeHeroSlide = heroSlides[previewSlideIndex] || heroSlides[0];

  return (
    <div className="molokele-admin-scope bg-[#FAF9F5] text-slate-800 font-sans min-h-[90vh] rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Top Main Navigation Header with Zimbabwe Flag Stripe */}
      <div className="molokele-flag-stripe"></div>
      <header className="bg-[#0D0D0D] text-white px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-[#044D29] border border-[#3FBF72]/40 flex items-center justify-center text-white shadow-md flex-shrink-0">
            <Landmark className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3FBF72] bg-[#044D29]/60 px-2 py-0.5 rounded border border-[#3FBF72]/30">
                Hon. Daniel Molokele
              </span>
              <span className="text-[10px] font-bold text-slate-300">Whange Central MP</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-white uppercase mt-0.5">
              Molokele Site Tools
            </h1>
          </div>
        </div>

        {/* Global Action Links */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700"
          >
            <Eye className="h-3.5 w-3.5 text-slate-300" />
            <span>Live Homepage</span>
            <ArrowUpRight className="h-3 w-3 text-slate-400" />
          </a>
          <a
            href="/cdf-tracker/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#044D29] hover:bg-[#03381e] text-white text-xs font-bold transition-all border border-[#3FBF72]/40 shadow-sm"
          >
            <Calendar className="h-3.5 w-3.5 text-[#3FBF72]" />
            <span>Live CDF Tracker</span>
            <ArrowUpRight className="h-3 w-3 text-[#3FBF72]" />
          </a>
        </div>
      </header>

      {/* Main Layout Body: Sidebar + Dynamic Panel */}
      <div className="flex-1 flex flex-col lg:flex-row min-w-0">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 bg-[#141414] lg:border-r border-slate-800 p-4 flex flex-col justify-between flex-shrink-0">
          <div className="space-y-1">
            <p className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Navigation Entry Points
            </p>

            {/* Overview */}
            <button
              onClick={() => navigateTo('overview')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activePage === 'overview'
                  ? 'bg-[#044D29] text-white shadow-md border border-[#3FBF72]/30'
                  : 'text-slate-200 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className={`h-4 w-4 ${activePage === 'overview' ? 'text-white' : 'text-[#3FBF72]'}`} />
                <span className="font-extrabold text-white">Overview &amp; Hub</span>
              </div>
              <ChevronRight
                className={`h-3.5 w-3.5 transition-transform ${
                  activePage === 'overview' ? 'text-white translate-x-0.5' : 'text-slate-400'
                }`}
              />
            </button>

            {/* Hero Slider */}
            <button
              onClick={() => navigateTo('hero')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activePage === 'hero'
                  ? 'bg-[#044D29] text-white shadow-md border border-[#3FBF72]/30'
                  : 'text-slate-200 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className={`h-4 w-4 ${activePage === 'hero' ? 'text-white' : 'text-[#3FBF72]'}`} />
                <span className="font-extrabold text-white">Hero Slider</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-slate-200 border border-slate-700">
                {heroSlides.length}
              </span>
            </button>

            {/* CDF Tracker */}
            <button
              onClick={() => navigateTo('cdf', 'campaign')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activePage === 'cdf'
                  ? 'bg-[#044D29] text-white shadow-md border border-[#3FBF72]/30'
                  : 'text-slate-200 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className={`h-4 w-4 ${activePage === 'cdf' ? 'text-white' : 'text-[#3FBF72]'}`} />
                <span className="font-extrabold text-white">CDF Tracker</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-slate-200 border border-slate-700">
                {cdfSchedule.length} evts
              </span>
            </button>

            {/* Photo Gallery */}
            <button
              onClick={() => navigateTo('images')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activePage === 'images'
                  ? 'bg-[#044D29] text-white shadow-md border border-[#3FBF72]/30'
                  : 'text-slate-200 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className={`h-4 w-4 ${activePage === 'images' ? 'text-white' : 'text-[#3FBF72]'}`} />
                <span className="font-extrabold text-white">Photo Gallery</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-slate-200 border border-slate-700">
                {images.length}
              </span>
            </button>

            {/* Settings */}
            <button
              onClick={() => navigateTo('settings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activePage === 'settings'
                  ? 'bg-[#044D29] text-white shadow-md border border-[#3FBF72]/30'
                  : 'text-slate-200 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sliders className={`h-4 w-4 ${activePage === 'settings' ? 'text-white' : 'text-[#3FBF72]'}`} />
                <span className="font-extrabold text-white">Display Settings</span>
              </div>
              <ChevronRight
                className={`h-3.5 w-3.5 transition-transform ${
                  activePage === 'settings' ? 'text-white translate-x-0.5' : 'text-slate-400'
                }`}
              />
            </button>
          </div>

          {/* Sidebar Footer Info */}
          <div className="mt-8 pt-4 border-t border-slate-800 space-y-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-[#3FBF72]">
                <span className="h-2 w-2 rounded-full bg-[#3FBF72]"></span>
                <span>REST API Active</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 font-mono">
                molokele/v1 endpoints connected
              </p>
            </div>
          </div>
        </aside>

        {/* Dynamic Content Panel */}
        <main className="flex-1 p-6 md:p-8 min-w-0 animate-molokele-fade-in overflow-y-auto">
          
          {/* ======================================================== */}
          {/* 1. OVERVIEW / DASHBOARD VIEW                             */}
          {/* ======================================================== */}
          {activePage === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              
              {/* Header Civic Banner */}
              <div className="rounded-2xl bg-[#044D29] p-7 text-white shadow-md border-t-4 border-t-[#DCA11D] border border-[#03381e]">
                <div className="max-w-3xl space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-widest bg-white/15 text-white border border-white/20">
                      <Landmark className="h-3.5 w-3.5 text-[#DCA11D]" />
                      Constituency Admin Hub
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase">
                    Molokele Site Management Console
                  </h2>
                  <p className="text-white/90 text-sm leading-relaxed font-normal">
                    Manage homepage hero slideshows, 2025 CDF Project proposals and consultation schedule,
                    ward borehole statuses, photo galleries, and interactive display settings.
                  </p>
                </div>
              </div>

              {/* Stats & Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* Hero Slides Metric */}
                <div
                  onClick={() => navigateTo('hero')}
                  className="p-5 rounded-2xl bg-white border border-slate-200 border-t-4 border-t-[#044D29] shadow-sm molokele-card-interactive cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Hero Slides
                    </span>
                    <div className="p-2 rounded-xl bg-emerald-50 text-[#044D29] group-hover:scale-110 transition-transform">
                      <Layers className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900">{heroSlides.length}</span>
                    <span className="text-xs text-slate-600 font-semibold">Active slides</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#044D29] group-hover:translate-x-1 transition-transform">
                    <span>Manage Slideshow</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* CDF Consultation Schedule Metric */}
                <div
                  onClick={() => navigateTo('cdf', 'schedule')}
                  className="p-5 rounded-2xl bg-white border border-slate-200 border-t-4 border-t-[#DCA11D] shadow-sm molokele-card-interactive cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      CDF Schedule
                    </span>
                    <div className="p-2 rounded-xl bg-amber-50 text-[#DCA11D] group-hover:scale-110 transition-transform">
                      <Calendar className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900">{cdfSchedule.length}</span>
                    <span className="text-xs text-slate-600 font-semibold">Townhall &amp; WhatsApp</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#b88514] group-hover:translate-x-1 transition-transform">
                    <span>View Schedule Board</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Ward Borehole Status Metric */}
                <div
                  onClick={() => navigateTo('cdf', 'wards')}
                  className="p-5 rounded-2xl bg-white border border-slate-200 border-t-4 border-t-[#C8102E] shadow-sm molokele-card-interactive cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Ward Boreholes
                    </span>
                    <div className="p-2 rounded-xl bg-rose-50 text-[#C8102E] group-hover:scale-110 transition-transform">
                      <MapPin className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900">{wardStats.complete + wardStats.mpFunded}</span>
                    <span className="text-xs text-slate-600 font-semibold">/ {wardStats.total} Complete</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#C8102E] group-hover:translate-x-1 transition-transform">
                    <span>Audit Ward Board</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Gallery Images Metric */}
                <div
                  onClick={() => navigateTo('images')}
                  className="p-5 rounded-2xl bg-white border border-slate-200 border-t-4 border-t-slate-800 shadow-sm molokele-card-interactive cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Photo Gallery
                    </span>
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-800 group-hover:scale-110 transition-transform">
                      <ImageIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900">{images.length}</span>
                    <span className="text-xs text-slate-600 font-semibold">Photos attached</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs font-bold text-slate-800 group-hover:translate-x-1 transition-transform">
                    <span>Upload &amp; Edit</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

              </div>

              {/* Quick Action Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Active Campaign Box */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#044D29]" />
                      <h3 className="font-sans font-bold text-sm text-slate-900 uppercase tracking-wide">
                        Active CDF Campaign
                      </h3>
                    </div>
                    <button
                      onClick={() => navigateTo('cdf', 'campaign')}
                      className="text-xs font-black uppercase text-[#C8102E] hover:text-[#A00C24] transition-colors"
                    >
                      Edit Campaign →
                    </button>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-[#044D29] border border-emerald-200">
                      {cdfCampaign.campaign_badge || '2025 Campaign'}
                    </span>
                    <h4 className="font-bold text-base text-slate-900">
                      {cdfCampaign.title || 'CDF 2025 Project Proposal Campaign'}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {cdfCampaign.description}
                    </p>
                    <div className="pt-2 flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span>Deadline: {cdfCampaign.deadline_datetime_iso || 'August 31'}</span>
                    </div>
                  </div>
                </div>

                {/* Hero Slides Preview Box */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-[#044D29]" />
                      <h3 className="font-sans font-bold text-sm text-slate-900 uppercase tracking-wide">
                        Featured Hero Slide
                      </h3>
                    </div>
                    <button
                      onClick={() => navigateTo('hero')}
                      className="text-xs font-black uppercase text-[#C8102E] hover:text-[#A00C24] transition-colors"
                    >
                      Configure Hero →
                    </button>
                  </div>
                  {activeHeroSlide ? (
                    <div className="relative rounded-xl overflow-hidden aspect-[16/7] bg-[#0D0D0D] border border-slate-300 flex items-end p-4 text-white">
                      {activeHeroSlide.image && (
                        <img
                          src={activeHeroSlide.image}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover opacity-70"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      <div className="relative z-10 space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#3FBF72] bg-black/80 px-2 py-0.5 rounded border border-[#3FBF72]/40">
                          {activeHeroSlide.badge || 'Slide 1'}
                        </span>
                        <h4 className="font-bold text-sm text-white line-clamp-1">{activeHeroSlide.title}</h4>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No slides configured yet.</p>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* 2. HERO SLIDER VIEW                                      */}
          {/* ======================================================== */}
          {activePage === 'hero' && (
            <div className="space-y-6 max-w-5xl">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-[#044D29]" />
                    <h2 className="text-xl font-extrabold uppercase text-slate-900 tracking-wide">
                      Homepage Hero Slideshow
                    </h2>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">
                    Manage full-bleed slides, headline copy, buttons, and focal points.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={addSlide}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-black text-white px-4 py-2.5 font-sans font-black text-xs tracking-widest uppercase shadow-md transition-all flex-shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    Add Slide
                  </button>
                  <button
                    onClick={handleSaveHeroSlides}
                    disabled={isSavingHero}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#C8102E] hover:bg-[#A00C24] px-5 py-2.5 font-sans font-black text-xs tracking-widest uppercase text-white shadow-md transition-all disabled:opacity-50 flex-shrink-0"
                  >
                    {isSavingHero ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Slides
                  </button>
                </div>
              </div>

              {/* Homepage Hero Display Mode */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <LayoutDashboard className="h-5 w-5 text-[#044D29]" />
                      <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                        Homepage Hero Style
                      </h3>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">
                      Choose which hero slideshow layout renders on the homepage. Both read the slides above.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#C8102E] hover:bg-[#A00C24] px-5 py-2.5 font-sans font-black text-xs tracking-widest uppercase text-white shadow-md transition-all disabled:opacity-50 flex-shrink-0"
                  >
                    {isSavingSettings ? 'Saving...' : 'Save Style'}
                    <Save className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      settings.hero_display_mode === 'current' || (!settings.hero_display_mode || (settings.hero_display_mode !== 'alternative' && settings.hero_display_mode !== 'minimal'))
                        ? 'border-[#044D29] bg-[#044D29]/5'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="hero_display_mode"
                      className="mt-1 h-4 w-4 text-[#044D29] focus:ring-[#044D29]"
                      checked={settings.hero_display_mode === 'current' || (!settings.hero_display_mode || (settings.hero_display_mode !== 'alternative' && settings.hero_display_mode !== 'minimal'))}
                      onChange={() => setSettings({ ...settings, hero_display_mode: 'current' })}
                    />
                    <span>
                      <span className="block text-xs font-black uppercase tracking-wider text-slate-900">Current</span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        The live homepage hero — full-bleed card overlay with gold progress-bar pills.
                      </span>
                    </span>
                  </label>
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      settings.hero_display_mode === 'alternative'
                        ? 'border-[#044D29] bg-[#044D29]/5'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="hero_display_mode"
                      className="mt-1 h-4 w-4 text-[#044D29] focus:ring-[#044D29]"
                      checked={settings.hero_display_mode === 'alternative'}
                      onChange={() => setSettings({ ...settings, hero_display_mode: 'alternative' })}
                    />
                    <span>
                      <span className="block text-xs font-black uppercase tracking-wider text-slate-900">Alternative</span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        Editorial gallery slideshow — glass placard, spec-sheet meta row, thumbnail rail.
                      </span>
                    </span>
                  </label>
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      settings.hero_display_mode === 'minimal'
                        ? 'border-[#044D29] bg-[#044D29]/5'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="hero_display_mode"
                      className="mt-1 h-4 w-4 text-[#044D29] focus:ring-[#044D29]"
                      checked={settings.hero_display_mode === 'minimal'}
                      onChange={() => setSettings({ ...settings, hero_display_mode: 'minimal' })}
                    />
                    <span>
                      <span className="block text-xs font-black uppercase tracking-wider text-slate-900">Minimalist</span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        Sleek low-profile bottom ribbon with collapsible/minimizable text for clear photo viewing.
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Live Preview Card */}
              {activeHeroSlide && (
                <div className="bg-[#0D0D0D] rounded-2xl overflow-hidden border border-slate-800 shadow-xl text-white">
                  <div className="px-5 py-3 bg-black border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#3FBF72]"></span>
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-200">
                        Interactive Live Preview Simulation
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {heroSlides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPreviewSlideIndex(idx)}
                          className={`h-2 rounded-full transition-all ${
                            previewSlideIndex === idx ? 'w-6 bg-[#3FBF72]' : 'w-2 bg-slate-700 hover:bg-slate-500'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="relative aspect-[16/7] md:aspect-[21/8] bg-black flex items-center px-8 md:px-14 overflow-hidden">
                    {activeHeroSlide.image ? (
                      <img
                        src={activeHeroSlide.image}
                        alt=""
                        className={`absolute inset-0 w-full h-full object-cover opacity-70 ${activeHeroSlide.position}`}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-r from-black via-slate-900 to-[#044D29]/60 opacity-80" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

                    <div className="relative z-10 max-w-xl space-y-2.5">
                      {activeHeroSlide.badge && (
                        <span className="inline-block text-[10px] font-black uppercase tracking-widest text-[#3FBF72] bg-black/80 px-2.5 py-1 rounded border border-[#3FBF72]/40 shadow">
                          {activeHeroSlide.badge}
                        </span>
                      )}
                      <h3 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight">
                        {activeHeroSlide.title || 'Untitled Slide'}
                      </h3>
                      {activeHeroSlide.description && (
                        <p className="text-slate-200 text-xs md:text-sm line-clamp-2 leading-relaxed">
                          {activeHeroSlide.description}
                        </p>
                      )}
                      {activeHeroSlide.cta_label && (
                        <div className="pt-2">
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C8102E] text-white text-xs font-black uppercase tracking-wider shadow-md">
                            {activeHeroSlide.cta_label}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Slides Reorderable Editor */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-slate-900">
                  Slide Sequence ({heroSlides.length})
                </h3>

                {heroSlidesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                  </div>
                ) : heroSlides.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-xl">
                    <p className="text-slate-500 text-sm">No hero slides configured yet.</p>
                    <button
                      onClick={addSlide}
                      className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#C8102E] hover:text-[#A00C24] transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add the first slide
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {heroSlides.map((slide, index) => {
                      const isExpanded = expandedSlideId === slide.id;
                      return (
                        <div
                          key={slide.id}
                          className={`border rounded-xl transition-all ${
                            isExpanded
                              ? 'border-[#044D29] shadow-md bg-white'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 p-3.5 bg-slate-50">
                            <div className="flex flex-col gap-0.5 flex-shrink-0">
                              <button
                                onClick={() => moveSlide(index, -1)}
                                disabled={index === 0}
                                className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-200 transition-all"
                                aria-label="Move slide up"
                              >
                                <ChevronUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => moveSlide(index, 1)}
                                disabled={index === heroSlides.length - 1}
                                className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-200 transition-all"
                                aria-label="Move slide down"
                              >
                                <ChevronDown className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="h-12 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200 border border-slate-300">
                              {slide.image ? (
                                <img src={slide.image} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-slate-400">
                                  <ImagePlus className="h-4 w-4" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="font-sans font-bold text-sm text-slate-900 truncate">
                                {slide.title || <span className="text-slate-400 italic">Untitled Slide</span>}
                              </p>
                              <p className="font-sans text-[10px] font-black uppercase tracking-wider text-slate-500 truncate mt-0.5">
                                {slide.badge || 'No badge set'}
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                setPreviewSlideIndex(index);
                                setExpandedSlideId(isExpanded ? null : slide.id);
                              }}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex-shrink-0 ${
                                isExpanded
                                  ? 'bg-[#044D29] text-white shadow-sm'
                                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {isExpanded ? 'Done' : 'Edit'}
                              <ChevronRight
                                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-90 text-white' : ''
                                }`}
                              />
                            </button>

                            <button
                              onClick={() => removeSlide(slide.id)}
                              className="p-2 text-slate-400 hover:text-[#C8102E] hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
                              aria-label="Remove slide"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Expanded Editor Form */}
                          {isExpanded && (
                            <div className="p-5 border-t border-slate-100 bg-white space-y-5 animate-molokele-fade-in">
                              
                              {/* Image Selection Bar */}
                              <div className="flex items-start gap-4">
                                <div className="h-24 w-36 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-300 shadow-inner">
                                  {slide.image ? (
                                    <img src={slide.image} alt="" className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center text-slate-400">
                                      <ImagePlus className="h-6 w-6" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col gap-2">
                                  <button
                                    onClick={() => pickSlideImage(slide.id)}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-black text-white px-3.5 py-2 text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
                                  >
                                    <ImagePlus className="h-3.5 w-3.5" />
                                    {slide.image ? 'Change Photo' : 'Select Photo'}
                                  </button>
                                  {slide.image && (
                                    <button
                                      onClick={() => updateSlide(slide.id, { image: '', image_id: 0 })}
                                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#C8102E] transition-colors px-1"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                      Clear photo
                                    </button>
                                  )}
                                  <p className="text-[10px] text-slate-500 max-w-xs leading-relaxed">
                                    Landscape 16:9 (1920×1080) or 16:7 (1920×840) works best.
                                  </p>
                                </div>
                              </div>

                              {/* Aspect Ratio Validation Banner */}
                              {(() => {
                                const warn = getSlideAspectWarning(slide);
                                if (!warn) return null;
                                const isDanger = warn.type === 'danger';
                                const isWarning = warn.type === 'warning';
                                const bgColor = isDanger
                                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                                  : isWarning
                                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                                  : 'bg-emerald-50 border-emerald-200 text-emerald-900';

                                return (
                                  <div className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1 ${bgColor}`}>
                                    <div className="flex items-center justify-between font-black uppercase text-[11px] tracking-wider">
                                      <span>{warn.title}</span>
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-current font-bold">
                                        {warn.badge}
                                      </span>
                                    </div>
                                    <p className="font-sans text-[11px] opacity-90">{warn.message}</p>
                                  </div>
                                );
                              })()}

                              {/* Slide Fields */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                                    Badge
                                  </label>
                                  <input
                                    type="text"
                                    value={slide.badge}
                                    onChange={(e) => updateSlide(slide.id, { badge: e.target.value })}
                                    placeholder="e.g. Legislative Leadership"
                                    className={REPEATER_INPUT_CLASS}
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                                    Image Focus Point
                                  </label>
                                  <select
                                    value={slide.position}
                                    onChange={(e) => updateSlide(slide.id, { position: e.target.value })}
                                    className={REPEATER_INPUT_CLASS}
                                  >
                                    <option value="bg-top">Top</option>
                                    <option value="bg-center">Center</option>
                                    <option value="bg-bottom">Bottom</option>
                                  </select>
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  value={slide.title}
                                  onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
                                  placeholder="e.g. Parliamentary Action"
                                  className={REPEATER_INPUT_CLASS}
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                                  Description
                                </label>
                                <textarea
                                  value={slide.description}
                                  onChange={(e) => updateSlide(slide.id, { description: e.target.value })}
                                  rows="2"
                                  placeholder="One or two sentences of supporting copy."
                                  className={`${REPEATER_INPUT_CLASS} resize-y`}
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                                    Button Label
                                  </label>
                                  <input
                                    type="text"
                                    value={slide.cta_label}
                                    onChange={(e) => updateSlide(slide.id, { cta_label: e.target.value })}
                                    placeholder="e.g. CDF Tracker"
                                    className={REPEATER_INPUT_CLASS}
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                                    Button Link URL
                                  </label>
                                  <input
                                    type="text"
                                    value={slide.cta_url}
                                    onChange={(e) => updateSlide(slide.id, { cta_url: e.target.value })}
                                    placeholder="e.g. /cdf-tracker/"
                                    className={REPEATER_INPUT_CLASS}
                                  />
                                </div>
                              </div>

                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <button
                    onClick={addSlide}
                    className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 hover:text-slate-900"
                  >
                    <Plus className="h-4 w-4" />
                    Add Slide
                  </button>
                  <button
                    onClick={handleSaveHeroSlides}
                    disabled={isSavingHero}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#C8102E] hover:bg-[#A00C24] px-6 py-2.5 font-sans font-black text-xs tracking-widest uppercase text-white shadow-md transition-all disabled:opacity-50"
                  >
                    {isSavingHero ? 'Saving...' : 'Save Hero Slider'}
                    <Save className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* 3. CDF TRACKER VIEW                                      */}
          {/* ======================================================== */}
          {activePage === 'cdf' && (
            <div className="space-y-6 max-w-5xl">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#044D29]" />
                    <h2 className="text-xl font-extrabold uppercase text-slate-900 tracking-wide">
                      CDF Tracker Management
                    </h2>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">
                    Manage campaign announcements, consultation meetings, ward borehole statuses, and project cycle stages.
                  </p>
                </div>
              </div>

              {/* Sub Navigation Switches */}
              <div className="flex gap-2 p-1.5 bg-slate-200/80 rounded-2xl flex-wrap">
                {[
                  { key: 'campaign', label: '1. Campaign & Deadline', icon: Bell },
                  { key: 'schedule', label: `2. Schedule (${cdfSchedule.length})`, icon: Calendar },
                  { key: 'wards', label: `3. Ward Board (${cdfWards.length})`, icon: MapPin },
                  { key: 'stages', label: `4. Project Stages (${cdfStages.length})`, icon: RefreshCw },
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = cdfSubTab === t.key;
                  return (
                    <button
                      key={t.key}
                      onClick={() => navigateTo('cdf', t.key)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                        isActive
                          ? 'bg-[#044D29] text-white shadow-md'
                          : 'bg-transparent text-slate-700 hover:bg-white hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#3FBF72]' : 'text-slate-500'}`} />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* SUBTAB 1: Campaign & Deadline */}
              {cdfSubTab === 'campaign' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 animate-molokele-fade-in">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="font-sans font-black text-base text-slate-900 uppercase">
                      Campaign Header &amp; Deadline
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configures the hero announcement and countdown deadline shown at the top of /cdf-tracker/.
                    </p>
                  </div>

                  {cdfCampaignLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                  ) : (
                    <>
                      <SchemaForm
                        item={cdfCampaign}
                        onChange={setCdfCampaign}
                        fields={[
                          {
                            key: 'announcement_badge',
                            label: 'Announcement Badge',
                            type: 'text',
                            placeholder: 'e.g. Parliament Announcement • August CDF Month',
                          },
                          {
                            key: 'campaign_badge',
                            label: 'Campaign Badge',
                            type: 'text',
                            placeholder: 'e.g. 2025 Campaign',
                          },
                          { key: 'title', label: 'Campaign Title', type: 'text', wide: true },
                          { key: 'description', label: 'Campaign Description', type: 'textarea', rows: 3, wide: true },
                          { key: 'deadline_label', label: 'Deadline Callout Label', type: 'text' },
                          {
                            key: 'deadline_datetime_iso',
                            label: 'Deadline Date & Time',
                            type: 'datetime-local',
                            help: 'Whange Central local time (CAT, UTC+2). Powers the live countdown clock.',
                          },
                          { key: 'deadline_note', label: 'Deadline Office Note', type: 'textarea', rows: 2, wide: true },
                        ]}
                      />

                      <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={handleSaveCdfCampaign}
                          disabled={isSavingCdfCampaign}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#C8102E] hover:bg-[#A00C24] px-6 py-3 font-sans font-black text-xs tracking-widest uppercase text-white shadow-md transition-all disabled:opacity-50"
                        >
                          {isSavingCdfCampaign ? 'Saving...' : 'Save Campaign Header'}
                          <Save className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* SUBTAB 2: Schedule */}
              {cdfSubTab === 'schedule' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 animate-molokele-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="font-sans font-black text-base text-slate-900 uppercase">
                        Consultation Schedule ({cdfSchedule.length})
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Townhall meetings and WhatsApp Live interactive consultation sessions.
                      </p>
                    </div>
                  </div>

                  {cdfScheduleLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                  ) : (
                    <>
                      <RepeaterList
                        items={cdfSchedule}
                        onChange={setCdfSchedule}
                        blankItem={BLANK_CDF_EVENT}
                        getTitle={(item) => item.event}
                        getSubtitle={(item) => [item.datetime_iso, item.type].filter(Boolean).join(' • ')}
                        addLabel="Add Consultation Event"
                        emptyLabel="No consultation events scheduled yet."
                        fields={[
                          {
                            key: 'event',
                            label: 'Event Title',
                            type: 'text',
                            wide: true,
                            placeholder: 'e.g. CDF Implementation Committee Meeting',
                          },
                          {
                            key: 'datetime_iso',
                            label: 'Date & Time',
                            type: 'datetime-local',
                            help: 'Whange Central local time (CAT, UTC+2). Drives calendar links & auto-status.',
                          },
                          { key: 'duration_minutes', label: 'Duration (minutes)', type: 'number' },
                          {
                            key: 'type',
                            label: 'Event Type',
                            type: 'text',
                            placeholder: 'e.g. Committee Meeting / WhatsApp Live',
                          },
                          {
                            key: 'is_whatsapp',
                            label: 'Session Format',
                            type: 'checkbox',
                            checkboxLabel: 'This is a WhatsApp Live event',
                          },
                          { key: 'icon', label: 'Event Icon', type: 'select', options: CDF_ICON_OPTIONS },
                          {
                            key: 'status_override',
                            label: 'Status Mode',
                            type: 'select',
                            options: CDF_STATUS_OVERRIDE_OPTIONS,
                            wide: true,
                            help: 'Leave on Auto to compute status from the current clock. Override if cancelled.',
                          },
                        ]}
                      />

                      <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={handleSaveCdfSchedule}
                          disabled={isSavingCdfSchedule}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#C8102E] hover:bg-[#A00C24] px-6 py-3 font-sans font-black text-xs tracking-widest uppercase text-white shadow-md transition-all disabled:opacity-50"
                        >
                          {isSavingCdfSchedule ? 'Saving...' : 'Save Consultation Schedule'}
                          <Save className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* SUBTAB 3: Wards */}
              {cdfSubTab === 'wards' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 animate-molokele-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="font-sans font-black text-base text-slate-900 uppercase">
                        Ward Status Board ({cdfWards.length})
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Track solar-powered boreholes and local community projects across all Whange Central wards.
                      </p>
                    </div>
                    {/* Status Pill Counts */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                        {wardStats.complete} Complete
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300">
                        {wardStats.mpFunded} MP-Funded
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-300">
                        {wardStats.pending} Pending
                      </span>
                    </div>
                  </div>

                  {cdfWardsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                  ) : (
                    <>
                      <RepeaterList
                        items={cdfWards}
                        onChange={setCdfWards}
                        blankItem={BLANK_CDF_WARD}
                        getTitle={(item) => `${item.ward || 'Ward'} • ${item.place || 'Location'}`}
                        getSubtitle={(item) => `Status: ${item.status || 'pending'}`}
                        addLabel="Add Ward"
                        emptyLabel="No wards tracked yet."
                        fields={[
                          { key: 'ward', label: 'Ward Name/Number', type: 'text', placeholder: 'e.g. Ward 1' },
                          { key: 'place', label: 'Place / Village / School', type: 'text', placeholder: 'e.g. Chibondo' },
                          { key: 'status', label: 'Current Status', type: 'select', options: CDF_WARD_STATUS_OPTIONS },
                          { key: 'note', label: 'Project Notes & Audit Summary', type: 'textarea', rows: 2, wide: true },
                        ]}
                      />

                      <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={handleSaveCdfWards}
                          disabled={isSavingCdfWards}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#C8102E] hover:bg-[#A00C24] px-6 py-3 font-sans font-black text-xs tracking-widest uppercase text-white shadow-md transition-all disabled:opacity-50"
                        >
                          {isSavingCdfWards ? 'Saving...' : 'Save Ward Status Board'}
                          <Save className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* SUBTAB 4: Stages */}
              {cdfSubTab === 'stages' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 animate-molokele-fade-in">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="font-sans font-black text-base text-slate-900 uppercase">
                      5-Stage Project Cycle Timeline ({cdfStages.length})
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Visual step-by-step roadmap explaining the annual CDF consultation &amp; delivery workflow.
                    </p>
                  </div>

                  {cdfStagesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    </div>
                  ) : (
                    <>
                      <RepeaterList
                        items={cdfStages}
                        onChange={setCdfStages}
                        blankItem={BLANK_CDF_STAGE}
                        getTitle={(item) => item.title}
                        getSubtitle={(item) => `Icon: ${item.icon}`}
                        addLabel="Add Project Stage"
                        emptyLabel="No project stages defined yet."
                        fields={[
                          { key: 'icon', label: 'Stage Icon', type: 'select', options: CDF_ICON_OPTIONS },
                          { key: 'title', label: 'Stage Title', type: 'text', wide: true },
                          { key: 'body', label: 'Description & Deliverables', type: 'textarea', rows: 2, wide: true },
                        ]}
                      />

                      <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={handleSaveCdfStages}
                          disabled={isSavingCdfStages}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#C8102E] hover:bg-[#A00C24] px-6 py-3 font-sans font-black text-xs tracking-widest uppercase text-white shadow-md transition-all disabled:opacity-50"
                        >
                          {isSavingCdfStages ? 'Saving...' : 'Save Project Cycle Stages'}
                          <Save className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* 4. PHOTO GALLERY VIEW                                    */}
          {/* ======================================================== */}
          {activePage === 'images' && (
            <div className="space-y-6 max-w-6xl">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-[#044D29]" />
                    <h2 className="text-xl font-extrabold uppercase text-slate-900 tracking-wide">
                      Photo Gallery Management
                    </h2>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">
                    Upload or link photos to the constituency photo gallery with custom titles &amp; alt attributes.
                  </p>
                </div>
                <div>
                  <button
                    onClick={handleAddMedia}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-black text-white px-5 py-3 font-sans font-black text-xs tracking-widest uppercase shadow-md transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    Add Images to Gallery
                  </button>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                <Search className="h-4 w-4 text-slate-400 ml-2" />
                <input
                  type="text"
                  value={imageSearch}
                  onChange={(e) => setImageSearch(e.target.value)}
                  placeholder="Filter gallery photos by title or alt text..."
                  className="w-full text-xs font-medium outline-none bg-transparent"
                />
                {imageSearch && (
                  <button
                    onClick={() => setImageSearch('')}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Image Grid */}
              {imagesLoading ? (
                <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-300 rounded-2xl bg-white">
                  <p className="text-slate-500 text-sm font-medium">
                    {imageSearch ? 'No images match your search filter.' : 'No images in the photo-gallery taxonomy yet.'}
                  </p>
                  <button
                    onClick={handleAddMedia}
                    className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#C8102E] hover:text-[#A00C24] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add images from Media Library
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredImages.map((img) => {
                    const isEditing = editingImageId === img.id;
                    return (
                      <div
                        key={img.id}
                        className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between bg-white molokele-card-interactive"
                      >
                        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden group">
                          <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                            <a
                              href={img.link}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-[10px] font-bold inline-flex items-center gap-1"
                              title="Attachment page"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View
                            </a>
                            <span className="text-[10px] font-mono text-white">ID #{img.id}</span>
                          </div>
                        </div>

                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          {isEditing ? (
                            <div className="space-y-2.5">
                              <div>
                                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  value={editFields.title}
                                  onChange={(e) => setEditFields({ ...editFields, title: e.target.value })}
                                  className="w-full border border-slate-300 px-3 py-1.5 rounded-lg text-xs outline-none focus:border-[#044D29]"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                                  Alt Text
                                </label>
                                <input
                                  type="text"
                                  value={editFields.alt}
                                  onChange={(e) => setEditFields({ ...editFields, alt: e.target.value })}
                                  className="w-full border border-slate-300 px-3 py-1.5 rounded-lg text-xs outline-none focus:border-[#044D29]"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <h4 className="font-sans font-bold text-xs text-slate-900 line-clamp-1">
                                {img.title || '(Untitled Image)'}
                              </h4>
                              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
                                  Alt description:
                                </span>
                                {img.alt || '(No alt text)'}
                              </p>
                            </div>
                          )}

                          <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-2">
                            {isEditing ? (
                              <div className="flex gap-2 w-full justify-end">
                                <button
                                  onClick={() => setEditingImageId(null)}
                                  className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-2 py-1"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => saveMediaDetails(img.id)}
                                  disabled={isSavingMedia}
                                  className="inline-flex items-center gap-1 bg-[#C8102E] text-white px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-[#A00C24] transition-colors"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  Save
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEdit(img)}
                                  className="inline-flex items-center gap-1 text-slate-700 hover:text-[#044D29] transition-colors text-xs font-black uppercase tracking-wider"
                                >
                                  <Edit2 className="h-3 w-3" />
                                  Edit Info
                                </button>
                                <button
                                  onClick={() => handleRemoveImage(img.id)}
                                  className="p-1 text-slate-400 hover:text-[#C8102E] transition-colors"
                                  title="Remove from gallery"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* 5. DISPLAY & LIGHTBOX SETTINGS VIEW                      */}
          {/* ======================================================== */}
          {activePage === 'settings' && (
            <div className="space-y-6 max-w-5xl">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <Sliders className="h-5 w-5 text-[#044D29]" />
                    <h2 className="text-xl font-extrabold uppercase text-slate-900 tracking-wide">
                      Display &amp; Lightbox Settings
                    </h2>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">
                    Customize frontend gallery column layout, card shadows, rounded corners, and modal autoplay.
                  </p>
                </div>
                <button
                  onClick={handleSaveSettings}
                  disabled={isSavingSettings}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#C8102E] hover:bg-[#A00C24] px-6 py-2.5 font-sans font-black text-xs tracking-widest uppercase text-white shadow-md transition-all disabled:opacity-50"
                >
                  {isSavingSettings ? 'Saving...' : 'Save Configurations'}
                  <Save className="h-4 w-4" />
                </button>
              </div>

              {/* Real-time Settings Mockup Canvas */}
              <div className="p-6 rounded-2xl bg-[#044D29] text-white shadow-md border border-[#03381e] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#3FBF72] flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    Live Visual Settings Preview
                  </span>
                  <span className="text-xs text-white/80 font-mono">
                    {settings.columns} Columns • {settings.border_radius} • {settings.shadow}
                  </span>
                </div>

                <div className={`grid gap-4 ${
                  settings.columns === '2'
                    ? 'grid-cols-2'
                    : settings.columns === '4'
                    ? 'grid-cols-4'
                    : 'grid-cols-3'
                }`}>
                  {[1, 2, 3, 4].slice(0, parseInt(settings.columns, 10)).map((item) => (
                    <div
                      key={item}
                      className={`bg-white text-slate-900 p-4 ${settings.shadow} ${
                        settings.border_radius === 'rounded-none'
                          ? 'rounded-none'
                          : settings.border_radius === 'rounded-sm'
                          ? 'rounded-sm'
                          : settings.border_radius === 'rounded-md'
                          ? 'rounded-md'
                          : 'rounded-2xl'
                      } border border-slate-200 transition-all`}
                    >
                      <div className="aspect-[4/3] bg-slate-200 rounded-sm mb-3 flex items-center justify-center text-slate-500 font-bold text-xs">
                        Image Demo {item}
                      </div>
                      <h5 className="font-bold text-xs text-slate-900 truncate">Sample Gallery Card</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5">Whange Central Event</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings Form Grid */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                {settingsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Columns */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                        Desktop Gallery Columns
                      </label>
                      <select
                        value={settings.columns}
                        onChange={(e) => setSettings({ ...settings, columns: e.target.value })}
                        className={REPEATER_INPUT_CLASS}
                      >
                        <option value="2">2 Columns (Wide)</option>
                        <option value="3">3 Columns (Standard)</option>
                        <option value="4">4 Columns (Compact)</option>
                      </select>
                      <p className="text-slate-500 text-[10px]">
                        Determines responsive grid partition for gallery images.
                      </p>
                    </div>

                    {/* Shadows */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                        Card Elevation &amp; Shadow
                      </label>
                      <select
                        value={settings.shadow}
                        onChange={(e) => setSettings({ ...settings, shadow: e.target.value })}
                        className={REPEATER_INPUT_CLASS}
                      >
                        <option value="shadow-none">No Shadow</option>
                        <option value="shadow-sm">Small Subtle Shadow</option>
                        <option value="shadow-md">Medium Shadow (Standard)</option>
                        <option value="shadow-lg">Large Premium Shadow</option>
                      </select>
                    </div>

                    {/* Corner Roundedness */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                        Card Corner Roundedness
                      </label>
                      <select
                        value={settings.border_radius}
                        onChange={(e) => setSettings({ ...settings, border_radius: e.target.value })}
                        className={REPEATER_INPUT_CLASS}
                      >
                        <option value="rounded-none">None (Sharp Edges)</option>
                        <option value="rounded-sm">Small Rounded (rounded-sm)</option>
                        <option value="rounded-md">Medium Rounded (rounded-md)</option>
                        <option value="rounded-xl">Large Rounded (rounded-xl)</option>
                      </select>
                    </div>

                    {/* Lightbox Backdrop Blur */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                        Slideshow Backdrop Blur
                      </label>
                      <select
                        value={settings.backdrop_blur}
                        onChange={(e) => setSettings({ ...settings, backdrop_blur: e.target.value })}
                        className={REPEATER_INPUT_CLASS}
                      >
                        <option value="backdrop-blur-none">No Blur (Solid Overlay)</option>
                        <option value="backdrop-blur-sm">Light Blur</option>
                        <option value="backdrop-blur-md">Medium Blur (Standard)</option>
                        <option value="backdrop-blur-lg">Strong Backdrop Blur</option>
                      </select>
                    </div>

                    {/* Autoplay Toggle */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                        Slideshow Modal Autoplay
                      </label>
                      <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={settings.autoplay}
                          onChange={(e) => setSettings({ ...settings, autoplay: e.target.checked })}
                          className="h-4 w-4 text-[#044D29] focus:ring-[#044D29] border-slate-300 rounded"
                        />
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Enable automatic photo transition
                        </span>
                      </label>
                    </div>

                    {/* Autoplay Speed */}
                    {settings.autoplay && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                          Autoplay Transition Speed (ms)
                        </label>
                        <input
                          type="number"
                          value={settings.autoplay_speed}
                          onChange={(e) => setSettings({ ...settings, autoplay_speed: e.target.value })}
                          className={REPEATER_INPUT_CLASS}
                          placeholder="e.g. 3000"
                        />
                      </div>
                    )}

                  </div>
                )}

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#C8102E] hover:bg-[#A00C24] px-6 py-3 font-sans font-black text-xs tracking-widest uppercase text-white shadow-md transition-all disabled:opacity-50"
                  >
                    {isSavingSettings ? 'Saving...' : 'Save Configurations'}
                    <Save className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}

const root = document.getElementById('molokele-tools-root');
if (root) {
  createRoot(root).render(<App />);
}
