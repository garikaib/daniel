import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Settings, Image, Save, Trash2, Plus, Check, Edit2, Loader2, ExternalLink,
  Layers, ChevronUp, ChevronDown, ChevronRight as ChevronRightIcon, ArrowRight, ImagePlus, X,
} from 'lucide-react';
import './index.css';

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
      title: '🔴 Suboptimal Aspect Ratio (Portrait/Square)',
      message: `Portrait or square photos crop heavily on desktop hero banners. For best results, use a 16:7 (1920×840px) or 16:9 (1920×1080px) landscape photo with the subject on the right.`,
    };
  }

  if (w < 1400) {
    return {
      type: 'warning',
      badge: `${w}×${h}px • Low Res`,
      title: '⚠️ Low Resolution Warning',
      message: `Image width (${w}px) is low resolution for full-screen desktop headers. Recommend at least 1920px width.`,
    };
  }

  if (ratio > 2.8) {
    return {
      type: 'warning',
      badge: `${w}×${h}px • ${ratio.toFixed(2)}:1`,
      title: '⚠️ Ultra-Wide Panorama Warning',
      message: `Image is ultra-wide. Vertical details may crop on taller mobile phone screens.`,
    };
  }

  return {
    type: 'success',
    badge: `${w}×${h}px • ${ratio.toFixed(2)}:1`,
    title: '🟢 Optimal Hero Banner Ratio',
    message: `Perfect landscape dimensions (16:7 / 16:9). Image will render full-bleed and crisp across all displays.`,
  };
}

