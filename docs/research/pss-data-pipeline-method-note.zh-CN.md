# ABS PSS 数据流程方法说明

最后更新：2026-07-14

这份文档解释 `data/processed/pss_key_metrics.csv` 是如何从 ABS Personal Safety Survey 原始 workbook 中生成的。

它的目的不是写论文，而是让你能讲清楚：

- 数据从哪里来
- 数据怎么处理
- 为什么这样处理
- 下一步怎么分析

## 1. 我们做了什么

输出文件：

- `data/processed/pss_key_metrics.csv`

处理脚本：

- `scripts/process_pss_key_metrics.py`

原始数据文件：

- `data/raw/aihw_downloads/PSS National prevalence and time series (Tables 1 to 8).xlsx`
- `data/raw/aihw_downloads/PSS State and territory prevalence and time series (Tables 9 to 14).xlsx`

ABS 官方页面：

- https://www.abs.gov.au/statistics/people/crime-and-justice/personal-safety-australia/latest-release

## 2. 为什么要做 tidy CSV

ABS 原始 Excel 是为“人阅读报告”设计的，不是为直接分析设计的。

它的问题是：

- 表头分散在多行里
- 数据和脚注混在一起
- 数值表和 RSE 表分开
- 年份、性别、州/领地都放在列里
- 每个 sheet 的结构略有不同

做分析时，我们更希望每一行都是一个数据点：

> 一个指标 + 一个群体 + 一个性别 + 一个地区 + 一个时间段 + 一个数值

这种格式叫 tidy data。

人话版：

> 原始 Excel 像“报告表格”，适合人看；tidy CSV 像“数据库”，适合筛选、画图、分析和复查。

## 3. CSV 目前包含什么

当前版本包含的是和 Beacon 产品研究最相关的关键指标。

| 来源 sheet | 作用 |
|---|---|
| `Table 1.3` | 全国 since-age-15 prevalence，按性别 |
| `Table 1.4` | `Table 1.3` 对应的 RSE |
| `Table 2.3` | 全国 last-12-month prevalence，按性别 |
| `Table 2.4` | `Table 2.3` 对应的 RSE |
| `Table 3.1` | 选定的全国时间趋势指标 |
| `Table 3.2` | `Table 3.1` 对应的 RSE |
| `Table 9.3` | 女性 since-age-15 prevalence，按州/领地 |
| `Table 9.4` | `Table 9.3` 对应的 RSE |

当前 CSV 有 197 行。

它还不是 ABS 所有表格的全量提取。这是有意的：我们先处理最能回答 Beacon 产品研究问题的指标。

## 4. 每一列是什么意思

| 列名 | 含义 |
|---|---|
| `metric_id` | 每一行的唯一 ID，由 source sheet、行、列、性别、地区、时间段组合生成 |
| `dataset` | 数据集名称 |
| `official_source_url` | ABS 官方页面 |
| `source_file` | 原始 Excel 文件名 |
| `source_sheet` | 原始 Excel sheet 名 |
| `source_cell_row_1_based` | 原始表中的行号，按 Excel 习惯从 1 开始 |
| `source_cell_col_1_based` | 原始表中的列号，按 Excel 习惯从 1 开始 |
| `population` | ABS 表格描述的人群 |
| `sex` | Females、Males、Persons 或 Women，按原表措辞 |
| `jurisdiction` | Australia 或具体州/领地 |
| `period` | Since age 15、2021-22 或时间序列年份 |
| `reference_period` | ABS 发布背景 |
| `experience_window` | Since age 15 或 Last 12 months |
| `indicator` | 暴力/虐待指标名称 |
| `value_percent` | 百分比估计值，例如 22.2 表示 22.2% |
| `rse_percent` | 该估计值的 relative standard error |
| `reliability_flag` | 对 RSE 的简单解释 |
| `unit` | 单位，目前都是 percent |
| `notes` | 重要说明或限制 |

## 5. RSE 是什么，怎么用

RSE 是 relative standard error，中文可以理解为“相对标准误”。

它告诉我们这个估计值有多不确定。

我们现在用了一个简单规则：

| RSE | 标记 | 含义 |
|---:|---|---|
| 小于 25 | `generally_reliable_rse_under_25` | 一般可以正常解读 |
| 25 到 50 | `use_with_caution_rse_25_to_50` | 要谨慎使用，不要下强结论 |
| 大于 50 | `too_unreliable_for_general_use_rse_over_50` | 通常不适合用于一般性结论 |
| 缺失 / `na` / `np` / dash | `not_available_or_not_applicable` | 数值或 RSE 不可用 / 不适用 |

当前提取结果：

