# molokele

WordPress child theme scaffold for Hon. Daniel Molokele (Hwange Central MP). Extends **Twenty Twenty-Five** via Full Site Editing template parts, with React 19 + Vite 8 + Tailwind CSS v4 mounted into `#molokele-root` / `#molokele-header-root` / `#molokele-footer-root`.

## Development

From the site root (`/home/garikaib/Documents/sites/daniel`):

- `npm run dev` — Vite dev server on port 5173 with HMR.
- `npm run build` — production bundle into `dist/`.

`functions.php` auto-detects whether the Vite dev server is reachable and enqueues dev or built assets accordingly.
