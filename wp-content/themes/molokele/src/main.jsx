import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Home from './pages/Home.jsx';
import './index.css';

const headerRoot = document.getElementById('molokele-header-root');
if (headerRoot) {
  createRoot(headerRoot).render(<Header />);
}

const footerRoot = document.getElementById('molokele-footer-root');
if (footerRoot) {
  createRoot(footerRoot).render(<Footer />);
}

const root = document.getElementById('molokele-root');
if (root) {
  createRoot(root).render(<Home />);
}
