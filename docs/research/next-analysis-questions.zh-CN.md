# 下一步分析问题清单

最后更新：2026-07-14

这份文档把已经清洗出的 ABS 数据，转化成具体的分析任务。

重点不是“随便做一些图”，而是让每个分析任务都对应一个产品问题。

## 1. 分析问题 A：为什么要按州/领地导航？

产品问题：

> 为什么 Beacon 应该问用户在哪个州/领地？

使用数据：

- `data/processed/pss_key_metrics.csv`
- 筛选 `source_sheet = Table 9.3`
- 筛选 `sex = Women`

分析方法：

1. 比较每个州/领地和 Australia overall 在以下指标上的差异：
   - total violence since age 15
   - sexual violence since age 15
   - intimate partner/family member violence since age 15
   - sexual harassment since age 15
2. 按每个指标给州/领地排序。
3. 加入 `australia-state-violence-system-map.md` 里的法律/服务系统差异。

预期产出：

- 州/领地比较图
- 一段简短解释：
  - 数据显示州差异存在
  - 法律和服务系统地图显示各州路径不同
  - 所以产品应该 state-aware

## 2. 分析问题 B：第一屏应该识别哪些暴力类型？

产品问题：

> 第一屏应该只写 domestic violence，还是应该包含更多入口？

使用数据：

- `Table 1.3`
- `Table 2.3`
- `Table 9.3`

分析方法：

比较以下类型：

- sexual violence
- physical violence
- intimate partner/family violence
- emotional abuse
- economic abuse
- stalking
- sexual harassment

预期产品含义：

第一屏不应该只写 “domestic violence”。它应该使用用户更容易理解的入口，例如：

- “我不确定这算不算”
- “有人控制我或让我害怕”
- “我的手机/定位可能被监控”
- “约会或见面后发生了让我不安全的事”
- “我想安全地准备离开”
- “我想帮助别人”

## 3. 分析问题 C：ABS 能证明华人/CALD 方向吗？

产品问题：

> 只用 ABS，能不能证明我们应该聚焦中文用户或 CALD 用户？

使用数据：

- ABS PSS 只能证明总体问题规模
- 还需要其他来源：
  - ANROWS
  - eSafety CALD research
  - multicultural service directories
  - 中文服务可获得性
  - 访谈

分析方法：

1. 用 ABS 证明总体暴力问题规模。
2. 用服务审计查看中文路径是否容易找到。
3. 用访谈或问卷了解用户真实登陆动机。

预期结论：

ABS 能支持“这个问题在澳洲很重要”，但不能单独证明“Beacon 应该专门做华人/CALD 方向”。

## 4. 分析问题 D：Technology-Facilitated Abuse 是否是强方向？

产品问题：

> Beacon 是否应该包含手机/账号/定位安全路径？

使用数据：

- ABS stalking / harassment / emotional abuse 作为相邻问题规模信号
- eSafety tech abuse research
- ANROWS / WESNET 材料
- 用户或 support worker 访谈

分析方法：

1. 把 ABS 当作背景，不把它当作直接证明。
2. 建立 tech-abuse taxonomy：
   - 查看手机
   - 共享定位
   - 共用 Apple ID / Google account
   - spyware 或不明 app
   - 浏览器历史
   - 社交媒体监控
   - image-based abuse
   - dating app stalking
3. 把每种风险映射到产品回应：
   - 安全解释
   - checklist
   - 不应该做什么
   - 什么时候联系专业支持

预期结论：

这个方向需要外部证据，但可能非常适合产品，因为它会直接影响隐私和 UX 设计。

## 5. 分析问题 E：什么不应该先做？

产品问题：

> 哪些功能即使用户说想要，也可能很危险？

使用方法：

- 风险分析
- safety-by-design review
- 专家评审

第一版可能要避免：

- 公开论坛
- 用户 profile
- 用户之间私信
- 基于位置的社区匹配
- AI 法律建议
- 默认储存敏感故事

预期产出：

- 风险矩阵
- 更安全的替代方案：
  - 审核后的匿名故事库
  - 专业 Q&A
  - 按州的下一步导航
  - 不需要登录的安全 checklist

## 6. 下一份最有用的交付物

下一份最有价值的交付物应该是：

> Beacon 产品方向证据评分表

行可以包括：

- state-aware navigator
- Chinese/CALD navigator
- tech abuse first-aid
- dating safety
- international student safety
- bystander/helper pathway
- anonymous story library
- public forum

列可以包括：

- problem severity
- evidence strength
- service gap
- product fit
- safety risk
- data still needed
- recommended action

这份评分表会把 research 真正变成产品决策。
