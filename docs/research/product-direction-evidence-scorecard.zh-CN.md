# Beacon 产品方向证据评分表

最后更新：2026-07-17

这份文档把前面的研究变成一个产品决策工具。

它不是数学模型，也不是最终结论。它是一张 research scorecard，用来帮助我们判断：

> Beacon 第一版到底应该优先做哪个方向？

## 1. 为什么要做评分表

如果只凭感觉，我们很容易在几个方向之间摇摆：

- 华人/CALD
- tech abuse
- dating app
- 国际学生
- 帮朋友
- 匿名故事
- 公开论坛
- 按州导航

但产品不能只靠“听起来有用”。我们要问：

1. 这个问题严重吗？
2. 现在有证据支持吗？
3. 现有服务是否已经解决了？
4. 网站/产品真的适合解决这个问题吗？
5. 会不会带来安全风险？

评分表的作用就是把这些判断摊开，不让我们被某个听起来很酷的功能带跑。

## 2. 评分维度

每个维度 1 到 5 分。

| 维度 | 5 分代表什么 | 1 分代表什么 |
|---|---|---|
| `problem_severity` 问题严重性 | 不支持会造成明显安全/法律/心理/生活后果 | 问题相对轻，或不是核心安全问题 |
| `evidence_strength` 证据强度 | 已有官方数据、研究或系统地图支持 | 主要是猜测，还缺证据 |
| `service_gap` 服务缺口 | 现有服务明显没有很好解决第一步问题 | 现有服务已经覆盖得比较好 |
| `product_fit` 产品适配度 | 网站/工具能实际降低用户困惑或风险 | 产品很难帮上忙，或会变成泛泛信息 |
| `safety_score` 安全分 | 越高越安全，越容易低风险实现 | 越低越危险，容易伤害用户 |

注意：

> `safety_score` 是“越高越安全”，不是“风险越高分越高”。

## 3. 当前评分结果

结构化 CSV 在这里：

[product_direction_scorecard.csv](</C:/Users/youju/OneDrive/Documents/anti/ANTI-VOILENT/data/processed/product_direction_scorecard.csv>)

## 4. 排名概览

| 排名 | 方向 | 总分 | 置信度 | 建议 |
|---:|---|---:|---|---|
| 1 | 按州/领地的第一步安全导航 | 24 | High | 第一版核心架构 |
| 2 | 中文/CALD 双语安全导航 | 19 | Medium | 下一步重点验证 |
| 2 | 技术促成虐待/手机账号定位安全 | 19 | Medium | 下一步重点验证 |
| 4 | 旁观者/帮助朋友路径 | 18 | Medium | 可作为重要次入口 |
| 5 | 匿名故事库 | 16 | Low-Medium | 可测试，但不要先做大社区 |
| 6 | Dating app/早期关系安全 | 15 | Low-Medium | 保留为研究线索 |
| 6 | 国际学生关系与安全支持 | 15 | Low-Medium | 保留为研究线索 |
| 8 | 公开用户论坛 | 9 | Low | 不建议第一版做 |

## 5. 逐项解释

### 5.1 按州/领地的第一步安全导航

英文方向：State-aware first-step navigator

分数：

- 问题严重性：5
- 证据强度：5
- 服务缺口：5
- 产品适配度：5
- 安全分：4
- 总分：24

为什么高：

ABS 数据已经显示州/领地之间存在差异。我们前面做的系统地图也显示，不同州的法律、保护令名称、coercive control 状态、法院/警察/服务路径都不一样。

这说明 Beacon 不能只给一个全国统一答案。

产品含义：

> Beacon 第一版应该先做成 state-aware navigator。用户早期流程里应该询问州/领地，然后根据所在地区给不同下一步路径。

还缺什么：

- 每个州/领地更细的官方路径审计
- 用户是否理解“为什么要问州/领地”的可用性测试
- 询问州/领地是否会让用户担心隐私

建议：

> 第一版核心架构先做这个。

### 5.2 中文/CALD 双语安全导航

英文方向：Chinese/CALD bilingual navigator

分数：

- 问题严重性：4
- 证据强度：3
- 服务缺口：4
- 产品适配度：4
- 安全分：4
- 总分：19

为什么有潜力：

ABS 能证明澳洲总体暴力问题很大，但不能直接证明中文用户或 CALD 用户的具体需求。不过，从服务系统复杂性、法律语言、文化障碍、签证/家庭/经济顾虑来看，这个方向很值得验证。

产品含义：

> 如果后续研究证明中文用户确实卡在“看不懂系统、不知道找谁、不敢问、不知道后果”，Beacon 可以成为中英双语 first-step navigator。

还缺什么：

- ANROWS / eSafety 关于 CALD 用户的证据
- 中文服务可获得性审计
- 华人用户、社区组织、support worker 访谈

建议：

> 下一步重点验证。不要只因为我们会中文就默认这个方向成立，要用研究证明。

### 5.3 技术促成虐待/手机账号定位安全

英文方向：Technology-facilitated abuse first-aid

分数：

- 问题严重性：4
- 证据强度：3
- 服务缺口：4
- 产品适配度：5
- 安全分：3
- 总分：19

为什么重要：

很多用户可能不会一开始搜索 domestic violence。他们更可能搜索：

