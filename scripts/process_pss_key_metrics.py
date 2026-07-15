"""Create a tidy research dataset from selected ABS PSS workbook tables.

This is intentionally explicit: each extracted indicator lists its source sheet,
row index, columns, population and interpretation window. It is not trying to
parse every ABS table automatically yet.
"""

from __future__ import annotations

import csv
import math
from pathlib import Path
from typing import Any

import pandas as pd


REPO_ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = REPO_ROOT / "data" / "raw" / "aihw_downloads"
OUT_DIR = REPO_ROOT / "data" / "processed"
OUT_PATH = OUT_DIR / "pss_key_metrics.csv"

NATIONAL_FILE = RAW_DIR / "PSS National prevalence and time series (Tables 1 to 8).xlsx"
STATE_FILE = RAW_DIR / "PSS State and territory prevalence and time series (Tables 9 to 14).xlsx"

ABS_URL = "https://www.abs.gov.au/statistics/people/crime-and-justice/personal-safety-australia/latest-release"


def clean_value(value: Any) -> float | None:
    if value is None:
        return None
    if isinstance(value, float) and math.isnan(value):
        return None
    if isinstance(value, (int, float)):
        return float(value)
    text = str(value).strip()
    if text in {"", "—", "na", "np", "NaN"}:
        return None
    try:
        return float(text)
    except ValueError:
        return None


def clean_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, float) and math.isnan(value):
        return ""
    return str(value).strip()


def reliability_flag(rse: float | None) -> str:
    if rse is None:
        return "not_available_or_not_applicable"
    if rse < 25:
        return "generally_reliable_rse_under_25"
    if rse <= 50:
        return "use_with_caution_rse_25_to_50"
    return "too_unreliable_for_general_use_rse_over_50"


def read_sheet(path: Path, sheet_name: str) -> pd.DataFrame:
    return pd.read_excel(path, sheet_name=sheet_name, header=None)


def add_record(
    rows: list[dict[str, Any]],
    *,
    source_file: Path,
    source_sheet: str,
    source_row_zero_based: int,
    source_col_zero_based: int,
    population: str,
    sex: str,
    jurisdiction: str,
    period: str,
    experience_window: str,
    indicator: str,
    value_percent: float | None,
    rse_percent: float | None,
    notes: str = "",
) -> None:
    rows.append(
        {
            "metric_id": f"{source_sheet}_r{source_row_zero_based + 1}_c{source_col_zero_based + 1}_{sex}_{jurisdiction}_{period}".replace(" ", "_"),
            "dataset": "ABS Personal Safety Survey",
            "official_source_url": ABS_URL,
            "source_file": source_file.name,
            "source_sheet": source_sheet,
            "source_cell_row_1_based": source_row_zero_based + 1,
            "source_cell_col_1_based": source_col_zero_based + 1,
            "population": population,
            "sex": sex,
            "jurisdiction": jurisdiction,
            "period": period,
            "reference_period": "2021-22 release, released 2023-03-15",
            "experience_window": experience_window,
            "indicator": indicator,
            "value_percent": value_percent,
            "rse_percent": rse_percent,
            "reliability_flag": reliability_flag(rse_percent),
            "unit": "percent",
            "notes": notes,
        }
    )


def extract_national_lifetime(rows: list[dict[str, Any]]) -> None:
    value_sheet = "Table 1.3"
    rse_sheet = "Table 1.4"
    values = read_sheet(NATIONAL_FILE, value_sheet)
    rses = read_sheet(NATIONAL_FILE, rse_sheet)
    columns = {1: "Females", 2: "Males", 3: "Persons"}
    indicators = {
        9: "Sexual assault since age 15",
        15: "Total sexual violence since age 15",
        26: "Total physical violence since age 15",
        37: "Total violence since age 15",
    }
    for row_idx, indicator in indicators.items():
        for col_idx, sex in columns.items():
            add_record(
                rows,
                source_file=NATIONAL_FILE,
                source_sheet=value_sheet,
                source_row_zero_based=row_idx,
                source_col_zero_based=col_idx,
                population="Persons aged 18 years and over",
                sex=sex,
                jurisdiction="Australia",
                period="Since age 15",
                experience_window="Since age 15",
                indicator=indicator,
                value_percent=clean_value(values.iat[row_idx, col_idx]),
                rse_percent=clean_value(rses.iat[row_idx, col_idx]),
            )


def extract_national_recent(rows: list[dict[str, Any]]) -> None:
    value_sheet = "Table 2.3"
    rse_sheet = "Table 2.4"
    values = read_sheet(NATIONAL_FILE, value_sheet)
    rses = read_sheet(NATIONAL_FILE, rse_sheet)
    columns = {1: "Females", 2: "Males"}
    indicators = {
        9: "Total sexual violence in the last 12 months",
        18: "Total physical violence in the last 12 months",
        29: "Total violence in the last 12 months",
        36: "Intimate partner or family member violence in the last 12 months",
        37: "Intimate partner violence in the last 12 months",
        38: "Cohabiting partner violence in the last 12 months",
        39: "Boyfriend/girlfriend/date violence in the last 12 months",
    }
    for row_idx, indicator in indicators.items():
        for col_idx, sex in columns.items():
            add_record(
                rows,
                source_file=NATIONAL_FILE,
                source_sheet=value_sheet,
                source_row_zero_based=row_idx,
                source_col_zero_based=col_idx,
                population="Persons aged 18 years and over",
                sex=sex,
                jurisdiction="Australia",
                period="2021-22",
                experience_window="Last 12 months",
                indicator=indicator,
                value_percent=clean_value(values.iat[row_idx, col_idx]),
                rse_percent=clean_value(rses.iat[row_idx, col_idx]),
            )