- 总共 197 行
- 171 行按这个 RSE 规则属于 generally reliable
- 6 行需要谨慎使用
- 20 行没有可用或适用的 RSE 标记
- 15 行数值为空或不适用

## 6. 这个数据集能回答什么问题

### A. 问题规模

问题：

> 澳洲这个问题到底有多大？

用法：

- `jurisdiction = Australia`
- `period = Since age 15` 或 `period = 2021-22`
- 按 `sex` 比较 `indicator`

例子：

- since age 15 的 total sexual violence
- since age 15 的 total physical violence
- last 12 months 的 total violence

### B. 性别差异

问题：

> 哪些指标在不同性别之间差异明显？

用法：

- `source_sheet = Table 1.3` 或 `Table 2.3`
- 比较 `sex = Females`、`Males`、`Persons`

产品意义：

性别差异可以影响产品语气和优先级，但 Beacon 不应该假设所有用户都一样。

### C. 州/领地差异

问题：

> 为什么 Beacon 应该问用户在哪个州/领地？

用法：

- `source_sheet = Table 9.3`
- `sex = Women`
- 比较 `jurisdiction`

产品意义：

州差异 + 法律系统差异，可以支持 Beacon 做 state-aware product flow。

### D. 趋势信号

问题：

> 选定指标是在上升、下降，还是稳定？

用法：

- `source_sheet = Table 3.1`
- 比较 `period`

重要提醒：

不要过度解读趋势。ABS 有些指标有可比性限制，需要看脚注。

### E. 产品方向证据

问题：

> 哪些 Beacon 方向能被 ABS 支持？哪些还需要其他来源？

ABS 能支持：

- 总体问题规模
- 性别比较
- 州/领地比较
- 选定趋势信号

ABS 不能直接证明：

- 华人/CALD 用户为什么会打开 Beacon
- 国际学生为什么会打开 Beacon
- dating app 安全需求
- 手机监控、spyware、账号监控细节
- 用户登陆网站的真实动机

这些方向需要 ANROWS、eSafety、AIC、服务审计、访谈和问卷来补充。

## 7. 如何在 Excel 里分析

打开 `pss_key_metrics.csv`。

有用的筛选方式：

1. 筛选 `reliability_flag`  
   在做强结论前，去掉或标记需要谨慎使用的数据。
2. 筛选 `source_sheet`  
   - `Table 9.3` 用于州/领地比较
   - `Table 3.1` 用于趋势
3. 筛选 `indicator`  
   每次最好比较一个指标。
4. 筛选 `jurisdiction`  
   - Australia 做全国分析
   - 各州/领地做地区比较
5. 筛选 `sex`  
   在有数据时比较 female / male / persons。

简单 pivot table 思路：

- Rows: `indicator`; Columns: `sex`; Values: average of `value_percent`
- Rows: `jurisdiction`; Columns: `indicator`; Values: average of `value_percent`
- Rows: `period`; Columns: `indicator`; Values: average of `value_percent`

## 8. 如何在 Python 里分析

基础模式：

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

什么时候用 Python：

- 要重复生成图表
- 要自动筛选
- 要排名
- 要合并多个数据源
- 要检查缺失值
- 要计算差异

什么时候用 Excel：

- 要人工检查
- 要快速 pivot table
- 要给别人看友好的图表

## 9. 好的数据分析句子长什么样

弱句子：

> Violence is a huge problem, so Beacon is useful.

更好的句子：

> ABS PSS 2021-22 shows substantial national prevalence and meaningful state/territory differences across selected violence indicators. Combined with jurisdiction-specific legal and service systems, this supports a state-aware first-step navigator rather than a generic resource directory.

中文人话版：

> 数据不是直接证明“Beacon 一定有用”。数据证明的是：问题规模大、州差异存在、系统复杂。所以 Beacon 更有理由做“按州和情境导航的第一步工具”，而不是再做一个普通资料库。

## 10. 下一步做什么

下一步数据任务：

1. 如果需要，加入更多 ABS 表：
   - help-seeking
   - perpetrator relationship
   - emotional / economic abuse details
2. 加入 AIHW 服务和系统数据。
3. 加入各州官方法律/服务路径数据。
4. 加入 ANROWS / eSafety / AIC 证据，用于：
   - CALD 用户
   - technology-facilitated abuse
   - dating app safety
5. 创建产品证据评分表：
   - evidence strength
   - user severity
   - current service gap
   - product fit
   - safety risk

## 11. 核心学习点

数据分析不只是画图。

对这个项目来说，真正的工作是：

> 把混乱的官方证据整理成清晰的产品决策。

当前 pipeline 是第一步：它把选定的 ABS 报告表格变成一个可追踪的数据集，我们可以筛选、画图、质疑和继续改进。