function App() {
  const [activeTab, setActiveTab] = useState('hero');
  const [settings, setSettings] = useState({
    columns: '3',
    shadow: 'shadow-md',
    border_radius: 'rounded-sm',
    autoplay: false,
    autoplay_speed: '3000',
    backdrop_blur: 'backdrop-blur-md',
  });
  const [images, setImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [termId, setTermId] = useState(null);
  const [editingImageId, setEditingImageId] = useState(null);
  const [editFields, setEditFields] = useState({ title: '', alt: '' });
  const [isSavingMedia, setIsSavingMedia] = useState(false);

  const [heroSlides, setHeroSlides] = useState([]);
  const [heroSlidesLoading, setHeroSlidesLoading] = useState(true);
  const [isSavingHero, setIsSavingHero] = useState(false);
  const [expandedSlideId, setExpandedSlideId] = useState(null);

  // Fetch settings and gallery media on mount
  useEffect(() => {
    // 1. Fetch settings
    fetch('/wp-json/molokele/v1/settings', {
      headers: { 'X-WP-Nonce': window.molokeleToolsData?.nonce }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.code) {
          setSettings(data);
        }
        setSettingsLoading(false);
      })
      .catch(() => setSettingsLoading(false));

    // 1b. Fetch homepage hero slides
    fetch('/wp-json/molokele/v1/hero-slides', {
      headers: { 'X-WP-Nonce': window.molokeleToolsData?.nonce }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setHeroSlides(data);
        }
        setHeroSlidesLoading(false);
      })
      .catch(() => setHeroSlidesLoading(false));

    // 2. Fetch the term ID for site_gallery = 'photo-gallery'
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
          setImages(mediaItems.map(item => ({
            id: item.id,
            url: item.source_url,
            title: item.title.rendered,
            alt: item.alt_text,
            link: item.link
          })));
        }
        setImagesLoading(false);
      })
      .catch(() => setImagesLoading(false));
  };

  // Save Settings handler
  const handleSaveSettings = () => {
    setIsSavingSettings(true);
    fetch('/wp-json/molokele/v1/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.molokeleToolsData?.nonce
      },
      body: JSON.stringify(settings)
    })
      .then((res) => res.json())
      .then(() => {
        setIsSavingSettings(false);
        alert('Gallery settings saved successfully!');
      })
      .catch(() => {
        setIsSavingSettings(false);
        alert('Failed to save settings.');
      });
  };

  // --- Hero Slider handlers ---
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
        img_ratio: ratio
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
        alert('Hero slider saved successfully!');
      })
      .catch(() => {
        setIsSavingHero(false);
        alert('Failed to save hero slider.');
      });
  };

  // Launch WP Media Uploader
  const handleAddMedia = () => {
    if (!termId) {
      alert('Error: "photo-gallery" taxonomy term not found.');
      return;
    }

    const frame = window.wp.media({
      title: 'Select Images to Add to Photo Gallery',
      button: { text: 'Add to Gallery' },
      multiple: true
    });

    frame.on('select', () => {
      const selections = frame.state().get('selection').toJSON();
      const mediaIds = selections.map(s => s.id);
      
      // Associate terms with each media item
      const promises = mediaIds.map(id => 
        fetch(`/wp-json/wp/v2/media/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': window.molokeleToolsData?.nonce
          },
          body: JSON.stringify({
            site_gallery: [termId]
          })
        })
      );

      Promise.all(promises)
        .then(() => {
          fetchMediaForTerm(termId);
          alert('Images added to photo-gallery successfully!');
        })
        .catch(() => {
          alert('Failed to associate some images.');
        });
    });

    frame.open();
  };

  // Remove image from gallery
  const handleRemoveImage = (mediaId) => {
    if (!confirm('Are you sure you want to remove this image from the gallery?')) return;

    fetch(`/wp-json/wp/v2/media/${mediaId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.molokeleToolsData?.nonce
      },
      body: JSON.stringify({
        site_gallery: [] // Clears taxonomy association
      })
    })
      .then(() => {
        setImages(images.filter(img => img.id !== mediaId));
      })
      .catch(() => alert('Failed to remove image.'));
  };

  // Start Inline Image Editing
  const startEdit = (img) => {
    setEditingImageId(img.id);
    setEditFields({ title: img.title, alt: img.alt });
  };

  // Save Inline Image Details
  const saveMediaDetails = (mediaId) => {
    setIsSavingMedia(true);
    fetch(`/wp-json/wp/v2/media/${mediaId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.molokeleToolsData?.nonce
      },
      body: JSON.stringify({
        title: editFields.title,
        alt_text: editFields.alt
      })
    })
      .then((res) => res.json())
      .then(() => {
        setImages(images.map(img => 
          img.id === mediaId 
            ? { ...img, title: editFields.title, alt: editFields.alt } 
            : img
        ));
        setEditingImageId(null);
        setIsSavingMedia(false);
      })
      .catch(() => {
        alert('Failed to update details.');
        setIsSavingMedia(false);
      });
  };

  return (
    <div className="bg-[#f0f2f5] min-h-[85vh] font-sans p-6 text-slate-800">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
            Molokele Site Tools
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage the homepage hero slider, gallery display settings, and photo-gallery images —
            all from one place.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('hero')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
              activeTab === 'hero'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Layers className="h-4 w-4" />
            Hero Slider ({heroSlides.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
              activeTab === 'settings'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Settings className="h-4 w-4" />
            Configurations
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
              activeTab === 'images'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Image className="h-4 w-4" />
            Manage Images ({images.length})
          </button>
        </div>
      </div>

      {/* Main Content Sections */}
      {activeTab === 'hero' ? (
        <div className="max-w-5xl bg-white rounded-lg border border-slate-200 shadow-sm p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black uppercase text-slate-900 tracking-wide">
                Homepage Hero Slider
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Full control over the slideshow at the top of the homepage — image, badge, heading,
                copy, and call-to-action for each slide. Reorder with the arrows; the top slide
                shows first.
              </p>
            </div>
            <button
              onClick={addSlide}
              className="inline-flex items-center gap-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 font-sans font-black text-xs tracking-widest uppercase shadow-md transition-colors flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
              Add Slide
            </button>
          </div>

          {heroSlidesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : heroSlides.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-lg">
              <p className="text-slate-400 text-sm">No slides configured yet.</p>
              <button
                onClick={addSlide}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#D91A42] hover:text-[#8C0F2A] transition-colors"
              >
                Add the first slide
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {heroSlides.map((slide, index) => {
                const isExpanded = expandedSlideId === slide.id;
                return (
                  <div key={slide.id} className="border border-slate-200 rounded-lg overflow-hidden">
                    {/* Row header — always visible */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50/60">
                      <div className="flex flex-col gap-0.5 flex-shrink-0">
                        <button
                          onClick={() => moveSlide(index, -1)}
                          disabled={index === 0}
                          className="text-slate-400 hover:text-slate-800 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                          aria-label="Move slide up"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveSlide(index, 1)}
                          disabled={index === heroSlides.length - 1}
                          className="text-slate-400 hover:text-slate-800 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                          aria-label="Move slide down"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="h-14 w-20 flex-shrink-0 rounded overflow-hidden bg-slate-200 border border-slate-200">
                        {slide.image ? (
                          <img src={slide.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-400">
                            <ImagePlus className="h-5 w-5" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-sans font-bold text-sm text-slate-800 truncate">
                          {slide.title || <span className="text-slate-400 italic">Untitled slide</span>}
                        </p>
                        <p className="font-sans text-[10px] font-black uppercase tracking-wider text-slate-400 truncate">
                          {slide.badge || 'No badge set'}
                        </p>
                      </div>

                      <button
                        onClick={() => setExpandedSlideId(isExpanded ? null : slide.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors flex-shrink-0"
                      >
                        {isExpanded ? 'Close' : 'Edit'}
                        <ChevronRightIcon className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>

                      <button
                        onClick={() => removeSlide(slide.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors flex-shrink-0"
                        aria-label="Remove slide"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Expanded edit form */}
                    {isExpanded && (
                      <div className="p-5 border-t border-slate-200 space-y-5">
                        <div className="flex items-start gap-4">
                          <div className="h-24 w-36 flex-shrink-0 rounded overflow-hidden bg-slate-100 border border-slate-200">
                            {slide.image ? (
                              <img src={slide.image} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-slate-300">
                                <ImagePlus className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => pickSlideImage(slide.id)}
                              className="inline-flex items-center gap-1.5 rounded-md bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 text-xs font-black uppercase tracking-wider text-slate-700 transition-colors"
                            >
                              <ImagePlus className="h-3.5 w-3.5" />
                              {slide.image ? 'Change Image' : 'Select Image'}
                            </button>
                            {slide.image && (
                              <button
                                onClick={() => updateSlide(slide.id, { image: '', image_id: 0 })}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors px-3"
                              >
                                <X className="h-3.5 w-3.5" />
                                Clear (use fallback photo)
                              </button>
                            )}
                            <p className="text-[10px] text-slate-400 px-3 max-w-xs">
                              Landscape photos (16:7 / 16:9) work best. Leave empty to fall back to the constituency gallery.
                            </p>
                          </div>
                        </div>

                        {/* Aspect Ratio Warning / Validation Banner */}
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
                            <div className={`p-3.5 rounded-lg border text-xs leading-relaxed space-y-1 ${bgColor}`}>
                              <div className="flex items-center justify-between font-black uppercase text-[11px] tracking-wider">
                                <span>{warn.title}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/70 border border-current font-bold">
                                  {warn.badge}
                                </span>
                              </div>
                              <p className="font-sans text-[11px] opacity-90">{warn.message}</p>
                            </div>
                          );
                        })()}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                              Badge
                            </label>
                            <input
                              type="text"
                              value={slide.badge}
                              onChange={(e) => updateSlide(slide.id, { badge: e.target.value })}
                              placeholder="e.g. Legislative Leadership"
                              className="w-full border border-slate-200 p-2.5 rounded-md focus:border-indigo-500 outline-none text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                              Image Focus
                            </label>
                            <select
                              value={slide.position}
                              onChange={(e) => updateSlide(slide.id, { position: e.target.value })}
                              className="w-full border border-slate-200 p-2.5 rounded-md focus:border-indigo-500 outline-none text-sm"
                            >
                              <option value="bg-top">Top</option>
                              <option value="bg-center">Center</option>
                              <option value="bg-bottom">Bottom</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                            Title
                          </label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
                            placeholder="e.g. Parliamentary Action"
                            className="w-full border border-slate-200 p-2.5 rounded-md focus:border-indigo-500 outline-none text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                            Description
                          </label>
                          <textarea
                            value={slide.description}
                            onChange={(e) => updateSlide(slide.id, { description: e.target.value })}
                            rows="2"
                            placeholder="One or two sentences of supporting copy."
                            className="w-full border border-slate-200 p-2.5 rounded-md focus:border-indigo-500 outline-none text-sm resize-y"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                              Button Label
                            </label>
                            <input
                              type="text"
                              value={slide.cta_label}
                              onChange={(e) => updateSlide(slide.id, { cta_label: e.target.value })}
                              placeholder="e.g. CDF Tracker"
                              className="w-full border border-slate-200 p-2.5 rounded-md focus:border-indigo-500 outline-none text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                              Button Link
                            </label>
                            <input
                              type="text"
                              value={slide.cta_url}
                              onChange={(e) => updateSlide(slide.id, { cta_url: e.target.value })}
                              placeholder="e.g. /cdf-tracker/"
                              className="w-full border border-slate-200 p-2.5 rounded-md focus:border-indigo-500 outline-none text-sm"
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

          <div className="border-t border-slate-200 pt-6 flex justify-end">
            <button
              onClick={handleSaveHeroSlides}
              disabled={isSavingHero}
              className="inline-flex items-center gap-2 rounded-md bg-[#D91A42] hover:bg-[#8C0F2A] px-6 py-3 font-sans font-black text-xs tracking-widest uppercase text-white shadow-md transition-colors disabled:opacity-50"
            >
              {isSavingHero ? 'Saving...' : 'Save Hero Slider'}
              <Save className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : activeTab === 'settings' ? (
        <div className="max-w-4xl bg-white rounded-lg border border-slate-200 shadow-sm p-8 space-y-8">
          <div>
            <h2 className="text-lg font-black uppercase text-slate-900 tracking-wide">
              Gallery &amp; Lightbox Settings
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Customize the look and feel of the image sliders and slideshow overlay across the frontend site.
            </p>
          </div>

          {settingsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Display Grid Columns */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                  Homepage Grid Columns
                </label>
                <select
                  value={settings.columns}
                  onChange={(e) => setSettings({ ...settings, columns: e.target.value })}
                  className="w-full border border-slate-200 p-2.5 rounded-md focus:border-indigo-500 outline-none text-sm"
                >
                  <option value="2">2 Columns</option>
                  <option value="3">3 Columns (Standard)</option>
                  <option value="4">4 Columns</option>
                </select>
                <p className="text-slate-400 text-[10px]">
                  Specifies column partitions for the desktop gallery track elements.
                </p>
              </div>

              {/* Shadow Styles */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                  Card Shadows
                </label>
                <select
                  value={settings.shadow}
                  onChange={(e) => setSettings({ ...settings, shadow: e.target.value })}
                  className="w-full border border-slate-200 p-2.5 rounded-md focus:border-indigo-500 outline-none text-sm"
                >
                  <option value="shadow-none">No Shadow</option>
                  <option value="shadow-sm">Small Shadow</option>
                  <option value="shadow-md">Medium Shadow (Standard)</option>
                  <option value="shadow-lg">Large Premium Shadow</option>
                </select>
              </div>

              {/* Border Radius */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                  Card Corner Roundedness
                </label>
                <select
                  value={settings.border_radius}
                  onChange={(e) => setSettings({ ...settings, border_radius: e.target.value })}
                  className="w-full border border-slate-200 p-2.5 rounded-md focus:border-indigo-500 outline-none text-sm"
                >
                  <option value="rounded-none">None (Straight Edge)</option>
                  <option value="rounded-sm">Small rounded-sm</option>
                  <option value="rounded-md">Medium rounded-md</option>
                  <option value="rounded-xl">Large rounded-xl</option>
                </select>
              </div>

              {/* Lightbox Backdrop Blur */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                  Slideshow Backdrop Blur
                </label>
                <select
                  value={settings.backdrop_blur}
                  onChange={(e) => setSettings({ ...settings, backdrop_blur: e.target.value })}
                  className="w-full border border-slate-200 p-2.5 rounded-md focus:border-indigo-500 outline-none text-sm"
                >
                  <option value="backdrop-blur-none">No Blur (Solid Overlay)</option>
                  <option value="backdrop-blur-sm">Light Blur</option>
                  <option value="backdrop-blur-md">Medium Blur (Standard)</option>
                  <option value="backdrop-blur-lg">Strong Backdrop Blur</option>
                </select>
              </div>

              {/* Autoplay toggle */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                  Slideshow Autoplay (Lightbox)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.autoplay}
                    onChange={(e) => setSettings({ ...settings, autoplay: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                  />
                  <span className="text-sm font-semibold text-slate-700">Enable autoplay in modal</span>
                </div>
              </div>

              {/* Autoplay Speed */}
              {settings.autoplay && (
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                    Autoplay Transition Speed (ms)
                  </label>
                  <input
                    type="number"
                    value={settings.autoplay_speed}
                    onChange={(e) => setSettings({ ...settings, autoplay_speed: e.target.value })}
                    className="w-full border border-slate-200 p-2.5 rounded-md focus:border-indigo-500 outline-none text-sm"
                    placeholder="e.g. 3000"
                  />
                </div>
              )}

            </div>
          )}

          <div className="border-t border-slate-200 pt-6 flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={isSavingSettings}
              className="inline-flex items-center gap-2 rounded-md bg-[#D91A42] hover:bg-[#8C0F2A] px-6 py-3 font-sans font-black text-xs tracking-widest uppercase text-white shadow-md transition-colors disabled:opacity-50"
            >
              {isSavingSettings ? 'Saving...' : 'Save Settings'}
              <Save className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black uppercase text-slate-900 tracking-wide">
                Gallery Image Casework
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Upload or select images from the WordPress Media library and configure details like title and alt text.
              </p>
            </div>
            <div>
              <button
                onClick={handleAddMedia}
                className="inline-flex items-center gap-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 font-sans font-black text-xs tracking-widest uppercase shadow-md transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Image / Media
              </button>
            </div>
          </div>

          {imagesLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-lg">
              <p className="text-slate-400 text-sm">No images in "photo-gallery" group yet.</p>
              <button
                onClick={handleAddMedia}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#D91A42] hover:text-[#8C0F2A] transition-colors"
              >
                Add the first image
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((img) => {
                const isEditing = editingImageId === img.id;
                return (
                  <div 
                    key={img.id}
                    className="border border-slate-200 rounded-lg overflow-hidden shadow-sm flex flex-col justify-between bg-slate-50/50"
                  >
                    <div className="relative aspect-[4/3] bg-slate-200">
                      <img 
                        src={img.url} 
                        alt={img.alt} 
                        className="w-full h-full object-cover"
                      />
                      <a 
                        href={img.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="absolute right-3 top-3 p-1.5 rounded bg-black/60 hover:bg-black/80 text-white transition-colors"
                        title="View file in attachment page"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={editFields.title}
                              onChange={(e) => setEditFields({ ...editFields, title: e.target.value })}
                              className="w-full border border-slate-200 px-3 py-1.5 rounded text-xs outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                              Alt Text
                            </label>
                            <input
                              type="text"
                              value={editFields.alt}
                              onChange={(e) => setEditFields({ ...editFields, alt: e.target.value })}
                              className="w-full border border-slate-200 px-3 py-1.5 rounded text-xs outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <h4 className="font-sans font-bold text-sm text-slate-800 line-clamp-1">
                            {img.title || '(No Title)'}
                          </h4>
                          <p className="font-serif text-xs text-slate-500 line-clamp-2">
                            <span className="font-sans font-black text-[9px] uppercase tracking-wide text-slate-400 block mb-0.5">Alt tag:</span>
                            {img.alt || '(No alt text)'}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-3">
                        {isEditing ? (
                          <div className="flex gap-2 w-full justify-end">
                            <button
                              onClick={() => setEditingImageId(null)}
                              className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-2.5 py-1.5"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => saveMediaDetails(img.id)}
                              disabled={isSavingMedia}
                              className="inline-flex items-center gap-1 bg-[#D91A42] text-white px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider hover:bg-[#8C0F2A] transition-colors"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Save
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(img)}
                              className="inline-flex items-center gap-1 text-slate-600 hover:text-[#D91A42] transition-colors text-xs font-black uppercase tracking-wider"
                            >
                              <Edit2 className="h-3 w-3" />
                              Edit Info
                            </button>
                            <button
                              onClick={() => handleRemoveImage(img.id)}
                              className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-600 transition-colors text-xs font-semibold"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Remove
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

    </div>
  );
}

const root = document.getElementById('molokele-tools-root');
if (root) {
  createRoot(root).render(<App />);
}