- 他总看我手机
- 我觉得我被定位了
- 他知道我在哪里
- 我们共用 Apple ID 怎么办
- 我离开前怎么保护手机

这类问题非常适合产品化，因为它能变成 checklist、风险提示、隐私设计和安全路径。

但它也更危险，因为错误建议可能让用户更不安全。

还缺什么：

- eSafety / ANROWS / WESNET 证据
- support worker 访谈
- 安全专家 review
- 明确“什么可以检查，什么不要贸然检查”

建议：

> 下一步重点验证。设计时必须 privacy-first、no-login、low-data-retention。

### 5.4 旁观者/帮助朋友路径

英文方向：Bystander or help-a-friend pathway

分数：

- 问题严重性：3
- 证据强度：3
- 服务缺口：4
- 产品适配度：4
- 安全分：4
- 总分：18

为什么值得做：

不是所有访客都是直接受害者。很多人可能是朋友、同学、室友、同事、家人。他们可能想帮忙，但不知道怎么说、怎么问、怎么避免让情况变糟。

产品含义：

> Beacon 可以有一个 “I want to help someone” 的入口，提供安全对话脚本、不要做什么、什么时候联系专业支持。

还缺什么：

- bystander resources 审计
- support worker 访谈
- 对朋友/同学/室友场景做可用性测试

建议：

> 可以作为第一版的重要次入口。

### 5.5 匿名故事库

英文方向：Reviewed anonymous story library

分数：

- 问题严重性：3
- 证据强度：2
- 服务缺口：4
- 产品适配度：4
- 安全分：3
- 总分：16

为什么不是第一优先：

故事能帮助用户确认“不是只有我这样”，也能帮助他们理解真实路径。但故事内容有隐私、创伤和误导风险。

如果做，应该是：

- 匿名
- 审核后发布
- 不开放即时评论
- 不允许私信
- 配专业说明
- 按州/情境分类

建议：

> 可以作为公开论坛的安全替代方案，但不应该在第一版做成大社区。

### 5.6 Dating app/早期关系安全

英文方向：Dating or early relationship safety

分数：

- 问题严重性：3
- 证据强度：2
- 服务缺口：3
- 产品适配度：3
- 安全分：4
- 总分：15

为什么暂时不是第一核心：

ABS 能说明 boyfriend/girlfriend/date violence 存在，但不能直接证明 dating app 用户会需要 Beacon。

还缺什么：

- AIC dating app research
- dating platform 安全工具审计
- 年轻用户/国际学生访谈

建议：

> 保留为研究线索，不作为第一版核心。

### 5.7 国际学生关系与安全支持

英文方向：International student safety

分数：

- 问题严重性：3
- 证据强度：2
- 服务缺口：3
- 产品适配度：3
- 安全分：4
- 总分：15

为什么有可能：

国际学生可能面对签证、住房、学校、父母、语言和经济依赖问题。但 ABS 不能直接证明这个群体的具体动机。

还缺什么：

- 大学支持路径审计
- 国际学生访谈
- student association / wellbeing staff 访谈

建议：

> 先研究，不要急着单独定位。它可能和中文/CALD 或 dating safety 合并。

### 5.8 公开用户论坛

英文方向：Public user forum

分数：

- 问题严重性：3
- 证据强度：1
- 服务缺口：2
- 产品适配度：2
- 安全分：1
- 总分：9

为什么不建议第一版做：

公开论坛在反暴力产品里风险很高：

- 身份暴露
- 施暴者监控
- 错误建议
- 私信骚扰
- 截图传播
- 创伤触发
- 审核负担
- 法律和安全责任

建议：

> 不做第一版。先考虑审核后的匿名故事库、专业 Q&A、按州导航和安全 checklist。

## 6. 当前结论

目前最合理的产品方向不是：

> 做一个什么都有的 anti-violence website。

更合理的是：

> 做一个按州/领地、按情境、按隐私风险设计的 first-step safety navigator。

第一版可以这样定位：

> Beacon helps people in Australia understand their safest first step when they are unsure, unsafe, monitored, culturally isolated, or not ready to contact formal services.

中文：

> Beacon 帮助澳大利亚用户在不确定、不安全、可能被监控、语言文化上孤立，或还没准备好联系正式机构时，找到更安全的第一步。

## 7. 下一步怎么用这张表

下一步不是直接做 UI。

建议顺序：

1. 对排名前 3 的方向补证据：
   - state-aware navigator
   - Chinese/CALD navigator
   - tech abuse first-aid
2. 做服务审计：
   - 每个州官方路径
   - 中文/CALD 服务
   - eSafety / tech abuse 资料
3. 做 5 到 8 个低风险访谈：
   - support worker
   - community worker
   - student wellbeing staff
   - bystander/helper
4. 设计第一版 prototype：
   - 不是完整网站
   - 只验证第一步流程
5. 做 usability + safety test：
   - 用户是否理解
   - 是否感到安全
   - 是否知道下一步
   - 是否暴露过多个人信息

## 8. 重要提醒

这个评分表是 research decision tool，不是绝对答案。

如果后续访谈或服务审计发现新的证据，分数应该更新。

好的研究不是一次性写死结论，而是不断让证据修正产品方向。
