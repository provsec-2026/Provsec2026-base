import json
import re
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[2]
XLSX = ROOT / "pc_2026-05-31_1780213055.xlsx"
OUT = Path(__file__).resolve().parents[1] / "config" / "committee.json"

MISSING_AFFILIATIONS = {
    ("Khoa", "Nguyen"): "University of Wollongong",
    ("Rupeng", "Yang"): "University of Wollongong",
}

AFFILIATION_CLEAN = {
    ("Hui", "Cui"): "Monash University",
    ("Yu", "Chen"): "Shandong University",
    ("Fagen", "Li"): "University of Electronic Science and Technology of China",
    ("Xianhui", "Lu"): "Institute of Information Engineering, Chinese Academy of Sciences",
    ("Weizhi", "Meng"): "Lancaster University",
    ("Zuoxia", "Yu"): "The Hong Kong Polytechnic University",
    ("Junaid", "Haseeb"): "University of Waikato",
}


def infer_country(affiliation: str) -> str:
    aff = affiliation.lower()
    if "united kingdom" in aff:
        return "United Kingdom"
    if "delft" in aff and "turku" in aff:
        return "Netherlands and Finland"
    if "hong kong" in aff or "polytechnic university" in aff:
        return "Hong Kong SAR"
    if any(
        k in aff
        for k in (
            "wollongong",
            "monash",
            "csiro",
            "rmit",
            "griffith",
            "waikato",
            "queensland",
        )
    ):
        return "Australia"
    if "singapore management" in aff:
        return "Singapore"
    if any(k in aff for k in ("kanazawa", "kyushu", "fukui", "electro-communications")):
        return "Japan"
    if "surrey" in aff or "lancaster" in aff:
        return "United Kingdom"
    if "north texas" in aff:
        return "United States"
    if "tu wien" in aff:
        return "Austria"
    if "delft" in aff:
        return "Netherlands"
    if "indian statistical" in aff:
        return "India"
    if "bundeswehr" in aff:
        return "Germany"
    if "yang ming chiao" in aff:
        return "Taiwan"
    if "waterloo" in aff:
        return "Canada"
    if any(
        k in aff
        for k in (
            "xidian",
            "shandong",
            "east china normal",
            "southeast university",
            "shanghai jiao tong",
            "hubei university",
            "guangdong university",
            "chinese academy",
            "electronic science",
            "institute of information engineering",
        )
    ):
        return "China"
    return "Unknown"


def load_program_committee():
    wb = openpyxl.load_workbook(XLSX)
    ws = wb.active
    members = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        first, last, aff, _role = row
        if not first or not last:
            continue
        first = str(first).strip()
        last = str(last).strip()
        key = (first, last)
        if key in MISSING_AFFILIATIONS:
            aff = MISSING_AFFILIATIONS[key]
        elif key in AFFILIATION_CLEAN:
            aff = AFFILIATION_CLEAN[key]
        elif aff:
            aff = re.sub(r"\s+", " ", str(aff).replace("\n", " ")).strip()
        else:
            aff = ""
        country = infer_country(aff)
        members.append(
            {
                "First Name": first,
                "Last Name": last,
                "Affiliation": aff,
                "Country": country,
            }
        )
    return members


def static_pc_html(pc):
    sorted_pc = sorted(pc, key=lambda m: m["Last Name"])
    name_lines = []
    org_lines = []
    for member in sorted_pc:
        name = f"{member['First Name']} {member['Last Name']}".strip()
        org = f"{member['Affiliation']}, {member['Country']}"
        name_lines.append(f'        <p class="h4 mb-1">{name}</p>')
        org_lines.append(f'        <p class="h4 mb-1">{org}</p>')
    return "\n".join(name_lines), "\n".join(org_lines)


def main():
    existing = json.loads(OUT.read_text(encoding="utf-8"))
    pc = load_program_committee()
    issues = [m for m in pc if not m["Affiliation"] or m["Country"] == "Unknown"]
    if issues:
        raise SystemExit(f"Unresolved entries: {issues}")
    existing["committee"]["program_committee"] = pc
    OUT.write_text(json.dumps(existing, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(pc)} program committee members to {OUT}")

    csv_path = OUT.parent.parent / "committee.csv"
    csv_lines = ["First Name,Last Name,Affiliation,Country"]
    for member in sorted(pc, key=lambda m: m["Last Name"]):
        csv_lines.append(
            f"{member['First Name']},{member['Last Name']},{member['Affiliation']},{member['Country']}"
        )
    csv_path.write_text("\n".join(csv_lines) + "\n", encoding="utf-8")
    print(f"Wrote {len(pc)} rows to {csv_path}")

    names_html, orgs_html = static_pc_html(pc)
    fallback_path = Path(__file__).resolve().parent / "pc_fallback.html"
    fallback_path.write_text(
        f"<!-- names -->\n{names_html}\n<!-- orgs -->\n{orgs_html}\n",
        encoding="utf-8",
    )
    print(f"Wrote static fallback snippet to {fallback_path}")


if __name__ == "__main__":
    main()
