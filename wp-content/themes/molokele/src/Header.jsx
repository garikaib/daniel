import React, { useState } from 'react';
import { Search, Menu, X as CloseIcon, ChevronDown } from 'lucide-react';

export default function Header() {
  const menuItems = window.molokeleThemeData?.menuItems || [];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  return (
    <header className="w-full bg-white text-brand-blue font-sans">
      {/* Primary Header Row */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          
          {/* Brand Logo / M.P. Title */}
          <div className="flex flex-shrink-0 flex-col">
            <a href="/" className="group flex flex-col focus:outline-none">
              <span className="font-sans font-black text-xl sm:text-2xl md:text-3xl tracking-tight text-brand-blue leading-none uppercase group-hover:text-brand-pink transition-colors">
                Daniel Molokele
              </span>
              <span className="mt-1 font-serif text-[10px] sm:text-xs tracking-widest text-brand-orange uppercase font-bold leading-none">
                Member of Parliament • Hwange Central
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-x-8">
            {menuItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              return (
                <div 
                  key={item.id} 
                  className="relative group"
                  onMouseEnter={() => hasChildren && setActiveDropdown(item.id)}
                  onMouseLeave={() => hasChildren && setActiveDropdown(null)}
                >
                  <a
                    href={item.url}
                    className="flex items-center gap-1 font-sans font-black text-sm tracking-normal text-brand-blue hover:text-brand-pink transition-colors py-2 uppercase"
                  >
                    {item.title}
                    {hasChildren && <ChevronDown className="h-3 w-3 opacity-60" />}
                  </a>

                  {/* Dropdown Menu */}
                  {hasChildren && activeDropdown === item.id && (
                    <div className="absolute left-0 top-full z-50 w-56 rounded-md bg-white py-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-200">
                      {item.children.map((child) => (
                        <a
                          key={child.id}
                          href={child.url}
                          className="block px-4 py-2 text-xs font-bold text-brand-blue hover:bg-brand-sand hover:text-brand-pink transition-colors uppercase"
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
              className="p-2 text-brand-blue hover:text-brand-pink transition-colors focus:outline-none"
              aria-label="Search site"
            >
              <Search className="h-5 w-5 stroke-[2.5]" />
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-4">
            <button 
              className="p-2 text-brand-blue hover:text-brand-pink transition-colors focus:outline-none"
              aria-label="Search site"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-brand-blue hover:text-brand-pink transition-colors focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <CloseIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Slanted Contact Strip (Ansari House Gov style) */}
      <div className="relative w-full bg-transparent z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end">
            {/* The Slanted Plum Container (correct diagonal slant \ direction) */}
            <div 
              className="w-full md:w-auto md:min-w-[65%] bg-brand-plum py-3 pl-12 pr-6 md:pl-16 md:pr-12 flex flex-col md:flex-row items-center justify-between gap-4 text-white"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 40px 100%)',
              }}
            >
              {/* Contact Info Text */}
              <div className="text-xs sm:text-sm font-sans tracking-wide text-center md:text-left flex flex-wrap items-center justify-center md:justify-start gap-1">
                <span className="font-black text-brand-orange uppercase mr-1">Contact Me:</span>
                <span>Call Constituency Office:</span>
                <a href="tel:+263776483659" className="font-black hover:text-brand-orange transition-colors">
                  +263 77 648 3659
                </a>
                <span className="mx-1.5 opacity-40">•</span>
                <span>Secretary: Mr. Thulani Moyo</span>
                <span className="mx-1.5 opacity-40">•</span>
                <a href="/contact/" className="underline decoration-1 underline-offset-4 font-bold hover:text-brand-orange transition-colors">
                  Email Me
                </a>
              </div>

              {/* Social Media Outline Icons */}
              <div className="flex items-center gap-2">
                {/* Facebook */}
                <a 
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-brand-pink text-white hover:bg-white hover:text-brand-plum transition-all duration-200"
                  aria-label="Facebook"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                  </svg>
                </a>

                {/* X */}
                <a 
                  href="https://x.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-brand-pink text-white hover:bg-white hover:text-brand-plum transition-all duration-200"
                  aria-label="X"
                >
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* Bluesky */}
                <a 
                  href="https://bsky.app" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-brand-pink text-white hover:bg-white hover:text-brand-plum transition-all duration-200"
                  aria-label="Bluesky"
                >
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 512 512">
                    <path d="M111.8 77.2C167.3 117.7 220 183 256 233.1c36-50.1 88.7-115.4 144.2-155.9C448.2 42.1 512 16.5 512 79.7c0 12.3-5.2 92.5-8.3 108.3-9.5 49.3-58.4 62.1-102.5 53.6 77.3 14.8 96 61.4 53.9 108.3-43 47.9-106 18.2-161.4-23-11.4-8.5-22.7-17.7-33.7-27.4-11 9.7-22.3 18.9-33.7 27.4-55.4 41.2-118.4 70.9-161.4 23-42.1-46.9-23.4-93.5 53.9-108.3-44.1 8.5-93-4.3-102.5-53.6C5.2 172.2 0 92 0 79.7 0 16.5 63.8 42.1 111.8 77.2z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-brand-pink text-white hover:bg-white hover:text-brand-plum transition-all duration-200"
                  aria-label="YouTube"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.555a3.003 3.003 0 0 0-2.11 2.108C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.482 20.5 12 20.5 12 20.5s7.518 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-brand-pink text-white hover:bg-white hover:text-brand-plum transition-all duration-200"
                  aria-label="Instagram"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-brand-sand bg-white py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          {menuItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            return (
              <div key={item.id} className="flex flex-col gap-2">
                <a
                  href={item.url}
                  className="font-sans font-extrabold text-sm tracking-wider hover:text-brand-pink uppercase"
                >
                  {item.title}
                </a>
                {hasChildren && (
                  <div className="pl-4 flex flex-col gap-2 border-l border-brand-sand">
                    {item.children.map((child) => (
                      <a
                        key={child.id}
                        href={child.url}
                        className="text-xs font-bold text-slate-500 hover:text-brand-pink uppercase"
                      >
                        {child.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </header>
  );
}