def extract_national_time_series(rows: list[dict[str, Any]]) -> None:
    value_sheet = "Table 3.1"
    rse_sheet = "Table 3.2"
    values = read_sheet(NATIONAL_FILE, value_sheet)
    rses = read_sheet(NATIONAL_FILE, rse_sheet)
    female_columns = {1: "1996", 2: "2005", 3: "2012", 4: "2016", 5: "2021-22"}
    male_columns = {6: "2005", 7: "2012", 8: "2016", 9: "2021-22"}
    indicators = {
        10: "Total sexual violence in the last 12 months",
        15: "Total physical violence in the last 12 months",
        20: "Total violence in the last 12 months",
        25: "Intimate partner violence in the last 12 months",
        31: "Cohabiting partner violence in the last 12 months",
        34: "Cohabiting partner emotional abuse in the last 12 months",
        39: "Sexual harassment in the last 12 months",
        48: "Stalking in the last 12 months",
    }
    for row_idx, indicator in indicators.items():
        for col_idx, period in female_columns.items():
            add_record(
                rows,
                source_file=NATIONAL_FILE,
                source_sheet=value_sheet,
                source_row_zero_based=row_idx,
                source_col_zero_based=col_idx,
                population="Persons aged 18 years and over",
                sex="Females",
                jurisdiction="Australia",
                period=period,
                experience_window="Last 12 months",
                indicator=indicator,
                value_percent=clean_value(values.iat[row_idx, col_idx]),
                rse_percent=clean_value(rses.iat[row_idx, col_idx]),
                notes="Some ABS time-series indicators have comparability cautions; check table footnotes.",
            )
        for col_idx, period in male_columns.items():
            add_record(
                rows,
                source_file=NATIONAL_FILE,
                source_sheet=value_sheet,
                source_row_zero_based=row_idx,
                source_col_zero_based=col_idx,
                population="Persons aged 18 years and over",
                sex="Males",
                jurisdiction="Australia",
                period=period,
                experience_window="Last 12 months",
                indicator=indicator,
                value_percent=clean_value(values.iat[row_idx, col_idx]),
                rse_percent=clean_value(rses.iat[row_idx, col_idx]),
                notes="Some ABS time-series indicators have comparability cautions; check table footnotes.",
            )


def extract_state_women_since_15(rows: list[dict[str, Any]]) -> None:
    value_sheet = "Table 9.3"
    rse_sheet = "Table 9.4"
    values = read_sheet(STATE_FILE, value_sheet)
    rses = read_sheet(STATE_FILE, rse_sheet)
    jurisdictions = {
        1: "New South Wales",
        2: "Victoria",
        3: "Queensland",
        4: "South Australia",
        5: "Western Australia",
        6: "Tasmania",
        7: "Northern Territory",
        8: "Australian Capital Territory",
        9: "Australia",
    }
    indicators = {
        7: "Total violence since age 15",
        8: "Sexual violence since age 15",
        9: "Physical violence since age 15",
        11: "Intimate partner or family member violence since age 15",
        12: "Intimate partner violence since age 15",
        14: "Violence or emotional/economic abuse by a cohabiting partner since age 15",
        15: "Cohabiting partner violence since age 15",
        16: "Cohabiting partner emotional abuse since age 15",
        17: "Cohabiting partner economic abuse since age 15",
        19: "Sexual harassment since age 15",
        21: "Stalking since age 15",
    }
    for row_idx, indicator in indicators.items():
        for col_idx, jurisdiction in jurisdictions.items():
            add_record(
                rows,
                source_file=STATE_FILE,
                source_sheet=value_sheet,
                source_row_zero_based=row_idx,
                source_col_zero_based=col_idx,
                population="Women aged 18 years and over",
                sex="Women",
                jurisdiction=jurisdiction,
                period="Since age 15",
                experience_window="Since age 15",
                indicator=indicator,
                value_percent=clean_value(values.iat[row_idx, col_idx]),
                rse_percent=clean_value(rses.iat[row_idx, col_idx]),
                notes="State/territory refers to current residence, not necessarily where the experience occurred.",
            )


def main() -> None:
    rows: list[dict[str, Any]] = []
    extract_national_lifetime(rows)
    extract_national_recent(rows)
    extract_national_time_series(rows)
    extract_state_women_since_15(rows)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    fieldnames = list(rows[0].keys())
    with OUT_PATH.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Wrote {len(rows)} rows")
    print(OUT_PATH)


if __name__ == "__main__":
    main()
