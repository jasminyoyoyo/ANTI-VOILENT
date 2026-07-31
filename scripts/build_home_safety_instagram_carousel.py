"""Build a six-slide Instagram carousel from ABS NSW FDV data."""

from __future__ import annotations

import csv
import textwrap
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
    / "nsw_home_safety_carousel"
)

WIDTH, HEIGHT = 1080, 1350
MARGIN = 82
BG = "#F7F2EA"
INK = "#1E2933"
MUTED = "#66717D"
TEAL = "#177E89"
TEAL_LIGHT = "#DDEEEF"
CORAL = "#D96C4A"
GOLD = "#E6B85C"
WHITE = "#FFFFFF"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    filename = "msyhbd.ttc" if bold else "msyh.ttc"
    return ImageFont.truetype(str(Path("C:/Windows/Fonts") / filename), size)


def wrap(draw: ImageDraw.ImageDraw, text: str, max_width: int, text_font: ImageFont.FreeTypeFont) -> list[str]:
    lines: list[str] = []
    for paragraph in text.split("\n"):
        if not paragraph:
            lines.append("")
            continue
        current = ""
        for char in paragraph:
            candidate = current + char
            if draw.textbbox((0, 0), candidate, font=text_font)[2] <= max_width:
                current = candidate
            else:
                if current:
                    lines.append(current)
                current = char
        if current:
            lines.append(current)
    return lines


def draw_wrapped(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    text_font: ImageFont.FreeTypeFont,
    fill: str,
    max_width: int,
    spacing: int = 16,
) -> int:
    x, y = xy
    for line in wrap(draw, text, max_width, text_font):
        draw.text((x, y), line, font=text_font, fill=fill)
        y += text_font.size + spacing
    return y


def base_slide(number: int, label: str) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    image = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(image)
    draw.text((MARGIN, 48), "慢慢看数据 · NSW", font=font(24, True), fill=TEAL)
    draw.text((WIDTH - 160, 48), f"{number}/6", font=font(24, True), fill=MUTED)
    draw.line((MARGIN, 100, WIDTH - MARGIN, 100), fill="#D7D0C7", width=2)
    draw.text((MARGIN, HEIGHT - 72), label, font=font(20), fill=MUTED)
    return image, draw


def extract_metrics() -> dict[str, float]:
    table30 = pd.read_excel(SOURCE_PATH, sheet_name="Table 30", header=None)
    table33 = pd.read_excel(SOURCE_PATH, sheet_name="Table 33", header=None)

    metrics = {
        "female_fdv_assault_victims": float(table30.iat[18, 11]),
        "female_fdv_share_all_assault": float(table30.iat[18, 33]),
        "female_residential_share": float(table33.iat[28, 5]),
        "female_intimate_partner_share": float(table33.iat[20, 5]),
        "female_other_family_share": float(table33.iat[23, 5]),
        "female_other_non_family_share": float(table33.iat[25, 5]),
    }

    expected = {
        "female_fdv_assault_victims": 23518.0,
        "female_fdv_share_all_assault": 65.0,
        "female_residential_share": 87.2,
        "female_intimate_partner_share": 59.4,
        "female_other_family_share": 35.2,
        "female_other_non_family_share": 5.0,
    }
    if metrics != expected:
        raise ValueError(f"Source values changed: {metrics}")
    return metrics


def slide_1() -> Image.Image:
    image, draw = base_slide(1, "问题不是只存在于街头")
    draw.rounded_rectangle((MARGIN, 165, 998, 1165), radius=44, fill=INK)
    draw.text((130, 250), "我们总提醒女性", font=font(54, True), fill=WHITE)
    draw.text((130, 330), "注意外面的危险。", font=font(54, True), fill=WHITE)
    draw.text((130, 525), "可是，", font=font(46), fill="#BFDDE0")
    draw.text((130, 615), "家里真的", font=font(90, True), fill=GOLD)
    draw.text((130, 730), "更安全吗？", font=font(90, True), fill=GOLD)
    draw.line((130, 920, 875, 920), fill=CORAL, width=8)
    draw_wrapped(
        draw,
        (130, 975),
        "2024年 NSW 警方记录中的女性袭击与FDV",
        font(28),
        "#D6DEE4",
        760,
    )
    return image


def slide_2(m: dict[str, float]) -> Image.Image:
    image, draw = base_slide(2, "分母：警方记录的全部女性袭击受害者")
    draw.text((MARGIN, 165), "一个容易被忽略的比例", font=font(38, True), fill=INK)
    draw.text((MARGIN, 285), f"{m['female_fdv_share_all_assault']:.0f}%", font=font(180, True), fill=CORAL)
    draw_wrapped(
        draw,
        (MARGIN, 535),
        "在 NSW 警方记录的女性袭击受害者中，属于FDV相关。",
        font(44, True),
        INK,
        890,
        22,
    )
    draw.rounded_rectangle((MARGIN, 840, 998, 1055), radius=30, fill=WHITE)
    draw.text((125, 890), f"{int(m['female_fdv_assault_victims']):,}", font=font(58, True), fill=TEAL)
    draw.text((125, 975), "名／人次女性FDV相关袭击受害者记录", font=font(27), fill=MUTED)
    draw_wrapped(
        draw,
        (MARGIN, 1105),
        "不是“65%的 NSW 女性经历FDV”。分母只包括已经进入警方袭击记录的女性受害者。",
        font(24),
        MUTED,
        900,
    )
    return image


