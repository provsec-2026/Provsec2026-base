(function () {
  function currentPage() {
    var page = window.location.pathname.split("/").pop();
    return !page ? "index.html" : page;
  }

  function markActiveNav(root) {
    var page = currentPage();
    root.querySelectorAll("[data-nav-page]").forEach(function (link) {
      if (link.getAttribute("data-nav-page") === page) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  var NAV_HTML =
    '<nav class="site-nav-scroll" aria-label="Main navigation">' +
    '<div class="site-nav-scroll-inner">' +
    '<a class="site-nav-link" href="index.html" data-nav-page="index.html">Home</a>' +
    '<a class="site-nav-link" href="cfp.html" data-nav-page="cfp.html">Call For Papers</a>' +
    '<a class="site-nav-link" href="committee.html" data-nav-page="committee.html">Committees</a>' +
    '<a class="site-nav-link" href="registration.html" data-nav-page="registration.html">Registration</a>' +
    '<a class="site-nav-link" href="accepted-papers.html" data-nav-page="accepted-papers.html">Accepted Papers</a>' +
    '<a class="site-nav-link" href="program.html" data-nav-page="program.html">Program</a>' +
    '<a class="site-nav-link" href="venue.html" data-nav-page="venue.html">Venue</a>' +
    '<a class="site-nav-link" href="keynotes.html" data-nav-page="keynotes.html">Keynotes</a>' +
    '</div></nav>';

  function renderNav(mount, html) {
    mount.innerHTML = html;
    markActiveNav(mount);
  }

  function initSiteNav() {
    var mount = document.getElementById("site-nav");
    if (!mount) return;

    fetch("partial/nav.html")
      .then(function (response) {
        if (!response.ok) throw new Error("nav fetch failed");
        return response.text();
      })
      .then(function (html) {
        renderNav(mount, html);
      })
      .catch(function () {
        renderNav(mount, NAV_HTML);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSiteNav);
  } else {
    initSiteNav();
  }
})();
