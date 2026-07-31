"""Extract and chart NSW police-recorded FDV-related assault victims, 2014–2024."""

from __future__ import annotations

import csv
from pathlib import Path

import pandas as pd
from PIL import Image, ImageDraw, ImageFont


REPO_ROOT = Path(__file__).resolve().parents[1]
SOURCE_PATH = (
    REPO_ROOT
    / "data"
    / "raw"
    / "aihw_downloads"
    / "ABS Recorded Crime Victims 2024 FDV Tables 29 to 38.xlsx"
)
OUTPUT_DIR = (
    REPO_ROOT
    / "outputs"
    / "data_analysis"
    / "recorded_crime_victims_2024"
    / "nsw_fdv_assault"
)
CSV_PATH = OUTPUT_DIR / "nsw_fdv_related_assault_2014_2024.csv"
FIGURE_PATH = OUTPUT_DIR / "nsw_fdv_related_assault_2014_2024.png"

YEARS = list(range(2014, 2025))


def extract_rows() -> list[dict[str, float | int]]:
    table = pd.read_excel(SOURCE_PATH, sheet_name="Table 30", header=None)

    # Table 30, Excel row 26 ("Persons – Assault") for New South Wales.
    # Number: Excel columns B:L; rate: M:W; FDV share: X:AH.
    source_row = 25
    counts = table.iloc[source_row, 1:12].tolist()
    rates = table.iloc[source_row, 12:23].tolist()
    shares = table.iloc[source_row, 23:34].tolist()

    rows = [
        {
            "year": year,
            "police_recorded_victims": int(count),
            "victimisation_rate_per_100k": float(rate),
            "fdv_share_of_all_assault_victims_percent": float(share),
        }
        for year, count, rate, share in zip(YEARS, counts, rates, shares)
    ]

    if len(rows) != 11:
        raise ValueError(f"Expected 11 annual observations, found {len(rows)}")
    if any(row["police_recorded_victims"] <= 0 for row in rows):
        raise ValueError("Victim counts must be positive")
    return rows


def save_csv(rows: list[dict[str, float | int]]) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with CSV_PATH.open("w", encoding="utf-8-sig", newline="") as output_file:
        writer = csv.DictWriter(output_file, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    filename = "arialbd.ttf" if bold else "arial.ttf"
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / filename), size)


def draw_chart(rows: list[dict[str, float | int]]) -> None:
    width, height = 1800, 1120
    image = Image.new("RGB", (width, height), "#FAFAF8")
    draw = ImageDraw.Draw(image)

    ink = "#202A34"
    muted = "#66717D"
    grid = "#D9DEE3"
    blue = "#177E9D"
    orange = "#D97941"

    draw.text(
        (100, 70),
        "Police records show nearly 39,000 FDV-related assault victims",
        font=font(48, bold=True),
        fill=ink,
    )
    draw.text(
        (100, 128),
        "in New South Wales in 2024",
        font=font(48, bold=True),
        fill=ink,
    )
    draw.text(
        (100, 205),
        "Number of victims recorded by police, 2014–2024",
        font=font(27),
        fill=muted,
    )

    left, top, right, bottom = 150, 315, 1690, 850
    min_y, max_y = 25_000, 40_000
    years = [int(row["year"]) for row in rows]
    values = [int(row["police_recorded_victims"]) for row in rows]

    def x_pos(year: int) -> float:
        return left + (year - years[0]) / (years[-1] - years[0]) * (right - left)

    def y_pos(value: int) -> float:
        return bottom - (value - min_y) / (max_y - min_y) * (bottom - top)

    for tick in [25_000, 30_000, 35_000, 40_000]:
        y = y_pos(tick)
        draw.line((left, y, right, y), fill=grid, width=2)
        label = f"{tick // 1000}k"
        bbox = draw.textbbox((0, 0), label, font=font(21))
        draw.text((left - 22 - (bbox[2] - bbox[0]), y - 13), label, font=font(21), fill=muted)

    for year in years:
        x = x_pos(year)
        draw.text((x - 28, bottom + 25), str(year), font=font(18), fill=muted)

    break_x = x_pos(2021)
    draw.line((break_x, top, break_x, bottom), fill=orange, width=3)
    draw.text(
        (break_x + 15, top + 12),
        "ABS comparability caution\nfrom 2021",
        font=font(19, bold=True),
        fill=orange,
        spacing=5,
    )

    points = [(x_pos(year), y_pos(value)) for year, value in zip(years, values)]
    draw.line(points, fill=blue, width=8, joint="curve")
    for x, y in points:
        draw.ellipse((x - 8, y - 8, x + 8, y + 8), fill="#FAFAF8", outline=blue, width=5)

    for index in [0, len(rows) - 1]:
        x, y = points[index]
        value = values[index]
        text = f"{value:,}"
        bbox = draw.textbbox((0, 0), text, font=font(27, bold=True))
        text_width = bbox[2] - bbox[0]
        label_x = x - text_width / 2
        draw.text((label_x, y - 52), text, font=font(27, bold=True), fill=ink)

    increase = (values[-1] / values[0] - 1) * 100
    rates = [float(row["victimisation_rate_per_100k"]) for row in rows]
    rate_increase = (rates[-1] / rates[0] - 1) * 100
    draw.rounded_rectangle((1040, 260, 1688, 330), radius=18, fill="#E8F1F3")
    draw.text(
        (1070, 279),
        f"Recorded victims increased {increase:.1f}% from 2014 to 2024",
        font=font(22, bold=True),
        fill=blue,
    )

    draw.text(
        (100, 925),
        "Interpretation: these are victims recorded by police—not all incidents of FDV or a direct measure of prevalence.",
        font=font(21),
        fill=ink,
    )
    draw.text(
        (100, 967),
        f"The victimisation rate rose from {rates[0]:.1f} to {rates[-1]:.1f} per 100,000 (+{rate_increase:.1f}%).",
        font=font(18),
        fill=muted,
    )
    draw.text(
        (100, 998),
        "ABS notes NSW FDV data from 2021 may not be comparable with earlier years. Counts are randomly adjusted",
        font=font(18),
        fill=muted,
    )
    draw.text(
        (100, 1025),
        "to protect confidentiality; small discrepancies may occur.",
        font=font(18),
        fill=muted,
    )
    draw.text(
        (100, 1065),
        "Source: Australian Bureau of Statistics, Recorded Crime – Victims 2024, Table 30. Analysis: 31 Jul 2026.",
        font=font(17),
        fill=muted,
    )

    image.save(FIGURE_PATH, quality=95)


def main() -> None:
    rows = extract_rows()
    save_csv(rows)
    draw_chart(rows)
    print(f"Wrote {CSV_PATH}")
    print(f"Wrote {FIGURE_PATH}")


if __name__ == "__main__":
    main()
