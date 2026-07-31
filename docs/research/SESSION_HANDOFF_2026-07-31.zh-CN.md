# “为什么不离开？”数据议题：项目交接与续作说明

更新日期：2026年7月31日  
GitHub仓库：`jasminyoyoyo/ANTI-VOILENT`  
当前分支：`main`

## 1. 这次在做什么

本轮数据分析围绕以下社会议题：

> **“为什么不离开？”可能问错了问题。**

核心观点不是替受害者作出选择，而是用数据说明：

> 当暴力关系、子女感情、住房压力、经济压力和安全风险交织，离开就不再只是一个人的决定。

计划先呈现暴力规模和离开过程，再分别研究：

1. 有多少女性经历过伴侣暴力；
2. 有多少女性曾试过暂时离开；
3. 有多少女性暂时离开后返回关系；
4. 感情、修复关系的希望和施暴者承诺；
5. 子女安全与照护压力；
6. 离开后的住房去向；
7. 紧急住宿和服务缺口；
8. 分开后暴力继续或加剧的风险；
9. 报警、起诉、上庭与司法回应；
10. 经济虐待和缺乏独立资金。

完整图表规划见：

- `docs/research/why-not-leave-data-story-plan.zh-CN.md`

## 2. 今天确认的关键数据口径

### 2.1 图1：伴侣暴力规模

ABS《Partner violence, 2021–22》Table 1.1：

- 澳大利亚18岁及以上女性估计总数：9,908,600；
- 自15岁以来经历同居伴侣暴力的女性：1,670,400；
- 比例：16.9%；
- 人数估计RSE：2.7%；
- 比例RSE：2.7%。

原始单元格：

- Table 1.1 B11：女性人数估计，单位为千人；
- Table 1.1 E11：女性比例；
- Table 1.2 B11：人数估计RSE；
- Table 1.2 E11：比例RSE；
- Table 1.1 B33：18岁及以上女性总数。

计算检查：

```text
1,670,400 ÷ 9,908,600 × 100 ≈ 16.86% ≈ 16.9%
100 ÷ 16.9 ≈ 5.92
```

因此可以通俗写成 `about 1 in 6`，但不能写成 `exactly 1 in every 6`。

### 2.2 “同居伴侣暴力”是什么意思

这里的 `cohabiting partner` 包括：

- 调查时共同生活的已婚或事实伴侣；
- 过去曾共同生活、目前已分居、离婚或丧偶的已婚或事实伴侣。

`Violence` 指身体或性侵害的发生、企图或威胁。图1的16.9%不自动包括所有情感虐待和经济虐待。

这是一项PSS抽样调查的人口估计，不是警方报案数，也不是警方记录案件数。

### 2.3 尝试离开与返回关系

ABS Table 18.1：

- 1,364,700名女性曾在共同生活期间经历前任伴侣暴力；
- 583,800人曾暂时分开，占42.8%；
- 218,900人暂时分开一次，占16.0%；
- 357,900人暂时分开多次，占26.2%；
- 369,400人在至少一次暂时分开期间由自己搬离住所，占63.3%。

重要解释：

- “曾暂时分开”本身意味着后来恢复过关系；
- 因此“曾试过离开”和“离开后回来”主要是同一批583,800人；
- 两个数字不能相加；
- 369,400人是其中曾实际搬离住所的子群体。

### 2.4 返回关系的原因

ABS Table 18.1，第22–33行：

| 原因 | 估计人数 | 比例 |
|---|---:|---:|
| 想尝试解决关系问题 | 335,100 | 57.4% |
| 伴侣承诺停止袭击或威胁 | 296,000 | 50.7% |
| 仍然爱着伴侣 | 261,000 | 44.7% |
| 没有钱或经济支持 | 125,500 | 21.5% |
| 无处可去 | 113,200 | 19.4% |
| 羞耻或尴尬 | 109,500 | 18.8% |
| 认为问题已经解决 | 81,500 | 14.0% |
| 担心孩子安全或福祉 | 80,000 | 13.7% |
| 担心自身安全或福祉 | 49,600 | 8.5% |

返回原因允许多选，比例不能相加为100%。

### 2.5 分开期间的风险

ABS Table 18.1：

- 124,700人报告暴力在暂时分开期间发生，占33.8%；
- 51,500人报告暴力在暂时分开期间加剧，占13.9%。

这只能说明分开后危险可能继续或加剧，不能将所有个案描述成“被抓回来”。

### 2.6 报警与司法回应

ABS Table 14.1：

- 1,532,400名经历前任伴侣暴力的女性；
- 489,300人的暴力经历曾被联系警方，占31.9%；
- 在警方曾被联系的群体中，164,200人的前任伴侣曾被警方起诉，占33.6%；
- 在前任伴侣曾被起诉的群体中，144,300人报告该前任伴侣曾因暴力案件上庭，占87.9%。

当前数据没有提供最终定罪、监禁期限、获释时间或后续报复结果，因此不能写成“报警没有用”，也不能计算报警后的报复概率。

### 2.7 住房和无家可归服务

AIHW Specialist Homelessness Services 2024–25：

- 约117,000名经历FDV的客户获得SHS协助；
- 占全部SHS客户约40%；
- 约46,800人在首次求助时已经无家可归；
- 约51,700人需要短期或紧急住宿；
- 约35,600人获得短期或紧急住宿。

不能未经技术定义核对就把51,700减去35,600并称为“被拒绝人数”，因为还要区分获得服务、获得转介和未满足需求。

