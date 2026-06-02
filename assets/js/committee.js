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
  $.getJSON("config/committee.json", { mode: "no-cors" })
    .done(function (config) {
      // Define a function to process committee data
      function renderProgramCommittee(data) {
        const container = document.getElementById("program_committee_list");
        if (!container) return;
        container.innerHTML = "";
        data.forEach((member) => {
          const {
            "First Name": fName,
            "Last Name": lName,
            Affiliation: affiliation,
            Country: country,
          } = member;
          const name = `${fName} ${lName}`.trim();
          const org_name =
            affiliation && country
              ? `${affiliation}, ${country}`
              : affiliation || country || "";

          const item = document.createElement("div");
          item.className = "committee-pc-row";

          const nameEl = document.createElement("div");
          nameEl.className = "committee-member-name";
          nameEl.innerText = name;

          const orgEl = document.createElement("div");
          orgEl.className = "committee-member-affiliation";
          orgEl.innerText = org_name;

          item.appendChild(nameEl);
          item.appendChild(orgEl);
          container.appendChild(item);
        });
      }

      // Process different committee types
      const committeeJson = config["committee"];
      const program_committee = committeeJson["program_committee"];
      // sort by last name
      program_committee.sort((a, b) =>
        a["Last Name"].localeCompare(b["Last Name"])
      );
      renderProgramCommittee(program_committee || []);
    })
    .fail(function (jqxhr, textStatus, error) {
      console.log("Error reading JSON file: " + error);
    });
});
