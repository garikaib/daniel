import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Menu, 
  X as CloseIcon, 
  ChevronDown, 
  ChevronRight,
  Home, 
  User, 
  Newspaper, 
  Briefcase, 
  Landmark, 
  Mail, 
  FileText, 
  Phone, 
  MapPin, 
  ExternalLink
} from 'lucide-react';
import ZimbabweMap from './lib/ZimbabweMap.jsx';
import FlagStripe from './lib/FlagStripe.jsx';
import PodcastSvg from './pages/PodcastSvg.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { prefetchSearchIndex, queryLiveSearch } from './lib/searchEngine.js';
import LiveSearchResults from './components/LiveSearchResults.jsx';

const getMenuIcon = (title) => {
  const t = title.toLowerCase();
  if (t.includes('home')) return Home;
  if (t.includes('about') || t.includes('bio') || t.includes('profile')) return User;
  if (t.includes('news') || t.includes('blog') || t.includes('media') || t.includes('press') || t.includes('update')) return Newspaper;
  if (t.includes('project') || t.includes('work') || t.includes('initiative') || t.includes('action')) return Briefcase;
  if (t.includes('parliament') || t.includes('constituency') || t.includes('office') || t.includes('whange')) return Landmark;
  if (t.includes('contact') || t.includes('get in touch') || t.includes('email')) return Mail;
  if (t.includes('document') || t.includes('resource') || t.includes('policy')) return FileText;
  return ChevronRight;
};

function FacebookIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
    </svg>
  );
}
function XIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function BlueskyIcon(props) {
  return (
    <svg {...props} viewBox="0 0 512 512">
      <path d="M111.8 77.2C167.3 117.7 220 183 256 233.1c36-50.1 88.7-115.4 144.2-155.9C448.2 42.1 512 16.5 512 79.7c0 12.3-5.2 92.5-8.3 108.3-9.5 49.3-58.4 62.1-102.5 53.6 77.3 14.8 96 61.4 53.9 108.3-43 47.9-106 18.2-161.4-23-11.4-8.5-22.7-17.7-33.7-27.4-11 9.7-22.3 18.9-33.7 27.4-55.4 41.2-118.4 70.9-161.4 23-42.1-46.9-23.4-93.5 53.9-108.3-44.1 8.5-93-4.3-102.5-53.6C5.2 172.2 0 92 0 79.7 0 16.5 63.8 42.1 111.8 77.2z" />
    </svg>
  );
}
function YoutubeIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.555a3.003 3.003 0 0 0-2.11 2.108C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.482 20.5 12 20.5 12 20.5s7.518 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
function InstagramIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 1.675c-3.178 0-3.518.012-4.77.07-2.5.113-3.511 1.135-3.623 3.623-.058 1.253-.069 1.593-.069 4.77 0 3.177.011 3.517.069 4.77.112 2.484 1.121 3.509 3.623 3.623 1.252.058 1.592.069 4.77.069 3.177 0 3.517-.011 4.77-.069 2.502-.114 3.511-1.139 3.623-3.623.058-1.253.069-1.593.069-4.77 0-3.178-.011-3.517-.069-4.77-.113-2.487-1.121-3.512-3.623-3.623-1.253-.058-1.593-.07-4.77-.07zm0 2.25a5.912 5.912 0 1 1 0 11.824 5.912 5.912 0 0 1 0-11.824zm0 9.574c2.023 0 3.662-1.639 3.662-3.662S14.023 8.338 12 8.338s-3.662 1.639-3.662 3.662 1.639 3.662 3.662 3.662zM18.406 4.155a1.44 1.44 0 1 1 0 2.88 1.44 1.44 0 0 1 0-2.88z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: 'Facebook', url: 'https://facebook.com', Icon: FacebookIcon, iconClass: 'h-4 w-4' },
  { label: 'X', url: 'https://x.com', Icon: XIcon, iconClass: 'h-3.5 w-3.5' },
  { label: 'Bluesky', url: 'https://bsky.app', Icon: BlueskyIcon, iconClass: 'h-3.5 w-3.5' },
  { label: 'YouTube', url: 'https://youtube.com', Icon: YoutubeIcon, iconClass: 'h-4 w-4' },
  { label: 'Instagram', url: 'https://instagram.com', Icon: InstagramIcon, iconClass: 'h-4 w-4' },
];

