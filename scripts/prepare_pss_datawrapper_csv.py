"""Create Datawrapper-ready CSV files for the ABS PSS state maps."""

from __future__ import annotations

import csv
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
INPUT_PATH = REPO_ROOT / "data" / "processed" / "pss_key_metrics.csv"
OUTPUT_DIR = (
    REPO_ROOT
    / "outputs"
    / "data_analysis"
    / "pss_2021_22"
    / "datawrapper"
)

STATE_CODES = {
    "New South Wales": "NSW",
    "Victoria": "VIC",
    "Queensland": "QLD",
    "South Australia": "SA",
    "Western Australia": "WA",
    "Tasmania": "TAS",
    "Northern Territory": "NT",
    "Australian Capital Territory": "ACT",
}

INDICATORS = {
    "Total violence since age 15": (
        "01_total_violence",
        "Total violence since age 15",
        "自15岁以来经历总体暴力",
    ),
    "Physical violence since age 15": (
        "02_physical_violence",
        "Physical violence since age 15",
        "自15岁以来经历身体暴力",
    ),
    "Sexual violence since age 15": (
        "03_sexual_violence",
        "Sexual violence since age 15",
        "自15岁以来经历性暴力",
    ),
    "Intimate partner or family member violence since age 15": (
        "04_partner_family_violence",
        "Partner or family member violence since age 15",
        "自15岁以来经历伴侣或家庭成员暴力",
    ),
    "Intimate partner violence since age 15": (
        "05_intimate_partner_violence",
        "Intimate partner violence since age 15",
        "自15岁以来经历亲密伴侣暴力",
    ),
    "Cohabiting partner emotional abuse since age 15": (
        "06_emotional_abuse",
        "Cohabiting partner emotional abuse since age 15",
        "自15岁以来经历同居伴侣情感虐待",
    ),
}

OUTPUT_FIELDS = [
    "state_name",
    "state_code",
    "value_percent",
    "rse_percent",
]


def main() -> None:
    with INPUT_PATH.open(encoding="utf-8-sig", newline="") as source_file:
        source_rows = list(csv.DictReader(source_file))

    selected = [
        row
        for row in source_rows
        if row["source_sheet"] == "Table 9.3"
        and row["sex"] == "Women"
        and row["jurisdiction"] in STATE_CODES
        and row["indicator"] in INDICATORS
    ]

    if len(selected) != 48:
        raise ValueError(f"Expected 48 state-indicator rows, found {len(selected)}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for source_indicator, (slug, _label_en, _label_zh) in INDICATORS.items():
        indicator_rows = []
        for row in selected:
            if row["indicator"] != source_indicator:
                continue
            output_row = {
                "state_name": row["jurisdiction"],
                "state_code": STATE_CODES[row["jurisdiction"]],
                "value_percent": row["value_percent"],
                "rse_percent": row["rse_percent"],
            }
            indicator_rows.append(output_row)

        if len(indicator_rows) != 8:
            raise ValueError(f"{source_indicator}: expected 8 jurisdictions")

        output_path = OUTPUT_DIR / f"{slug}.csv"
        with output_path.open("w", encoding="utf-8-sig", newline="") as output_file:
            writer = csv.DictWriter(output_file, fieldnames=OUTPUT_FIELDS)
            writer.writeheader()
            writer.writerows(indicator_rows)

    print(f"Created 6 map CSV files in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
