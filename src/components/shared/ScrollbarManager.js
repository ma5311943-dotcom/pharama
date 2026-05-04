"use client";

import { useEffect } from 'react';

/**
 * ScrollbarManager handles the "hide-on-stop" behavior for the global scrollbar.
 * It adds an 'is-scrolling' class to the html element whenever a scroll event is detected,
 * and removes it after a period of inactivity (1.5 seconds).
 */
export default function ScrollbarManager() {
  useEffect(() => {
    let scrollTimeout;
    const html = document.documentElement;
    const body = document.body;

    const handleScroll = () => {
      // Clear existing timeout if user is still scrolling
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Add scrolling class to show scrollbar
      if (!html.classList.contains('is-scrolling')) {
        html.classList.add('is-scrolling');
        body.classList.add('is-scrolling');
      }

      // Set timeout to remove class after 1.5 seconds of inactivity
      scrollTimeout = setTimeout(() => {
        html.classList.remove('is-scrolling');
        body.classList.remove('is-scrolling');
      }, 1500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      // Clean up class if component unmounts
      html.classList.remove('is-scrolling');
      body.classList.remove('is-scrolling');
    };
  }, []);

  return null; // This component doesn't render any UI
}
