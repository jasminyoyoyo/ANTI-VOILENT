"""Prepare chart 02: women who temporarily separated from a violent former partner."""

from __future__ import annotations

import csv
from pathlib import Path

import openpyxl
from PIL import Image, ImageDraw, ImageFont


REPO_ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = REPO_ROOT / "data" / "raw" / "abs" / "partner_violence_2021_22"
SOURCE_PATH = next(SOURCE_DIR.glob("*Tables 5 to 19*.xlsx"))
OUTPUT_DIR = (
    REPO_ROOT
    / "outputs"
    / "data_analysis"
    / "why_not_leave"
    / "chart_02_temporary_separation"
)
CSV_PATH = OUTPUT_DIR / "chart_02_datawrapper.csv"
DETAIL_PATH = OUTPUT_DIR / "chart_02_source_detail.csv"
FIGURE_PATH = OUTPUT_DIR / "chart_02_temporary_separation.png"
ILLUSTRATION_PATH = OUTPUT_DIR / "chart_02_illustration_source.png"
ILLUSTRATED_FIGURE_PATH = OUTPUT_DIR / "chart_02_illustrated.png"


def read_source() -> dict[str, float]:
    workbook = openpyxl.load_workbook(SOURCE_PATH, data_only=True, read_only=True)
    estimates = workbook["Table 18.1"]
    errors = workbook["Table 18.2"]

    values = {
        "cohort_thousands": float(estimates["B15"].value),
        "temporarily_separated_thousands": float(estimates["B7"].value),
        "temporarily_separated_percent": float(estimates["C7"].value),
        "temporarily_separated_estimate_rse": float(errors["B7"].value),
        "temporarily_separated_proportion_rse": float(errors["C7"].value),
        "once_thousands": float(estimates["B12"].value),
        "once_percent": float(estimates["C12"].value),
        "once_estimate_rse": float(errors["B12"].value),
        "once_proportion_rse": float(errors["C12"].value),
        "more_than_once_thousands": float(estimates["B8"].value),
        "more_than_once_percent": float(estimates["C8"].value),
        "more_than_once_estimate_rse": float(errors["B8"].value),
        "more_than_once_proportion_rse": float(errors["C8"].value),
        "not_separated_thousands": float(estimates["B13"].value),
        "not_separated_percent": float(estimates["C13"].value),
    }

    expected = {
        "cohort_thousands": 1364.7,
        "temporarily_separated_thousands": 583.8,
        "temporarily_separated_percent": 42.8,
    }
    for key, expected_value in expected.items():
        if values[key] != expected_value:
            raise ValueError(f"Unexpected ABS value for {key}: {values[key]}")
    return values


def write_csvs(values: dict[str, float]) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Three nested stages on the same denominator and a fixed 0-100% scale.
    with CSV_PATH.open("w", encoding="utf-8-sig", newline="") as output_file:
        writer = csv.DictWriter(
            output_file,
            fieldnames=["metric", "proportion_percent", "estimate_women"],
        )
        writer.writeheader()
        writer.writerows(
            [
                {
                    "metric": "Experienced violence while living together",
                    "proportion_percent": 100,
                    "estimate_women": int(values["cohort_thousands"] * 1000),
                },
                {
                    "metric": "Temporarily separated",
                    "proportion_percent": values["temporarily_separated_percent"],
                    "estimate_women": int(values["temporarily_separated_thousands"] * 1000),
                },
                {
                    "metric": "Temporarily separated more than once",
                    "proportion_percent": values["more_than_once_percent"],
                    "estimate_women": int(values["more_than_once_thousands"] * 1000),
                },
            ]
        )

    rows = [
        ("Temporarily separated", 7),
        ("Temporarily separated once only", 12),
        ("Temporarily separated more than once", 8),
        ("Did not temporarily separate", 13),
        ("Total cohort", 15),
    ]
    with DETAIL_PATH.open("w", encoding="utf-8-sig", newline="") as output_file:
        fieldnames = [
            "metric",
            "estimate_thousands",
            "proportion_percent",
            "estimate_rse_percent",
            "proportion_rse_percent",
            "reference_period",
            "population_denominator",
            "source_table",
            "source_cells",
        ]
        writer = csv.DictWriter(output_file, fieldnames=fieldnames)
        writer.writeheader()
        for metric, row_number in rows:
            writer.writerow(
                {
                    "metric": metric,
                    "estimate_thousands": workbook_value("Table 18.1", f"B{row_number}"),
                    "proportion_percent": workbook_value("Table 18.1", f"C{row_number}"),
                    "estimate_rse_percent": workbook_value("Table 18.2", f"B{row_number}"),
                    "proportion_rse_percent": workbook_value("Table 18.2", f"C{row_number}"),
                    "reference_period": "2021-22",
                    "population_denominator": (
                        "Women who experienced violence by a previous partner "
                        "while living together"
                    ),
                    "source_table": "ABS Partner violence 2021-22, Tables 18.1 and 18.2",
                    "source_cells": (
                        f"Table 18.1 B{row_number}/C{row_number}; "
                        f"Table 18.2 B{row_number}/C{row_number}"
                    ),
                }
            )


