# ABS PSS Data Pipeline Method Note

Last updated: 2026-07-14

This note explains how `data/processed/pss_key_metrics.csv` was created from the ABS Personal Safety Survey workbooks.

中文说明：这份文档是为了让你能讲清楚“数据从哪里来、怎么处理、为什么这样处理、下一步怎么分析”。它不是论文，而是一个产品研究用的数据方法说明。

## 1. What We Built

Output file:

- `data/processed/pss_key_metrics.csv`

Script:

- `scripts/process_pss_key_metrics.py`

Raw source files:

- `data/raw/aihw_downloads/PSS National prevalence and time series (Tables 1 to 8).xlsx`
- `data/raw/aihw_downloads/PSS State and territory prevalence and time series (Tables 9 to 14).xlsx`

Official ABS page:

- https://www.abs.gov.au/statistics/people/crime-and-justice/personal-safety-australia/latest-release

## 2. Why We Made A Tidy CSV

The original ABS Excel files are designed for human reading. They are good for checking numbers, but awkward for analysis because:

- headings are spread across multiple rows
- table notes are mixed with data
- value tables and RSE tables are separate
- years, gender, and jurisdictions are stored as columns
- each sheet has a slightly different structure

For analysis, we want each row to be one data point:

> one indicator + one population + one sex + one jurisdiction + one period + one value

This format is called tidy data.

中文人话版：

原始 Excel 像“报告表格”，适合人看；tidy CSV 像“数据库”，适合分析、筛选、画图、复查。

## 3. What The CSV Contains

Current version contains selected research-critical metrics:

| Source sheet | What it contributes |
|---|---|
| `Table 1.3` | national since-age-15 prevalence by gender |
| `Table 1.4` | RSE for `Table 1.3` |
| `Table 2.3` | national last-12-month prevalence by gender |
| `Table 2.4` | RSE for `Table 2.3` |
| `Table 3.1` | selected national time-series indicators |
| `Table 3.2` | RSE for `Table 3.1` |
| `Table 9.3` | women, state/territory since-age-15 prevalence |
| `Table 9.4` | RSE for `Table 9.3` |

The current CSV has 197 rows.

It is not a full extraction of every ABS table yet. That is intentional. We started with the indicators most relevant to Beacon's product research.

## 4. What Each Column Means

| Column | Meaning |
|---|---|
| `metric_id` | unique row identifier created from source sheet, row, column, sex, jurisdiction, and period |
| `dataset` | dataset name |
| `official_source_url` | official ABS page |
| `source_file` | raw Excel file name |
| `source_sheet` | raw Excel sheet name |
| `source_cell_row_1_based` | source row number, using Excel-style 1-based numbering |
| `source_cell_col_1_based` | source column number, using Excel-style 1-based numbering |
| `population` | population described by the ABS table |
| `sex` | Females, Males, Persons, or Women depending on table wording |
| `jurisdiction` | Australia or state/territory |
| `period` | Since age 15, 2021-22, or time-series year |
| `reference_period` | ABS release context |
| `experience_window` | Since age 15 or last 12 months |
| `indicator` | the violence/abuse indicator |
| `value_percent` | estimate as a percent, for example 22.2 means 22.2% |
| `rse_percent` | relative standard error of the estimate |
| `reliability_flag` | simple interpretation of RSE |
| `unit` | percent |
| `notes` | important caveats |

## 5. How RSE Is Used

RSE means relative standard error. It tells us how uncertain an estimate is.

Simple rule used in this dataset:

| RSE | Flag | Meaning |
|---:|---|---|
| under 25 | `generally_reliable_rse_under_25` | generally okay for normal interpretation |
| 25 to 50 | `use_with_caution_rse_25_to_50` | use carefully, avoid strong claims |
| over 50 | `too_unreliable_for_general_use_rse_over_50` | generally should not be used for broad claims |
| missing / `na` / `np` / dash | `not_available_or_not_applicable` | value or RSE is not available/applicable |

Current extraction summary:

- 197 total rows
- 171 rows generally reliable by this simple RSE rule
- 6 rows use with caution
- 20 rows have no available/applicable RSE flag
- 15 rows have missing or not-applicable values

## 6. What Questions This Dataset Can Answer

### A. Problem Scale

Question:

> How large is the issue in Australia?

Use:

