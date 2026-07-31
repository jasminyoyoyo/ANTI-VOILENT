# Chart 01: How many women have experienced partner violence?

## Key figures

- In 2021–22, Australia had an estimated 9.9086 million women aged 18 and over.
- About 1.6704 million had experienced violence by a cohabiting partner since age 15.
- This represents 16.9%, or approximately 1 in 6 adult women.
- The RSE is 2.7% for both the population estimate and proportion. The estimate is not flagged by ABS for cautious use.

## Datawrapper file

Upload `chart_01_datawrapper.csv`.

Recommended settings:

1. Chart type: 100% stacked bar.
2. Use `experienced_partner_violence_percent` and `did_not_report_partner_violence_percent`.
3. Highlight the first series in muted indigo and use warm grey for the remainder.
4. Directly label 16.9%.
5. Fix the horizontal scale at 0%–100%.

## Recommended copy

**Title:** This is not a rare experience

**Subtitle:** About 1 in 6 Australian women aged 18 and over has experienced violence by a current or former cohabiting partner since age 15.

**Note:** “Violence” includes the occurrence, attempt or threat of physical or sexual assault. This is a survey-based population estimate, not a count of police reports.

**Source:** Australian Bureau of Statistics, *Partner violence, 2021–22*, Table 1.1.

## Data preparation

The script `scripts/prepare_partner_violence_chart_01.py`:

1. Reads the women’s population estimate from Table 1.1 cell B11.
2. Reads the women’s prevalence proportion from Table 1.1 cell E11.
3. Reads the corresponding RSE values from Table 1.2 cells B11 and E11.
4. Calculates 83.1% as `100 - 16.9` for the remainder of the 100% bar.
5. Writes a minimal Datawrapper table and a separate audit table containing the original source cells.

“No such experience reported” is used only to complete the 100% bar. It must not be interpreted as “never experienced any form of family violence”, because this metric covers only physical or sexual violence by a cohabiting partner under the PSS definition.

## Files

- `chart_01_datawrapper.csv`: upload-ready Datawrapper file.
- `chart_01_source_detail.csv`: estimate, proportion, RSE, period, population and source cells.
- `chart_01_partner_violence_scale.png`: 1080 × 1350 static preview.
- Raw source: `data/raw/abs/partner_violence_2021_22/Partner violence and abuse prevalence (Table 1).xlsx`.
