import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

function App() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Molokele Tools</h1>
      <p className="mt-2 text-sm text-gray-600">Admin scaffold is ready. No modules configured yet.</p>
    </div>
  );
}

const root = document.getElementById('molokele-tools-root');
if (root) {
  createRoot(root).render(<App />);
}
