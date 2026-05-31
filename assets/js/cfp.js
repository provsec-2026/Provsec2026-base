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
      // Setting CFP page
      const cfp_json = config["cfp"];
      document.getElementById("cfp_description").innerText =
        cfp_json["description"];
      document.getElementById("cfp_title").innerText = cfp_json["title"];
      document.getElementById("cfp_instruction1").innerText =
        cfp_json["cfp_instruction1"];
      document.getElementById("cfp_sub_date").innerHTML =
  'Paper Submission: <span style="color: red;"><s>31 May, 2026 (AoE)</s></span> <strong>15 June, 2026 (AoE)</strong> (Firm Deadline)';
      document.getElementById("cfp_lncs_url").href = cfp_json["cfp_lncs_url"];
      document.getElementById("cfp_lncs_url").innerText =
        cfp_json["cfp_lncs_url"];
      document.getElementById("cfp_instruction2").innerText =
        cfp_json["cfp_instruction2"];
      document.getElementById("cfp_url").href = cfp_json["cfp_url"];
      document.getElementById("cfp_url").innerText = cfp_json["cfp_url"];
      document.getElementById("cfp_notification_date").innerText =
        cfp_json["notification_date"];
      document.getElementById("cfp_camera_ready_date").innerText =
        cfp_json["camera_ready_date"];
      document.getElementById("cfp_conference_date").innerText =
        cfp_json["conference_date"];
    })
    .fail(function (jqxhr, textStatus, error) {
      console.log("Error reading JSON file: " + error);
    });
});