def workbook_value(sheet_name: str, cell: str) -> float:
    workbook = openpyxl.load_workbook(SOURCE_PATH, data_only=True, read_only=True)
    value = workbook[sheet_name][cell].value
    return float(value)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    filename = "YuGothB.ttc" if bold else "YuGothR.ttc"
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / filename), size)


def draw_open_door(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    width: int,
    height: int,
    ink: str,
    indigo: str,
    light: str,
    paper: str,
) -> None:
    """Draw a recognisable open door with frame, panel, handle and light."""
    # Light visible through the doorway.
    draw.rectangle((x + 8, y + 8, x + width - 8, y + height), fill=light)

    # Door frame and threshold.
    draw.line((x, y + height, x, y), fill=ink, width=10)
    draw.line((x, y, x + width, y), fill=ink, width=10)
    draw.line((x + width, y, x + width, y + height), fill=ink, width=10)
    draw.line((x - 8, y + height, x + width + 18, y + height), fill=ink, width=7)

    # Open door panel, swung toward the viewer.
    panel = [
        (x + width - 6, y + 9),
        (x + width + 112, y + 55),
        (x + width + 112, y + height - 45),
        (x + width - 6, y + height - 4),
    ]
    draw.polygon(panel, fill=paper, outline=ink)
    draw.line(panel + [panel[0]], fill=ink, width=7, joint="curve")

    # Door inset and handle.
    inset = [
        (x + width + 18, y + 52),
        (x + width + 88, y + 78),
        (x + width + 88, y + height - 78),
        (x + width + 18, y + height - 52),
    ]
    draw.line(inset + [inset[0]], fill=indigo, width=3, joint="curve")
    handle_x, handle_y = x + width + 30, y + height // 2
    draw.ellipse(
        (handle_x - 7, handle_y - 7, handle_x + 7, handle_y + 7),
        fill=indigo,
    )

    # A quiet perspective cue on the floor beyond the threshold.
    draw.polygon(
        [
            (x + 16, y + height),
            (x + width - 14, y + height),
            (x + width + 62, y + height + 34),
            (x - 46, y + height + 34),
        ],
        fill="#DDD8CA",
    )


def draw_chart(values: dict[str, float]) -> None:
    width, height = 1080, 1350
    image = Image.new("RGB", (width, height), "#F4F1E9")
    draw = ImageDraw.Draw(image)

    ink = "#24282A"
    muted = "#666B6C"
    indigo = "#40596B"
    vermilion = "#B65A45"
    quiet = "#CBC7BE"

    draw.rectangle((70, 70, 87, 87), fill=vermilion)
    draw.text(
        (105, 61),
        "PARTNER VIOLENCE  /  SEPARATION",
        font=font(20, bold=True),
        fill=muted,
    )
    draw.text((70, 160), "Leaving was not always", font=font(58, bold=True), fill=ink)
    draw.text((70, 240), "a single event.", font=font(68, bold=True), fill=ink)

    draw.text(
        (72, 372),
        "Of the women who experienced violence by a former partner",
        font=font(23),
        fill=muted,
    )
    draw.text(
        (72, 410),
        "while living together, many separated — some repeatedly.",
        font=font(23),
        fill=muted,
    )

    # Nested stages use one denominator and one width scale.
    chart_left, chart_right = 70, 1010
    max_width = chart_right - chart_left
    stages = [
        {
            "step": "01",
            "label": "EXPERIENCED VIOLENCE\nWHILE LIVING TOGETHER",
            "count": "1,364,700",
            "percent": 100.0,
            "color": quiet,
            "text": ink,
        },
        {
            "step": "02",
            "label": "TEMPORARILY\nSEPARATED",
            "count": "583,800",
            "percent": values["temporarily_separated_percent"],
            "color": indigo,
            "text": "#F4F1E9",
        },
        {
            "step": "03",
            "label": "SEPARATED\nMORE THAN ONCE",
            "count": "357,900",
            "percent": values["more_than_once_percent"],
            "color": vermilion,
            "text": "#F4F1E9",
        },
    ]
    bar_top, bar_height, gap = 535, 150, 36
    for index, stage in enumerate(stages):
        y = bar_top + index * (bar_height + gap)
        bar_width = int(max_width * stage["percent"] / 100)
        draw.rectangle(
            (chart_left, y, chart_left + bar_width, y + bar_height),
            fill=stage["color"],
        )
        draw.text(
            (chart_left + 20, y + 15),
            stage["step"],
            font=font(16, bold=True),
            fill=stage["text"],
        )
        draw.multiline_text(
            (chart_left + 20, y + 47),
            stage["label"],
            font=font(16, bold=True),
            fill=stage["text"],
            spacing=4,
        )
        count_x = chart_left + bar_width + 24
        if stage["percent"] == 100:
            count_x = chart_left + bar_width - 245
        draw.text(
            (count_x, y + 30),
            stage["count"],
            font=font(34, bold=True),
            fill=ink if stage["percent"] < 100 else stage["text"],
        )
        draw.text(
            (count_x, y + 83),
            f'{stage["percent"]:.1f}%',
            font=font(22, bold=True),
            fill=muted if stage["percent"] < 100 else stage["text"],
        )

    draw.line((70, 1110, 1010, 1110), fill=quiet, width=2)
    draw.text(
        (70, 1143),
        "42.8% temporarily separated. 26.2% separated more than once.",
        font=font(23, bold=True),
        fill=ink,
    )
    draw.text(
        (70, 1188),
        "The proportions use the same denominator: 1.3647 million women.",
        font=font(18),
        fill=muted,
    )

    draw.text(
        (70, 1240),
        "Population: women aged 18+ who experienced violence by a former partner while living together.",
        font=font(14),
        fill=muted,
    )
    draw.text(
        (70, 1272),
        "Source: Australian Bureau of Statistics, Partner violence, 2021–22, Table 18.1.",
        font=font(14),
        fill=muted,
    )
    draw.text(
        (70, 1304),
        "Survey estimates. Components may not sum to the total because ABS randomly adjusts cells.",
        font=font(14),
        fill=muted,
    )
    image.save(FIGURE_PATH, quality=95)


