(function () {
  function currentPage() {
    var page = window.location.pathname.split("/").pop();
    return !page ? "index.html" : page;
  }

  function markActiveNav(root) {
    var page = currentPage();
    var activeGroup = null;

    root.querySelectorAll("[data-nav-page]").forEach(function (link) {
      if (link.getAttribute("data-nav-page") === page) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
        activeGroup = link.getAttribute("data-nav-group");
      }
    });

    if (activeGroup) {
      root.querySelectorAll('[data-nav-group="' + activeGroup + '"]').forEach(function (node) {
        node.classList.add("group-active");
      });
    }
  }

  function renderNav(mount, html) {
    mount.innerHTML = html;
    markActiveNav(mount);
  }

  function initSiteNav() {
    var mount = document.getElementById("site-nav");
    if (!mount) return;

    fetch("partial/nav.html?v=15")
      .then(function (response) {
        if (!response.ok) throw new Error("nav fetch failed");
        return response.text();
      })
      .then(function (html) {
        renderNav(mount, html);
      })
      .catch(function () {
        renderNav(mount, FALLBACK_NAV_HTML);
      });
  }

  var FALLBACK_NAV_HTML =
    '<div class="site-nav-shell">' +
    '<div class="site-nav-bar">' +
    '<button class="site-nav-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#siteNavCollapse" aria-controls="siteNavCollapse" aria-expanded="false" aria-label="Toggle navigation"><span class="site-nav-toggler-icon"></span></button>' +
    '<div class="collapse site-nav-collapse" id="siteNavCollapse">' +
    '<nav class="site-nav-menu" aria-label="Main navigation">' +
    '<a class="site-nav-link" href="index.html" data-nav-page="index.html" data-nav-group="home">Home</a>' +
    '<div class="dropdown site-nav-dropdown" data-nav-group="papers">' +
    '<a class="site-nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Papers</a>' +
    '<ul class="dropdown-menu site-nav-dropdown-menu">' +
    '<li><a class="dropdown-item site-nav-dropdown-item" href="cfp.html" data-nav-page="cfp.html" data-nav-group="papers">Call For Papers</a></li>' +
    '<li><a class="dropdown-item site-nav-dropdown-item" href="accepted-papers.html" data-nav-page="accepted-papers.html" data-nav-group="papers">Accepted Papers</a></li>' +
    "</ul></div>" +
    '<div class="dropdown site-nav-dropdown" data-nav-group="people">' +
    '<a class="site-nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">People</a>' +
    '<ul class="dropdown-menu site-nav-dropdown-menu">' +
    '<li><a class="dropdown-item site-nav-dropdown-item" href="keynotes.html" data-nav-page="keynotes.html" data-nav-group="people">Keynotes</a></li>' +
    '<li><a class="dropdown-item site-nav-dropdown-item" href="committee.html" data-nav-page="committee.html" data-nav-group="people">Committees</a></li>' +
    "</ul></div>" +
    '<a class="site-nav-link" href="registration.html" data-nav-page="registration.html" data-nav-group="register">Register</a>' +
    '<a class="site-nav-link" href="venue.html" data-nav-page="venue.html" data-nav-group="venue">Venue</a>' +
    '<a class="site-nav-link" href="program.html" data-nav-page="program.html" data-nav-group="program">Program</a>' +
    "</nav></div></div></div>";

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSiteNav);
  } else {
    initSiteNav();
  }
})();
