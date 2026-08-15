/**
 * Fetch images from the WordPress Media Library, grouped by the custom
 * `site_gallery` taxonomy (see functions.php). Used instead of hardcoding
 * image paths into the theme.
 */
import { useEffect, useState } from 'react';

const cache = new Map();

/**
 * @param {string} gallerySlug e.g. "about", "biography", "leadership", "home"
 * @returns {Promise<Array<{id: number, slug: string, alt: string, url: string, width: number, height: number}>>}
 */
export async function fetchGalleryImages(gallerySlug) {
  if (cache.has(gallerySlug)) {
    return cache.get(gallerySlug);
  }

  // Note: the media REST endpoint's orderby enum doesn't include "menu_order"
  // (unlike posts/pages) — omitted here since lookups go through findBySlug
  // anyway, so fetch order doesn't matter.
  const request = fetch(
    `/wp-json/wp/v2/media?site_gallery_slug=${encodeURIComponent(gallerySlug)}&per_page=50`
  )
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to fetch gallery "${gallerySlug}": ${res.status}`);
      return res.json();
    })
    .then((items) =>
      items.map((item) => ({
        id: item.id,
        slug: item.slug,
        alt: item.alt_text || item.title?.rendered || '',
        url: item.source_url,
        width: item.media_details?.width,
        height: item.media_details?.height,
      }))
    )
    .catch((err) => {
      console.error(err);
      return [];
    });

  cache.set(gallerySlug, request);
  return request;
}

/**
 * Convenience helper: fetch a gallery group and look up a specific image by
 * its WP slug (derived from the title set at import time), with a fallback
 * if the image isn't found or hasn't loaded yet.
 */
export function findBySlug(images, slug) {
  return images.find((img) => img.slug === slug) || null;
}

/**
 * React hook wrapper around fetchGalleryImages. Returns { images, loading }.
 */
export function useGalleryImages(gallerySlug) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchGalleryImages(gallerySlug).then((result) => {
      if (!cancelled) {
        setImages(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [gallerySlug]);

  return { images, loading };
}