def draw_illustrated_chart(values: dict[str, float]) -> None:
    """Overlay audited figures on the project illustration generated for this story."""
    if not ILLUSTRATION_PATH.exists():
        raise FileNotFoundError(f"Missing illustration source: {ILLUSTRATION_PATH}")

    image = Image.open(ILLUSTRATION_PATH).convert("RGB").resize((1080, 1350))
    draw = ImageDraw.Draw(image)
    ink = "#24282A"
    muted = "#5D6261"
    paper = "#F4F1E9"
    vermilion = "#A94E38"

    # Quiet editorial header in the negative space deliberately reserved by the illustration.
    draw.rectangle((64, 62, 81, 79), fill=vermilion)
    draw.text(
        (100, 53),
        "PARTNER VIOLENCE  /  TEMPORARY SEPARATION",
        font=font(18, bold=True),
        fill=muted,
    )
    draw.text((64, 132), "They left.", font=font(60, bold=True), fill=ink)
    draw.text((64, 205), "Then returned.", font=font(60, bold=True), fill=ink)

    draw.text((66, 325), "583,800", font=font(82, bold=True), fill=ink)
    draw.text((66, 419), "women temporarily separated", font=font(24), fill=muted)
    draw.text((66, 457), "from a violent former partner.", font=font(24), fill=muted)

    draw.text(
        (66, 523),
        f'{values["temporarily_separated_percent"]:.1f}%',
        font=font(48, bold=True),
        fill=vermilion,
    )
    draw.text(
        (230, 540),
        "of women who experienced violence by a former partner",
        font=font(17),
        fill=ink,
    )
    draw.text(
        (230, 568),
        "while living together.",
        font=font(17),
        fill=ink,
    )

    # Source band keeps provenance readable without competing with the illustration.
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rectangle((0, 1230, 1080, 1350), fill=(244, 241, 233, 238))
    image = Image.alpha_composite(image.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(image)
    draw.text(
        (64, 1250),
        "Temporary separation means the relationship resumed before the final separation.",
        font=font(15),
        fill=muted,
    )
    draw.text(
        (64, 1284),
        "Population: women aged 18+ who experienced violence by a former partner while living together.",
        font=font(13),
        fill=muted,
    )
    draw.text(
        (64, 1317),
        "Source: Australian Bureau of Statistics, Partner violence, 2021–22, Table 18.1.",
        font=font(13),
        fill=muted,
    )
    image.save(ILLUSTRATED_FIGURE_PATH, quality=95)


def main() -> None:
    values = read_source()
    write_csvs(values)
    draw_chart(values)
    draw_illustrated_chart(values)
    print(f"Wrote {CSV_PATH}")
    print(f"Wrote {DETAIL_PATH}")
    print(f"Wrote {FIGURE_PATH}")
    print(f"Wrote {ILLUSTRATED_FIGURE_PATH}")


if __name__ == "__main__":
    main()
