"""Prepare chart 01: Australian women who experienced cohabiting-partner violence."""

from __future__ import annotations

import csv
from pathlib import Path

import openpyxl
from PIL import Image, ImageDraw, ImageFont


REPO_ROOT = Path(__file__).resolve().parents[1]
SOURCE_PATH = (
    REPO_ROOT
    / "data"
    / "raw"
    / "abs"
    / "partner_violence_2021_22"
    / "Partner violence and abuse prevalence (Table 1).xlsx"
)
OUTPUT_DIR = (
    REPO_ROOT
    / "outputs"
    / "data_analysis"
    / "why_not_leave"
    / "chart_01_partner_violence_scale"
)
CSV_PATH = OUTPUT_DIR / "chart_01_datawrapper.csv"
DETAIL_PATH = OUTPUT_DIR / "chart_01_source_detail.csv"
FIGURE_PATH = OUTPUT_DIR / "chart_01_partner_violence_scale.png"


def read_source() -> dict[str, float]:
    workbook = openpyxl.load_workbook(SOURCE_PATH, data_only=True, read_only=True)
    estimates = workbook["Table 1.1"]
    errors = workbook["Table 1.2"]

    values = {
        "adult_women_thousands": float(estimates["B33"].value),
        "experienced_thousands": float(estimates["B11"].value),
        "experienced_percent": float(estimates["E11"].value),
        "estimate_rse_percent": float(errors["B11"].value),
        "proportion_rse_percent": float(errors["E11"].value),
    }

    if values["experienced_percent"] != 16.9:
        raise ValueError("Unexpected ABS prevalence value in Table 1.1 E11")
    if values["experienced_thousands"] != 1670.4:
        raise ValueError("Unexpected ABS estimate in Table 1.1 B11")
    return values


def write_csvs(values: dict[str, float]) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Minimal shape for a Datawrapper 100% stacked bar.
    with CSV_PATH.open("w", encoding="utf-8-sig", newline="") as output_file:
        writer = csv.DictWriter(
            output_file,
            fieldnames=[
                "population",
                "experienced_partner_violence_percent",
                "did_not_report_partner_violence_percent",
            ],
        )
        writer.writeheader()
        writer.writerow(
            {
                "population": "Australian women aged 18 years and over",
                "experienced_partner_violence_percent": values["experienced_percent"],
                "did_not_report_partner_violence_percent": round(
                    100 - values["experienced_percent"], 1
                ),
            }
        )

    # Audit-friendly source detail; do not upload this file as the chart table.
    with DETAIL_PATH.open("w", encoding="utf-8-sig", newline="") as output_file:
        writer = csv.DictWriter(
            output_file,
            fieldnames=[
                "metric",
                "estimate_thousands",
                "proportion_percent",
                "estimate_rse_percent",
                "proportion_rse_percent",
                "reference_period",
                "experience_window",
                "population",
                "source_table",
                "source_cells",
            ],
        )
        writer.writeheader()
        writer.writerow(
            {
                "metric": "Experienced violence by a cohabiting partner",
                "estimate_thousands": values["experienced_thousands"],
                "proportion_percent": values["experienced_percent"],
                "estimate_rse_percent": values["estimate_rse_percent"],
                "proportion_rse_percent": values["proportion_rse_percent"],
                "reference_period": "2021-22",
                "experience_window": "Since age 15",
                "population": "Australian women aged 18 years and over",
                "source_table": "ABS Partner violence 2021-22, Table 1.1 and Table 1.2",
                "source_cells": "Table 1.1 B11/E11; Table 1.2 B11/E11",
            }
        )


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    filename = "YuGothB.ttc" if bold else "YuGothR.ttc"
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / filename), size)


def draw_chart(values: dict[str, float]) -> None:
    width, height = 1080, 1350
    canvas = Image.new("RGB", (width, height), "#F4F1E9")
    draw = ImageDraw.Draw(canvas)

    ink = "#24282A"
    muted = "#62686A"
    indigo = "#40596B"
    quiet = "#D8D5CD"
    vermilion = "#B65A45"

    draw.rectangle((70, 70, 87, 87), fill=vermilion)
    draw.text(
        (105, 61),
        "PARTNER VIOLENCE  /  AUSTRALIA",
        font=load_font(20, bold=True),
        fill=muted,
    )
    draw.text(
        (70, 165),
        "This is not",
        font=load_font(72, bold=True),
        fill=ink,
    )
    draw.text(
        (70, 255),
        "a rare experience.",
        font=load_font(72, bold=True),
        fill=ink,
    )
    draw.text(
        (72, 385),
        "About 1 in 6 Australian women aged 18 and over",
        font=load_font(25),
        fill=muted,
    )
    draw.text(
        (72, 428),
        "has experienced violence by a current or former",
        font=load_font(25),
        fill=muted,
    )
    draw.text(
        (72, 469),
        "cohabiting partner since age 15.",
        font=load_font(25),
        fill=muted,
    )

    draw.text(
        (70, 545),
        "16.9",
        font=load_font(156, bold=True),
        fill=indigo,
    )
    draw.text(
        (472, 647),
        "%",
        font=load_font(58, bold=True),
        fill=indigo,
    )

    bar_left, bar_top, bar_right, bar_bottom = 72, 770, 1008, 806
    draw.rounded_rectangle(
        (bar_left, bar_top, bar_right, bar_bottom),
        radius=18,
        fill=quiet,
    )
    experienced_right = bar_left + int(
        (bar_right - bar_left) * values["experienced_percent"] / 100
    )
    draw.rounded_rectangle(
        (bar_left, bar_top, experienced_right, bar_bottom),
        radius=18,
        fill=indigo,
    )
    draw.line((experienced_right, 745, experienced_right, 832), fill=ink, width=2)
    draw.text(
        (bar_left, 842),
        "Experienced partner violence",
        font=load_font(20, bold=True),
        fill=ink,
    )
    draw.text(
        (bar_right - 318, 842),
        "No such experience reported",
        font=load_font(18),
        fill=muted,
    )

    draw.line((70, 945, 1010, 945), fill="#C9C5BC", width=2)
    draw.text(
        (70, 990),
        "1.67 million",
        font=load_font(47, bold=True),
        fill=ink,
    )
    draw.text(
        (70, 1052),
        "women aged 18 and over",
        font=load_font(25),
        fill=muted,
    )
    draw.text(
        (620, 994),
        "Survey estimate",
        font=load_font(19, bold=True),
        fill=muted,
    )
    draw.text(
        (620, 1030),
        "RSE 2.7%",
        font=load_font(25),
        fill=ink,
    )

    draw.text(
        (70, 1166),
        "Violence includes the occurrence, attempt or threat of physical or sexual assault.",
        font=load_font(17),
        fill=muted,
    )
    draw.text(
        (70, 1212),
        "Cohabiting partner: a current or former married or de facto partner they lived with.",
        font=load_font(17),
        fill=muted,
    )
    draw.text(
        (70, 1258),
        "Source: Australian Bureau of Statistics, Partner violence, 2021–22, Table 1.1.",
        font=load_font(16),
        fill=muted,
    )
    draw.text(
        (70, 1292),
        "This is a survey-based population estimate, not a count of police reports.",
        font=load_font(16),
        fill=muted,
    )
    canvas.save(FIGURE_PATH, quality=95)


def main() -> None:
    values = read_source()
    write_csvs(values)
    draw_chart(values)
    print(f"Wrote {CSV_PATH}")
    print(f"Wrote {DETAIL_PATH}")
    print(f"Wrote {FIGURE_PATH}")


if __name__ == "__main__":
    main()
