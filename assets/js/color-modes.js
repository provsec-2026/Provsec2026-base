/*!
 * Color mode lock for ProvSec 2026
 * Site is authored for a light academic theme. Always force light so
 * OS / browser night mode does not invert Bootstrap tokens and break
 * readability (e.g. dark dropdown backgrounds with dark text).
 */

(() => {
  "use strict";

  const forceLight = () => {
    document.documentElement.setAttribute("data-bs-theme", "light");
    try {
      localStorage.setItem("theme", "light");
    } catch (e) {
      /* ignore */
    }
  };

  forceLight();

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", forceLight);

  window.addEventListener("DOMContentLoaded", forceLight);
})();
