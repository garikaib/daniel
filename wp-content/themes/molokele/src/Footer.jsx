import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-ink/10 bg-paper text-ink">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-ink/70">
        &copy; {year} Molokele. All rights reserved.
      </div>
    </footer>
  );
}
