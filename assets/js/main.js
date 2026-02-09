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
      document.getElementById("date").innerText = index_json["date"];
      document.getElementById("hoster").innerText = index_json["location"];
    })
    .fail(function (jqxhr, textStatus, error) {
      console.log("Error reading JSON file: " + error);
    });
});
