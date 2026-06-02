import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
html_path = ROOT / "committee.html"
content = html_path.read_text(encoding="utf-8")

# Chair cards: replace paired strong tags with semantic divs
content = re.sub(
    r'<div class="col p-4 d-flex flex-column position-static">\s*'
    r'<strong class="d-inline-block mb-2 text-primary-emphasis">([^<]+)</strong>\s*'
    r'<strong class="d-inline-block mb-2 text-primary-emphasis">([^<]+)</strong>\s*'
    r"</div>",
    r'<div class="col p-4 d-flex flex-column position-static committee-chair-card">\n'
    r'          <div class="committee-member-name">\1</div>\n'
    r'          <div class="committee-member-affiliation">\2</div>\n'
    r"        </div>",
    content,
    flags=re.MULTILINE,
)

data = json.loads((ROOT / "config" / "committee.json").read_text(encoding="utf-8"))
pc = sorted(data["committee"]["program_committee"], key=lambda m: m["Last Name"])

pc_lines = [
    '      <h2 class="mb-3 fw-bold mt-4">Program Committee</h2>',
    '      <div id="program_committee_list" class="committee-pc-list">',
]
for member in pc:
    name = f"{member['First Name']} {member['Last Name']}".strip()
    aff = member["Affiliation"]
    country = member["Country"]
    org = f"{aff}, {country}" if aff and country else aff or country or ""
    pc_lines.extend(
        [
            '        <div class="committee-pc-row">',
            f'          <div class="committee-member-name">{name}</div>',
            f'          <div class="committee-member-affiliation">{org}</div>',
            "        </div>",
        ]
    )
pc_lines.append("      </div>")
pc_block = "\n".join(pc_lines) + "\n"

start = content.index('      <h2 class="mb-3 fw-bold mt-4">Program Committee</h2>')
end = content.index("    </div>\n  </div>\n  <div id=\"footer\">")
content = content[:start] + pc_block + content[end:]

html_path.write_text(content, encoding="utf-8")
print(f"Updated committee.html ({len(pc)} PC rows, chair cards converted)")