- `jurisdiction = Australia`
- `period = Since age 15` or `period = 2021-22`
- compare `indicator` by `sex`

Example:

- total sexual violence since age 15
- total physical violence since age 15
- total violence in the last 12 months

### B. Gender Difference

Question:

> Which indicators differ strongly by gender?

Use:

- `source_sheet = Table 1.3` or `Table 2.3`
- compare `sex = Females`, `Males`, `Persons`

Product meaning:

Gender differences can shape tone and prioritisation, but Beacon should not assume every user is the same.

### C. State/Territory Difference

Question:

> Why should Beacon ask for state or territory?

Use:

- `source_sheet = Table 9.3`
- `sex = Women`
- compare `jurisdiction`

Product meaning:

State differences plus legal-system differences support a state-aware product flow.

### D. Trend Signal

Question:

> Are selected indicators increasing, decreasing, or stable?

Use:

- `source_sheet = Table 3.1`
- compare `period`

Important:

Do not overclaim trend results. Some ABS indicators have comparability cautions.

### E. Product Direction Evidence

Question:

> Which Beacon direction is supported by ABS, and which needs other sources?

ABS can support:

- general problem scale
- gender comparison
- state comparison
- selected trend signals

ABS cannot directly prove:

- Chinese/CALD user motivation
- international student motivation
- dating app safety needs
- phone monitoring / spyware / account surveillance details
- why someone would open Beacon

For those, use ANROWS, eSafety, AIC, service audits, interviews, and surveys.

## 7. How To Analyse It In Excel

Open `pss_key_metrics.csv` in Excel.

Useful filters:

1. Filter `reliability_flag`
   - remove or mark caution rows before strong claims
2. Filter `source_sheet`
   - `Table 9.3` for state comparison
   - `Table 3.1` for trend
3. Filter `indicator`
   - compare one indicator at a time
4. Filter `jurisdiction`
   - use Australia for national analysis
   - use states/territories for local comparison
5. Filter `sex`
   - compare female/male/persons where available

Simple pivot table ideas:

- Rows: `indicator`; Columns: `sex`; Values: average of `value_percent`
- Rows: `jurisdiction`; Columns: `indicator`; Values: average of `value_percent`
- Rows: `period`; Columns: `indicator`; Values: average of `value_percent`

## 8. How To Analyse It In Python

Basic pattern:

```python
import pandas as pd

df = pd.read_csv("data/processed/pss_key_metrics.csv")

state = df[
    (df["source_sheet"] == "Table 9.3")
    & (df["reliability_flag"] == "generally_reliable_rse_under_25")
]

total_violence = state[state["indicator"] == "Total violence since age 15"]
print(total_violence[["jurisdiction", "value_percent", "rse_percent"]])
```

Use Python when you want:

- repeatable charts
- automatic filtering
- ranking
- joining multiple data sources
- checking missing values
- calculating differences

Use Excel when you want:

- human-readable review
- quick pivot tables
- stakeholder-friendly charts

## 9. What A Good Analysis Sentence Looks Like

Weak sentence:

> Violence is a huge problem, so Beacon is useful.

Better sentence:

> ABS PSS 2021-22 shows substantial national prevalence and meaningful state/territory differences across selected violence indicators. Combined with jurisdiction-specific legal and service systems, this supports a state-aware first-step navigator rather than a generic resource directory.

中文人话版：

> 数据不是直接证明“Beacon 一定有用”。数据证明的是：问题规模大、州差异存在、系统复杂。所以 Beacon 更有理由做“按州和情境导航的第一步工具”，而不是再做一个普通资料库。

## 10. What To Do Next

Next data tasks:

1. Add more ABS tables if needed:
   - help-seeking
   - perpetrator relationship
   - emotional/economic abuse details
2. Add AIHW service/system data.
3. Add official state legal/service pathway data.
4. Add ANROWS / eSafety / AIC evidence for:
   - CALD users
   - technology-facilitated abuse
   - dating app safety
5. Create a product evidence scorecard:
   - evidence strength
   - user severity
   - current service gap
   - product fit
   - safety risk

## 11. Core Lesson

Data analysis is not just making charts.

For this project, the real work is:

> turn messy official evidence into a clear product decision.

The current pipeline is the first step: it turns selected ABS report tables into a traceable dataset that we can filter, chart, challenge, and improve.