## 3. 图1已经完成

### 3.1 当前英文版本

输出：

- `outputs/data_analysis/why_not_leave/chart_01_partner_violence_scale/chart_01_partner_violence_scale.png`

设计方向：

- 1080 × 1350，适合Instagram竖版；
- 英文；
- 简约日系编辑风格；
- 暖米白背景；
- 墨黑正文；
- 低饱和靛蓝强调；
- 小面积朱红识别元素；
- 使用精确的16.9%比例带，不再使用100个圆点。

当前标题：

> This is not a rare experience.

当前核心表述：

> About 1 in 6 Australian women aged 18 and over has experienced violence by a current or former cohabiting partner since age 15.

100%比例带的浅色部分标记为：

> No such experience reported

它只能表示PSS中未报告这项特定经历，不能解释为“从未经历任何家庭暴力”。

### 3.2 图1数据文件

- Datawrapper文件：  
  `outputs/data_analysis/why_not_leave/chart_01_partner_violence_scale/chart_01_datawrapper.csv`
- 来源、RSE与单元格审计表：  
  `outputs/data_analysis/why_not_leave/chart_01_partner_violence_scale/chart_01_source_detail.csv`
- 图表制作和Datawrapper说明：  
  `outputs/data_analysis/why_not_leave/chart_01_partner_violence_scale/README.md`
- 可重复运行的Python脚本：  
  `scripts/prepare_partner_violence_chart_01.py`

重新生成图1：

```powershell
python scripts\prepare_partner_violence_chart_01.py
```

如果系统Python缺少依赖，需要安装或使用包含 `openpyxl` 与 `Pillow` 的Python环境。

## 4. 已保存的原始ABS文件

目录：

`data/raw/abs/partner_violence_2021_22/`

文件：

- `Partner violence and abuse prevalence (Table 1).xlsx`
- `Women's experiences of partner violence (Tables 5 to 19).xlsx`

来源页面：

- https://www.abs.gov.au/statistics/people/crime-and-justice/partner-violence/2021-22

数据发布于2023年11月22日，参考时期为2021–22财年。

## 5. 数据混合规则

ABS PSS、AIHW SHS和警方Recorded Crime可以共同讲述同一社会议题，但统计对象不同：

| 来源 | 统计对象 | 指标性质 |
|---|---|---|
| ABS PSS | 澳大利亚成年人口抽样调查 | 经历比例和人口估计 |
| AIHW SHS | 接触专业无家可归服务的客户 | 服务需求与服务记录 |
| Recorded Crime | 被警方记录的受害者或案件 | 行政记录 |

可以将它们放在同一张多面板信息图中，但不能：

- 直接相加；
- 使用同一分母；
- 把PSS估计与警方记录的差值称为“未报警人数”；
- 把SHS客户数当成全部FDV受害者人数；
- 用双轴制造两组不同口径数据之间的虚假相关性。

每个图或面板必须写清：

1. 年份；
2. 人群；
3. 分母；
4. 单位；
5. 来源；
6. RSE或其他可靠性标记；
7. 是否允许多选。

## 6. 下一步工作顺序

### 下一张图：图2

主题：

> **Not that they never tried: about 584,000 women temporarily separated.**

待办：

- 从Table 18.1提取基数、暂时分开一次、多次和从未暂时分开；
- 从Table 18.2提取所有对应RSE；
- 输出英文Datawrapper CSV和来源审计表；
- 延续图1的暖米白、墨黑、靛蓝和小面积朱红风格；
- 选择流程图或比例条，不重复图1的视觉结构；
- 确保42.8%的分母写为“曾在共同生活期间经历前任伴侣暴力的女性”。

### 随后的图

1. 图3：曾搬离住所但后来返回；
2. 图4：爱、承诺与尝试修复关系；
3. 图5：孩子的安全和家庭责任；
4. 图6：离开以后能住哪里；
5. 图7：住宿需求与服务获得；
6. 图8：暂时分开期间暴力继续或加剧；
7. 图9：报警、起诉和上庭；
8. 图10：经济虐待和缺乏独立资金；
9. 图11：多因素综合收束。

## 7. 下次继续时先做什么

从GitHub拉取项目后：

```powershell
git clone https://github.com/jasminyoyoyo/ANTI-VOILENT.git
cd ANTI-VOILENT
```

如果本地已经有仓库：

```powershell
git pull origin main
```

然后依次阅读：

1. 本文件：`docs/research/SESSION_HANDOFF_2026-07-31.zh-CN.md`
2. 完整议题规划：`docs/research/why-not-leave-data-story-plan.zh-CN.md`
3. 图1说明：`outputs/data_analysis/why_not_leave/chart_01_partner_violence_scale/README.md`

继续执行：

> 从图2开始，提取ABS Table 18.1和18.2，制作英文Datawrapper CSV、来源审计表、Python图和README。

## 8. 当前未纳入本次分析提交的本地改动

提交前发现以下既有CSV在工作区中被改成了一行异常文本：

`outputs/data_analysis/recorded_crime_victims_2024/nsw_fdv_assault/nsw_fdv_related_assault_2014_2024.csv`

异常内容：

```text
year,police_recorded_vu'an's
```

该文件与今天的新议题工作无关，因此本次提交不应暂存它。后续需要决定：

- 是否恢复成原来2014–2024的11行NSW FDV assault数据；
- 或者保留该本地修改。

在作出决定前不要使用 `git add -A`，应明确指定本次提交文件。