function SocialIcons({ variant = 'ribbon' }) {
  const wrapClass =
    variant === 'ribbon'
      ? 'flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/80 hover:text-brand-orange hover:border-brand-orange hover:scale-105 transition-all duration-200'
      : 'flex h-7 w-7 items-center justify-center rounded-full border border-brand-pink/30 text-brand-pink hover:text-brand-pink hover:border-brand-pink hover:scale-105 transition-all duration-200';

  return (
    <div className="flex items-center gap-2">
      {SOCIAL_LINKS.map(({ label, url, Icon, iconClass }) => (
        <a key={label} href={url} target="_blank" rel="noreferrer" className={wrapClass} aria-label={label}>
          <Icon className={`${iconClass} fill-current`} />
        </a>
      ))}
    </div>
  );
}

export default function Header() {
  const menuItems = window.molokeleThemeData?.menuItems || [];
  const currentUrl = window.molokeleThemeData?.currentUrl || '';
  const pageSlug = window.molokeleThemeData?.pageSlug || '';
  const isHome = pageSlug === 'home';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileItems, setExpandedMobileItems] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveResults, setLiveResults] = useState({ total: 0, items: [], groups: {} });
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchFormRef = useRef(null);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleMobileExpand = (itemId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedMobileItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsSticky((prev) => {
        if (!prev && currentScroll > 110) {
          return true; // Activate sticky mode when scrolling down past 110px
        }
        if (prev && currentScroll < 40) {
          return false; // Deactivate sticky mode only when scrolling back up past 40px
        }
        return prev;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- LIVE SEARCH ENGINE HOOKS ---

  // Background prefetch on page load (silent, non-blocking)
  useEffect(() => {
    prefetchSearchIndex();
  }, []);

  // Ensure index is warm when user opens search
  useEffect(() => {
    if (searchOpen) prefetchSearchIndex();
  }, [searchOpen]);

  // Debounced live query on keystroke (150ms)
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setLiveResults({ total: 0, items: [], groups: {} });
      setSelectedIndex(-1);
      return;
    }
    const timer = setTimeout(() => {
      setLiveResults(queryLiveSearch(searchQuery));
      setSelectedIndex(-1);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Global Cmd+K / Ctrl+K to open search, Escape to close
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape' && searchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [searchOpen]);

  // Click-outside dismissal for search
  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e) => {
      if (searchFormRef.current && !searchFormRef.current.contains(e.target)) {
        closeSearch();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [searchOpen]);

  // Arrow key navigation inside search results
  const handleSearchKeyDown = (e) => {
    const count = liveResults.items?.length || 0;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < count - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : count - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0 && liveResults.items[selectedIndex]) {
      e.preventDefault();
      window.location.href = liveResults.items[selectedIndex].link;
    }
  };

  // --- END LIVE SEARCH ENGINE HOOKS ---

  const pathOf = (url) => {
    try {
      return new URL(url).pathname.replace(/\/+$/, '');
    } catch {
      return '';
    }
  };

  const isItemActive = (item) => {
    const current = pathOf(currentUrl);
    if (pathOf(item.url) === current) return true;
    return (item.children || []).some((child) => pathOf(child.url) === current);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex >= 0 && liveResults.items[selectedIndex]) {
      window.location.href = liveResults.items[selectedIndex].link;
      return;
    }
    if (searchQuery.trim()) {
      window.location.href = `/?s=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setLiveResults({ total: 0, items: [], groups: {} });
    setSelectedIndex(-1);
  };

  // Home page: logo hidden until scrolled, ribbon visible until scrolled.
  // Every other page: no ribbon at all, logo always visible, social icons
  // live inline in the main nav row instead.
  // Always show ribbon when not scrolled down on any page
  // Home page: ribbon visible until scrolled down. Other pages: no ribbon.
  const showLogo = true;
  const showRibbon = isHome && !isSticky;

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent font-sans shadow-none">
      {/* Top Flag Stripe Accent */}
      <FlagStripe className="absolute top-0 left-0 w-full h-1 z-30" />

      {/* Primary Header Row Wrapper — Rich Emerald Green Theme (#044D29) */}
      <div
        className={`w-full relative z-20 transition-all duration-300 ${
          isSticky
            ? 'bg-[#044D29]/95 backdrop-blur-md border-b border-[#DCA11D]/40 shadow-md h-20 text-white'
            : 'bg-[#044D29] border-b border-[#DCA11D]/40 shadow-sm h-24 text-white'
        }`}
      >
        {/* Brand Logo */}
        <a
          href="/"
          className={`absolute left-4 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 focus:outline-none transition-all duration-300 flex items-center gap-2.5 sm:gap-3 select-none max-w-[62vw] sm:max-w-[340px] ${
            showLogo && !searchOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <ZimbabweMap
            className="flex-shrink-0 h-9 sm:h-11 w-auto text-white transition-colors duration-300"
            highlightClassName="fill-[#DCA11D]"
          />
          <div className="flex flex-col justify-center leading-none min-w-0">
            <span className="font-sans font-black uppercase tracking-tight text-sm sm:text-base truncate text-white">
              Hon. Molokele
            </span>
            <span className="font-sans font-bold uppercase tracking-[0.2em] text-[9px] sm:text-[10px] truncate mt-1.5 text-white/70">
              MP{' '}
              <span className="text-[#DCA11D] font-black">Whange Central</span>
            </span>
          </div>
        </a>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex h-full items-center justify-end">

            {searchOpen ? (
              /* Search Mode */
              <form ref={searchFormRef} onSubmit={handleSearchSubmit} className="relative flex flex-1 items-center justify-end gap-2 sm:gap-3 w-full max-w-full sm:max-w-xl ml-auto animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex flex-1 items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3.5 sm:px-4 py-2 text-white focus-within:border-[#DCA11D] focus-within:bg-black/40 focus-within:ring-2 focus-within:ring-[#DCA11D]/30 transition-all duration-300">
                  <Search className="h-4 w-4 text-white/60 flex-shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search articles, speeches, projects..."
                    className="flex-1 !border-none !outline-none !bg-transparent font-sans text-xs sm:text-sm text-white placeholder:text-white/50 !shadow-none p-0 focus:!ring-0 min-w-0"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-white/60 hover:text-white transition-colors focus:outline-none p-1"
                    >
                      <CloseIcon className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="hidden sm:inline-flex px-4 py-2 rounded-full !bg-[#DCA11D] !text-[#090D14] font-sans font-black text-[10px] uppercase tracking-widest hover:!bg-[#C8102E] hover:!text-white transition-colors shadow-sm flex-shrink-0"
                >
                  Search
                </button>

                <button
                  type="button"
                  onClick={closeSearch}
                  aria-label="Close search"
                  className="p-2 text-white/70 hover:text-[#DCA11D] transition-colors focus:outline-none rounded-full hover:bg-white/10 flex-shrink-0"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>

                {!showRibbon && <div className="hidden lg:block"><SocialIcons variant="nav" /></div>}

                {/* Live Search Results Dropdown */}
                <LiveSearchResults
                  query={searchQuery}
                  results={liveResults}
                  selectedIndex={selectedIndex}
                  onSelectResult={(item) => { window.location.href = item.link; }}
                  onSuggestionClick={(term) => setSearchQuery(term)}
                  onClose={closeSearch}
                />
              </form>
            ) : (
              <>
                {/* Desktop Navigation */}
                <nav className="hidden xl:flex items-center gap-x-6 2xl:gap-x-8">
                  {menuItems.map((item) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const active = isItemActive(item);
                    const linkColor = active 
                      ? 'text-[#DCA11D] font-extrabold' 
                      : 'text-white/90 hover:text-[#DCA11D]';
                    const underlineColor = 'bg-[#DCA11D] h-[2.5px]';

                    return (
                      <div
                        key={item.id}
                        className="relative group"
                        onMouseEnter={() => hasChildren && setActiveDropdown(item.id)}
                        onMouseLeave={() => hasChildren && setActiveDropdown(null)}
                      >
                        <a
                          href={item.url}
                          className={`relative flex items-center gap-1 font-sans font-black text-xs tracking-[0.16em] py-2 uppercase transition-colors focus:outline-none focus-visible:text-[#DCA11D] ${linkColor}`}
                        >
                          {item.title === 'News & Media' ? 'News & Updates' : item.title}
                          {hasChildren && <ChevronDown className="h-3 w-3 opacity-60" />}
                          <span
                            className={`absolute left-0 -bottom-0.5 transition-all duration-200 ${underlineColor} ${
                              active ? 'w-full' : 'w-0 group-hover:w-full group-focus-within:w-full'
                            }`}
                          />
                        </a>

                        {/* Dropdown Menu */}
                        {hasChildren && activeDropdown === item.id && (
                          <div className="absolute left-0 top-full z-50 w-56 rounded-md bg-[#090D14] border-t-2 border-[#DCA11D] py-2 shadow-xl ring-1 ring-white/10 animate-in fade-in slide-in-from-top-1 duration-200">
                            {item.children.map((child) => (
                              <a
                                key={child.id}
                                href={child.url}
                                className="block px-4 py-2.5 text-[10px] font-black tracking-[0.14em] text-white/80 hover:bg-[#044D29] hover:text-[#DCA11D] transition-colors uppercase focus:outline-none"
                              >
                                {child.title}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Desktop Search Button */}
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 transition-colors focus:outline-none text-white hover:text-[#DCA11D]"
                    aria-label="Search site"
                  >
                    <Search className="h-5 w-5 stroke-[2.5]" />
                  </button>

                  <ThemeToggle className="text-white hover:text-[#DCA11D]" />

                  {!showRibbon && <SocialIcons variant="nav" />}
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="flex xl:hidden items-center gap-4">
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 transition-colors focus:outline-none text-white hover:text-[#DCA11D]"
                    aria-label="Search site"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                  <ThemeToggle className="text-white hover:text-[#DCA11D]" />
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 transition-colors focus:outline-none text-white hover:text-[#DCA11D]"
                    aria-label="Toggle mobile menu"
                  >
                    {mobileMenuOpen ? <CloseIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Slanted Contact Strip — home page only (Fades/Slides out when scrolled down) */}
      {showRibbon && (
        <div
          className={`hidden md:block absolute top-full left-0 w-full z-10 transition-all duration-300 ${
            !isSticky ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            {/* Slanted green background wedge starting just to the left of Parliament badge and extending to the right edge */}
            <div
              className="absolute top-0 bottom-0 left-[-20px] sm:left-[-28px] right-[-100vw] bg-[#044D29] border-t border-[#DCA11D]/40 shadow-lg"
              style={{
                clipPath: 'polygon(36px 0, 100% 0, 100% 100%, 0% 100%)',
              }}
            />

            <div className="relative z-20 py-2.5 flex flex-wrap items-center justify-between gap-4 text-white">
              {/* Left side: Parliament Badge */}
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#DCA11D]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#DCA11D] text-black font-extrabold text-[10px]">
                  🇿🇼
                </span>
                <span>Parliament of Zimbabwe</span>
                <span className="opacity-40">•</span>
                <span className="text-white/80 font-semibold">Whange Central MP Office</span>
              </div>

              {/* Right side: Contact Details & Socials */}
              <div className="flex items-center gap-4 text-xs font-sans tracking-wide">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#DCA11D]">Cell:</span>
                  <a href="tel:+263776483659" className="font-bold text-white hover:text-[#DCA11D] transition-colors">
                    +263 77 648 3659
                  </a>
                </div>
                <span className="opacity-30">•</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white/70">Landline:</span>
                  <a href="tel:+2638130598" className="font-bold text-white hover:text-[#DCA11D] transition-colors">
                    +263 81 305 98 <span className="font-normal text-[11px] text-white/60">(081 305 98)</span>
                  </a>
                </div>
                <span className="opacity-30">•</span>
                <SocialIcons variant="ribbon" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Premium Drawer Navigation */}
      <div 
        className={`fixed inset-0 z-[100] xl:hidden transition-all duration-500 ease-in-out ${
          mobileMenuOpen ? 'visible' : 'invisible pointer-events-none'
        }`}
      >
        {/* Blurred backdrop with fade transition */}
        <div 
          className={`absolute inset-0 bg-brand-blue/40 backdrop-blur-md transition-opacity duration-500 ease-in-out ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Sliding Menu Panel */}
        <div 
          className={`absolute top-0 right-0 h-full w-[85%] max-w-[380px] bg-brand-blue/98 text-white shadow-2xl flex flex-col justify-between transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <span className="text-[10px] font-black tracking-[0.2em] text-brand-orange uppercase">Navigation</span>
            <div className="flex items-center gap-1 -mr-2">
              <ThemeToggle className="text-white/70 hover:text-brand-pink rounded-full hover:bg-white/5" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-white/70 hover:text-brand-pink hover:bg-white/5 rounded-full transition-all duration-200"
                aria-label="Close navigation menu"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Drawer Content (Menu List) */}
          <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
            <div className="flex flex-col gap-1.5">
              {menuItems.map((item, index) => {
                const hasChildren = item.children && item.children.length > 0;
                const active = isItemActive(item);
                const Icon = getMenuIcon(item.title);
                const isExpanded = !!expandedMobileItems[item.id];

                return (
                  <div 
                    key={item.id} 
                    className="flex flex-col border-b border-white/5 pb-1.5"
                    style={{
                      transitionDelay: `${index * 60}ms`,
                      transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(30px)',
                      opacity: mobileMenuOpen ? 1 : 0,
                      transitionProperty: 'transform, opacity',
                      transitionDuration: '500ms',
                      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <a
                        href={item.url}
                        className={`flex-1 flex items-center gap-3.5 py-3 font-sans font-black text-sm tracking-[0.14em] uppercase transition-colors focus:outline-none ${
                          active ? 'text-brand-orange' : 'text-white/90 hover:text-brand-orange'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 ${
                          active ? 'bg-brand-orange text-brand-blue' : 'bg-white/5 text-brand-orange/90 group-hover:bg-brand-orange/10'
                        }`}>
                          <Icon className="h-4 w-4 stroke-[2.5]" />
                        </span>
                        <span>{item.title === 'News & Media' ? 'News & Updates' : item.title}</span>
                      </a>

                      {hasChildren && (
                        <button
                          onClick={(e) => toggleMobileExpand(item.id, e)}
                          className={`p-3 text-white/50 hover:text-brand-orange focus:outline-none transition-transform duration-300 ${
                            isExpanded ? 'rotate-180 text-brand-orange' : ''
                          }`}
                          aria-label={`Toggle ${item.title} sub-menu`}
                        >
                          <ChevronDown className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    {/* Accordion Sub-menu */}
                    {hasChildren && (
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out pl-12 flex flex-col gap-1 border-l border-white/5 ${
                          isExpanded ? 'max-h-[300px] py-1.5 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                        }`}
                      >
                        {item.children.map((child) => {
                          const childActive = pathOf(child.url) === pathOf(currentUrl);
                          return (
                            <a
                              key={child.id}
                              href={child.url}
                              className={`py-2 text-[11px] font-black tracking-[0.12em] uppercase transition-colors focus:outline-none ${
                                childActive ? 'text-brand-pink' : 'text-white/60 hover:text-brand-pink'
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {child.title}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drawer Footer (Info & Socials) */}
          <div 
            className="p-6 border-t border-white/5 bg-black/20 flex flex-col gap-5"
            style={{
              transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: mobileMenuOpen ? 1 : 0,
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 200ms, opacity 0.6s ease 200ms'
            }}
          >
            {/* Quick Contact Card */}
            <div className="flex flex-col gap-2.5 text-xs text-white/70 font-sans">
              <span className="text-[10px] font-black tracking-widest text-brand-orange uppercase">Contact Constituency</span>
              <a href="tel:+263776483659" className="flex items-center gap-2 hover:text-brand-orange transition-colors">
                <Phone className="h-3.5 w-3.5 text-brand-pink" />
                <span>+263 77 648 3659</span>
              </a>
              <a href="/contact/" className="flex items-center gap-2 hover:text-brand-orange transition-colors" onClick={() => setMobileMenuOpen(false)}>
                <Mail className="h-3.5 w-3.5 text-brand-pink" />
                <span>Email MP Office</span>
              </a>
            </div>

            {/* Social Icons row */}
            <div className="pt-2 border-t border-white/5 flex justify-center">
              <SocialIcons variant="nav" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
