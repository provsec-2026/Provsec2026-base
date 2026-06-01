from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
html_path = ROOT / "committee.html"
fallback = (ROOT / "scripts" / "pc_fallback.html").read_text(encoding="utf-8")
parts = fallback.split("<!-- orgs -->")
names = parts[0].replace("<!-- names -->", "").strip()
orgs = parts[1].strip()
content = html_path.read_text(encoding="utf-8")
old = """      <p class="h2 mb-2 fw-bold">Program Committee</p>
      <p class="h5 text-body-secondary mb-2">To be announced.</p>
      <div class="col-md-4" id="program_committee_name">

      </div>
      <div class="col-md-8" id="program_committee_org"></div>"""
new = f"""      <p class="h2 mb-2 fw-bold">Program Committee</p>
      <div class="col-md-4" id="program_committee_name">
{names}
      </div>
      <div class="col-md-8" id="program_committee_org">
{orgs}
      </div>"""
if old not in content:
    raise SystemExit("Expected Program Committee block not found in committee.html")
html_path.write_text(content.replace(old, new), encoding="utf-8")
print("committee.html updated")
