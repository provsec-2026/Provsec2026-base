import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / "config" / "committee.json").read_text(encoding="utf-8"))
pc = sorted(data["committee"]["program_committee"], key=lambda m: m["Last Name"])

lines = ['      <h2 class="mb-3 fw-bold mt-4">Program Committee</h2>', '      <div id="program_committee_list" class="committee-pc-grid">']
for member in pc:
    name = f"{member['First Name']} {member['Last Name']}".strip()
    aff = member["Affiliation"]
    country = member["Country"]
    org = f"{aff}, {country}" if aff and country else aff or country or ""
    lines.append('        <div class="committee-pc-member">')
    lines.append(f'          <div class="committee-member-name">{name}</div>')
    lines.append(f'          <div class="committee-member-affiliation">{org}</div>')
    lines.append("        </div>")
lines.append("      </div>")

html_path = ROOT / "committee.html"
content = html_path.read_text(encoding="utf-8")
start = content.index('      <p class="h2 mb-2 fw-bold">Program Committee</p>')
end = content.index("    </div>\n  </div>\n  <div id=\"footer\">")
new_block = "\n".join(lines) + "\n"
html_path.write_text(content[:start] + new_block + content[end:], encoding="utf-8")
print(f"Updated Program Committee section with {len(pc)} members")
