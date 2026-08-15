import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Biography from './pages/Biography.jsx';
import Leadership from './pages/Leadership.jsx';
import Family from './pages/Family.jsx';
import InParliament from './pages/InParliament.jsx';
import NewsMedia from './pages/NewsMedia.jsx';
import Contact from './pages/Contact.jsx';
import CdfTracker from './pages/CdfTracker.jsx';
import SinglePost from './pages/SinglePost.jsx';
import GenericPage from './pages/GenericPage.jsx';
import NotFound from './pages/NotFound.jsx';
import initPageTransitions from './PageLoader.jsx';
import './index.css';

const headerRoot = document.getElementById('molokele-header-root');
if (headerRoot) {
  createRoot(headerRoot).render(<Header />);
}

const footerRoot = document.getElementById('molokele-footer-root');
if (footerRoot) {
  createRoot(footerRoot).render(<Footer />);
}

// Minimal slug-based routing — each WP page's post_name (localized as
// pageSlug) picks which React page component mounts into #molokele-root.
// Add new entries here as more page components are built.
const pages = {
  about: About,
  contact: Contact,
  biography: Biography,
  'leadership-roles': Leadership,
  'family-personal': Family,
  'in-parliament': InParliament,
  'health-mental-health': InParliament,
  'gender-equality-womens-rights': InParliament,
  'environment-mining-energy': InParliament,
  'labour-workers-rights': InParliament,
  'disability-rights': InParliament,
  'culture-heritage': InParliament,
  'news-media': NewsMedia,
  'press-coverage': NewsMedia,
  speeches: NewsMedia,
  'community-updates': NewsMedia,
  'photo-gallery': NewsMedia,
  'cdf-tracker': CdfTracker,
};

const root = document.getElementById('molokele-root');
if (root) {
  const slug = window.molokeleThemeData?.pageSlug;
  const isSinglePost = window.molokeleThemeData?.isSinglePost;
  const isPage = window.molokeleThemeData?.isPage;
  const isFrontPage = window.molokeleThemeData?.isFrontPage;
  const is404 = window.molokeleThemeData?.is404;

  // Priority: a genuine 404 always wins, then a page with a bespoke
  // component, then the real front page, then WP single posts, then any
  // other WP Page falls back to a generic on-brand renderer instead of
  // silently showing the homepage.
  let PageComponent;
  if (is404) {
    PageComponent = NotFound;
  } else if (pages[slug]) {
    PageComponent = pages[slug];
  } else if (isFrontPage) {
    PageComponent = Home;
  } else if (isSinglePost) {
    PageComponent = SinglePost;
  } else if (isPage) {
    PageComponent = GenericPage;
  } else {
    PageComponent = Home;
  }

  createRoot(root).render(<PageComponent />);
}

// Fade the branded preloader out now that the app has mounted, and re-arm it
// on internal link clicks so the next page's own preloader picks up right
// where this one left off.
initPageTransitions();
