# pss_key_metrics.csv 中文数据字典

最后更新：2026-07-14

这个文档解释 `data/processed/pss_key_metrics.csv` 怎么看。

先记住一句话：

> CSV 里的一行不是一个完整结论，而是从 ABS 原始 Excel 某个格子抽出来的一个数据点。

## 1. 什么是 metric？

这里的 `metric` 可以理解成：

> 一个被测量出来的指标数值。

比如：

> NSW 女性中，有 36.7% 从 15 岁以来经历过 total violence。

这就是一个 metric。

它包括：

- 测量什么：`Total violence since age 15`
- 测量谁：`Women`
- 在哪里：`New South Wales`
- 什么时间窗口：`Since age 15`
- 数值是多少：`36.7`
- 数据可靠性如何：`RSE 3.8`, generally reliable
- 来自哪里：ABS `Table 9.3` 第 8 行第 2 列

## 2. 先看哪些列

第一次看 CSV，不要一上来读所有列。

先看这 6 列：

| 列名 | 人话解释 |
|---|---|
| `indicator` | 这个数字在测量什么 |
| `jurisdiction` | 哪个国家/州/领地 |
| `sex` | 哪个性别或群体 |
| `period` | 时间段 |
| `value_percent` | 百分比数值 |
| `reliability_flag` | 这个数值能不能放心使用 |

如果你只想读懂结论，先看这 6 列就够了。

## 3. 其他列是干什么的

其他列主要是为了追溯来源。

| 列名 | 用途 |
|---|---|
| `metric_id` | 这一行的唯一 ID，不需要优先看 |
| `dataset` | 数据集名称 |
| `official_source_url` | ABS 官方页面 |
| `source_file` | 来自哪个原始 Excel 文件 |
| `source_sheet` | 来自哪个 sheet |
| `source_cell_row_1_based` | 原始 Excel 第几行 |
| `source_cell_col_1_based` | 原始 Excel 第几列 |
| `population` | ABS 表里定义的人群 |
| `reference_period` | ABS 发布时期 |
| `experience_window` | 经验发生窗口，比如 since age 15 或 last 12 months |
| `rse_percent` | 相对标准误 |
| `unit` | 单位，目前都是 percent |
| `notes` | 备注和限制 |

这些列不是给你第一眼读结论用的，而是为了回答：

> 这个数字到底从哪里来的？我能不能回原表核对？

## 4. 一行数据怎么翻译成人话

CSV 里可能有这样一行：

| indicator | jurisdiction | sex | period | value_percent | rse_percent |
|---|---|---|---|---:|---:|
| Total violence since age 15 | New South Wales | Women | Since age 15 | 36.7 | 3.8 |

人话翻译：

> 在 NSW，18 岁及以上女性中，有 36.7% 表示自己从 15 岁以来经历过 total violence。这个估计值的 RSE 是 3.8%，按我们的规则属于 generally reliable。

再看来源列：

| source_sheet | source_cell_row_1_based | source_cell_col_1_based |
|---|---:|---:|
| Table 9.3 | 8 | 2 |

意思是：

> 这个数字来自 ABS 原始 workbook 的 `Table 9.3`，第 8 行第 2 列。

## 5. value_percent 怎么读

`value_percent = 36.7` 的意思是：

> 36.7%

不是 0.367。

所以如果你在 Excel 里画图，可以直接把它当成百分比数值。

如果你在 Python 里需要转成比例，可以除以 100：

```python
df["value_ratio"] = df["value_percent"] / 100
```

## 6. RSE 和 reliability_flag 怎么读

`rse_percent` 是 relative standard error。

简单理解：

> RSE 越高，这个估计值越不稳定。

我们用了这个简单规则：

| reliability_flag | 人话解释 |
|---|---|
| `generally_reliable_rse_under_25` | 一般可以使用 |
| `use_with_caution_rse_25_to_50` | 要谨慎，不要下强结论 |
| `too_unreliable_for_general_use_rse_over_50` | 通常不适合做一般结论 |
| `not_available_or_not_applicable` | 没有 RSE 或不适用 |

做图或写结论时，优先使用：

> `generally_reliable_rse_under_25`

看到 `use_with_caution` 时，要在文字里提醒。

## 7. 常见筛选方式

### 想看全国问题规模

筛选：

- `jurisdiction = Australia`
- `period = Since age 15` 或 `period = 2021-22`

适合回答：

> 澳洲整体问题有多大？

### 想看州/领地差异

筛选：

- `source_sheet = Table 9.3`
- `sex = Women`

适合回答：

> 哪些州/领地的数据更高？Beacon 为什么要 state-aware？

### 想看趋势

筛选：

- `source_sheet = Table 3.1`
- `experience_window = Last 12 months`

适合回答：

> 某些指标是上升、下降，还是相对稳定？

### 想看某一种暴力类型

筛选：

- `indicator` 包含你关心的词，例如：
  - `sexual violence`
  - `physical violence`
  - `intimate partner`
  - `stalking`
  - `sexual harassment`
  - `economic abuse`
  - `emotional abuse`

适合回答：

> 这个类型的问题规模如何？

## 8. 这个 CSV 不是直接给用户看的

这点很重要。

`pss_key_metrics.csv` 是给研究者和分析过程看的，不是给最终用户看的。

最终用户不应该看到：

> Table 9.3, row 8, column 2, rse_percent 3.8

最终用户应该看到的是：

> 不同州/领地的风险和服务路径不同，所以我们需要先知道你在哪个州/领地，才能给你更合适的下一步。

也就是说：

> CSV 是证据库，产品界面是翻译后的行动路径。

## 9. 一个完整分析例子

研究问题：

> Beacon 为什么应该按州/领地导航？

第一步：筛选数据

- `source_sheet = Table 9.3`
- `sex = Women`
- `indicator = Total violence since age 15`

第二步：看结果

| jurisdiction | value_percent |
|---|---:|
| New South Wales | 36.7 |
| Victoria | 38.6 |
| Queensland | 41.6 |
| South Australia | 39.4 |
| Western Australia | 42.0 |
| Tasmania | 42.6 |
| Northern Territory | 45.6 |
| Australian Capital Territory | 41.9 |
| Australia | 39.2 |

第三步：转成人话

> ABS 数据显示，不同州/领地女性 since age 15 的 total violence prevalence 不一样。再结合各州法律、保护令和服务路径差异，Beacon 不应该只给全国统一答案，而应该先询问用户所在州/领地。

第四步：转成产品决策

> 第一屏或早期流程应加入 state/territory 选择。

## 10. 你读 CSV 时可以用的顺序

建议顺序：

1. 先看 `indicator`
2. 再看 `jurisdiction`
3. 再看 `sex`
4. 再看 `period`
5. 再看 `value_percent`
6. 最后看 `reliability_flag`
7. 如果要核对来源，再看 `source_sheet`、row、column

不要一开始盯着 `metric_id`。

`metric_id` 是机器友好的，不是人友好的。

## 11. 最重要的理解

这个 CSV 的作用不是“给你一个漂亮表格”。

它的作用是：

> 把 ABS 原始报告里的数字，变成可以筛选、比较、画图、复查、继续分析的证据库。

你真正要学会的是：

> 从一个数据点，走到一个研究结论，再走到一个产品决策。
