# 🏛️ Molokele WordPress Child Theme

WordPress block child theme scaffold for **Hon. Daniel Molokele** (Hwange Central MP). 

Extends the **Twenty Twenty-Five** core template via Full Site Editing (FSE) template parts, mounting a modern React 19 + Vite 8 + Tailwind CSS v4 application into the site's layout containers (`#molokele-root`, `#molokele-header-root`, and `#molokele-footer-root`).

---

## 🎨 Design System & Reference

This theme's aesthetic implements the visual layout of **Ansari (house.gov)**:
- **Primary Header**: Minimalist white navigation with bold uppercase lettering using **Red Hat Display** (Google Font).
- **Secondary Strip**: Slanted plum-colored contact bar (`#421226`) overlapping the banner image below using a custom `clip-path` mask.
- **Brand Colors**:
  - `brand-blue`: `#030F26` (Primary Navy)
  - `brand-pink`: `#FF365E` (Vibrant Pink Accent)
  - `brand-orange`: `#F9A03F` (Gold/Orange)
  - `brand-plum`: `#421226` (Slanted Strip Background)
  - `brand-sand`: `#F7F2ED` (Warm Sand/Beige)

### ✍️ Signature Script Font Overlap
To match the signature name overlay style from the reference, the Google Font **Mrs Saint Delafield** (cursive) is enqueued. 

The name banner uses absolute positioning to overlap the cursive signature `"Daniel"` on top of the bold sans-serif text `"MOLOKELE"`:
```jsx
<span className="absolute top-[-25px] left-0 font-signature text-9xl text-brand-pink leading-none transform -rotate-12 pointer-events-none select-none drop-shadow-md">
  Daniel
</span>
<h1 className="font-sans font-black text-6xl sm:text-8xl md:text-9xl text-white tracking-tighter uppercase leading-none select-none">
  Molokele
</h1>
```

---

## 📂 Images & Media
- The official hero portrait image `home_hon_molokele_official.jpg` is served from the theme's `/images/` directory.
- It has also been imported directly into the WordPress Media Library (attachment ID `77`) for reuse in block editors.

---

## 🛠️ Development & Compilation

Development commands are run from the project root (`/home/garikaib/Documents/sites/daniel`):

* **Run Dev Server**: `npm run dev`  
  Spins up the Vite development server on port 5173 with Hot Module Replacement (HMR).
* **Compile Production Build**: `npm run build`  
  Bundles and minifies the assets into `dist/molokele.css` and `dist/molokele-theme.es.js`.

The theme's `functions.php` automatically detects if the Vite server is running and enqueues the hot-reloading dev scripts or compiled production bundles accordingly.
