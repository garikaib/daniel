import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';

const pluginDir = import.meta.dirname;

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5174,
    strictPort: true,
    // wp-admin is served from https://daniel.ddev.site while Vite serves
    // module scripts from localhost:5174 — cross-origin <script type="module">
    // requests always go through CORS, so the dev server needs to allow it.
    cors: true,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    lib: {
      entry: path.resolve(pluginDir, 'src/admin/main.jsx'),
      name: 'MolokeleTools',
      formats: ['es'],
    },
    outDir: path.resolve(pluginDir, 'dist'),
    rollupOptions: {
      output: {
        entryFileNames: 'molokele-tools.js',
        assetFileNames: (assetInfo) => (assetInfo.name && assetInfo.name.endsWith('.css') ? 'molokele-tools.css' : '[name]-[hash][extname]'),
      },
    },
  },
});