def slide_3(m: dict[str, float]) -> Image.Image:
    image, draw = base_slide(3, "住宅类地点不一定是受害者自己的家")
    draw.text((MARGIN, 165), "这些记录出现在哪里？", font=font(38, True), fill=INK)
    draw.text((MARGIN, 285), f"{m['female_residential_share']:.1f}%", font=font(170, True), fill=TEAL)
    draw_wrapped(
        draw,
        (MARGIN, 520),
        "女性FDV相关袭击受害者记录的地点，属于住宅类地点。",
        font(43, True),
        INK,
        900,
        20,
    )
    draw.rounded_rectangle((MARGIN, 790, 998, 1030), radius=30, fill=TEAL_LIGHT)
    draw_wrapped(
        draw,
        (125, 835),
        "住宅类地点可能是受害者、施害者或其他人的住所，以及相关住宅用地。",
        font(29),
        INK,
        820,
        14,
    )
    draw_wrapped(
        draw,
        (MARGIN, 1090),
        "所以这项数据支持“重新思考家庭与住宅环境中的安全”，但不能证明所有事件都发生在受害者自己的家。",
        font(24),
        MUTED,
        900,
    )
    return image


def slide_4(m: dict[str, float]) -> Image.Image:
    image, draw = base_slide(4, "关系比例因ABS保密调整可能不精确相加至100%")
    draw.text((MARGIN, 165), "施害者与受害者是什么关系？", font=font(38, True), fill=INK)

    bars = [
        ("亲密伴侣", m["female_intimate_partner_share"], CORAL),
        ("其他家庭成员", m["female_other_family_share"], TEAL),
        ("其他FDV关系", m["female_other_non_family_share"], GOLD),
    ]
    y = 320
    max_bar = 800
    for label, value, colour in bars:
        draw.text((MARGIN, y), label, font=font(31, True), fill=INK)
        draw.rounded_rectangle((MARGIN, y + 65, MARGIN + max_bar, y + 120), radius=18, fill="#E3DDD5")
        draw.rounded_rectangle(
            (MARGIN, y + 65, MARGIN + int(max_bar * value / 65), y + 120),
            radius=18,
            fill=colour,
        )
        draw.text((900, y + 63), f"{value:.1f}%", font=font(30, True), fill=INK)
        y += 230

    draw_wrapped(
        draw,
        (MARGIN, 1060),
        "亲密伴侣包括现任及前任伴侣；其他FDV关系可包括照护者、监护人或特定亲属关系。",
        font(25),
        MUTED,
        900,
    )
    return image


def slide_5() -> Image.Image:
    image, draw = base_slide(5, "数据告诉我们进入警方系统的部分")
    draw.text((MARGIN, 165), "所以，家里更危险吗？", font=font(47, True), fill=INK)
    draw.text((MARGIN, 280), "数据还不能这样直接回答。", font=font(39, True), fill=CORAL)

    points = [
        "这是警方记录，不是所有实际发生的暴力。",
        "没有报警或没有形成袭击记录的经历不会出现在这里。",
        "住宅类地点不等于受害者自己的住所。",
        "同一人在不同事件中可能被重复记录。",
    ]
    y = 430
    for point in points:
        draw.ellipse((MARGIN, y + 12, MARGIN + 24, y + 36), fill=TEAL)
        y = draw_wrapped(draw, (MARGIN + 50, y), point, font(31), INK, 830, 12) + 35

    draw.rounded_rectangle((MARGIN, 1000, 998, 1160), radius=30, fill=WHITE)
    draw_wrapped(
        draw,
        (125, 1038),
        "它真正提出的问题是：为什么女性安全讨论经常只强调陌生人与公共空间？",
        font(29, True),
        INK,
        820,
    )
    return image


def slide_6() -> Image.Image:
    image, draw = base_slide(6, "Source-backed, not an official account")
    draw.text((MARGIN, 165), "数据不是为了制造恐惧，", font=font(46, True), fill=INK)
    draw.text((MARGIN, 245), "而是为了看见被忽略的风险。", font=font(46, True), fill=TEAL)

    draw.rounded_rectangle((MARGIN, 390, 998, 700), radius=36, fill=INK)
    draw_wrapped(
        draw,
        (130, 445),
        "如果安全建议只教女性提防陌生人和公共空间，它就遗漏了警方记录中很大一部分与家庭及亲密关系有关的袭击。",
        font(34, True),
        WHITE,
        810,
        17,
    )

    draw.text((MARGIN, 795), "来源", font=font(30, True), fill=CORAL)
    source = (
        "ABS, Recorded Crime – Victims 2024, Tables 30 & 33. "
        "Released 3 Sep 2025."
    )
    draw_wrapped(draw, (MARGIN, 850), source, font(24), INK, 900, 12)
    draw.text((MARGIN, 1010), "口径", font=font(30, True), fill=CORAL)
    draw_wrapped(
        draw,
        (MARGIN, 1065),
        "NSW警方在2024年记录的FDV相关袭击受害者。不是实际发生率，也不是报警电话数量。",
        font(24),
        INK,
        900,
        12,
    )
    return image


def main() -> None:
    metrics = extract_metrics()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    slides = [
        slide_1(),
        slide_2(metrics),
        slide_3(metrics),
        slide_4(metrics),
        slide_5(),
        slide_6(),
    ]
    for index, slide in enumerate(slides, start=1):
        slide.save(OUTPUT_DIR / f"slide_{index:02d}.png", quality=95)

    with (OUTPUT_DIR / "metrics.csv").open("w", encoding="utf-8-sig", newline="") as output_file:
        writer = csv.writer(output_file)
        writer.writerow(["metric", "value"])
        writer.writerows(metrics.items())

    print(f"Wrote {len(slides)} slides to {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
