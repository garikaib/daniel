# molokele-tools

Utility plugin scaffold for Hon. Daniel Molokele (Whange Central MP). Adds a "Molokele Tools" admin page mounted with React 19 + Vite 8 + Tailwind CSS v4.

## Build commands (from repo root, i.e. `/home/garikaib/Documents/sites/daniel`)

- `npm run dev:tools` — Vite dev server on port 5174 with HMR.
- `npm run build:tools` — production bundle into `dist/`.

## Architecture

- `molokele-tools.php` bootstraps `Molokele_Loader` (singleton) and registers the admin page + asset enqueue.
- `includes/class-molokele-loader.php` requires `includes/utils/` and initializes any `includes/modules/class-*.php` feature modules.
- `src/admin/main.jsx` mounts into `#molokele-tools-root`.
