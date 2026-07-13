$(document).ready(function () {
  // Load header
  fetch("partial/header.html", { mode: "no-cors" })
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header").innerHTML = data;
    });

  // Load footer set no-cors to avoid CORS error
  fetch("partial/footer.html", { mode: "no-cors" })
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer").innerHTML = data;
    });
  $.getJSON("config/data.json", { mode: "no-cors" })
    .done(function (config) {
      //-- setting index.html -- Get title, subtitle, location, date, and hoster from the JSON file
      const index_json = config["index"];
      // Set title, subtitle, location, date, and hoster to HTML by id
      document.getElementById("title").innerText = index_json["title"];
      document.getElementById("subtitle").innerText = index_json["subtitle"];
      var dateEl = document.getElementById("date");
      var hosterEl = document.getElementById("hoster");
      if (dateEl) dateEl.innerText = index_json["date"];
      if (hosterEl) hosterEl.innerText = index_json["location"];
    })
    .fail(function (jqxhr, textStatus, error) {
      console.log("Error reading JSON file: " + error);
    });

  // Conference countdown next to hero date (start of conference: 24 Sep 2026)
  (function () {
    var el = document.getElementById("conference-countdown");
    if (!el) return;
    var now = new Date();
    var target = new Date(2026, 8, 24);
    target.setHours(0, 0, 0, 0);
    var days = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (days > 0) {
      el.textContent = "(" + days + " day" + (days === 1 ? "" : "s") + " left)";
    } else if (days === 0) {
      el.textContent = "(starts today)";
    } else if (days >= -2) {
      el.textContent = "(ongoing)";
    } else {
      el.textContent = "";
    }
  })();
});
