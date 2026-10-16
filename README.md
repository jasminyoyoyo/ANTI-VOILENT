# Beacon

> 面向澳大利亚家庭暴力与亲密关系暴力情境的创伤知情型支持体验。  
> A trauma-informed support experience for people affected by domestic and family violence in Australia.

[在线体验 / Live Demo](https://anti-voilent.vercel.app)

> [!IMPORTANT]
> **Beacon 不是紧急服务，也不能替代专业法律、医疗或心理支持。**  
> 如果你在澳大利亚正面临即时危险，请拨打 **Triple Zero (000)**。你也可以联系 **1800RESPECT**：拨打 **1800 737 732**、发送短信至 **0458 737 732**，或使用其在线聊天和视频通话服务。
>
> **Beacon is not an emergency service and does not replace professional legal, medical or counselling support.**  
> If you are in immediate danger in Australia, call **Triple Zero (000)**. You can also contact **1800RESPECT** by calling **1800 737 732**, texting **0458 737 732**, or using its online chat and video call services.

## 项目愿景 · Project vision

Beacon 探索一个问题：当求助者可能紧张、受监控、尚未准备好离开，或只是想先了解自己的处境时，数字产品如何提供更安全、更克制、更尊重自主权的支持？

项目围绕创伤知情设计展开，强调安全、选择、透明和非评判性表达。它不是用技术替代专业服务，而是尝试降低获取可靠信息、梳理风险与制定安全计划的门槛。

Beacon explores how a digital product can offer safer, calmer and autonomy-respecting support when someone may be distressed, monitored, not ready to leave, or simply trying to understand their situation. It is a research-led demonstration—not a replacement for trained services.

## 核心功能 · Key features

- **支持性 AI 对话**：以非评判、创伤知情的方式提供信息与下一步选择
- **风险自查**：帮助用户识别可能需要关注的危险信号
- **个性化安全计划**：整理联系人、重要物品和可执行的安全步骤
- **本地资源发现**：帮助查找澳大利亚境内相关支持服务
- **快速退出**：在需要时迅速离开当前页面
- **伪装模式**：将界面切换为较不敏感的外观，降低旁观风险
- **研究驱动设计**：仓库包含澳大利亚情境研究、服务系统分析、用户旅程假设与功能验证资料

## 设计原则 · Design principles

1. **安全优先**：任何便利性都不应凌驾于用户安全之上。
2. **尊重自主权**：不命令用户离开，不替用户作决定。
3. **减少认知负担**：在高压力情境中提供清晰、可扫描的信息。
4. **坦诚技术边界**：AI 可能出错，资源与建议在使用前需要核实。
5. **研究先于功能**：产品方向由证据、情境和服务生态共同约束。

## 技术栈 · Tech stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Google Gemini API / Xiaomi MiMo API
- Vercel

## 本地运行 · Run locally

### 环境要求

- Node.js 18+
- npm

### 安装

```bash
git clone https://github.com/jasminyoyoyo/ANTI-VOILENT.git
cd ANTI-VOILENT
npm install
```

复制环境变量示例：

```bash
cp .env.example .env.local
```

Windows PowerShell：

```powershell
Copy-Item .env.example .env.local
```

在 `.env.local` 中选择 AI 服务提供商：

```env
VITE_AI_PROVIDER=gemini
VITE_GEMINI_API_KEY=your_key_here
```

或：

```env
VITE_AI_PROVIDER=mimo
VITE_MIMO_API_KEY=your_key_here
```

启动开发服务器：

```bash
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

## 项目结构 · Project structure

```text
components/      通用界面、安全退出、资源地图与伪装组件
pages/           首页、对话、资源、风险自查与安全计划页面
services/        AI 路由、提示词和风险评估逻辑
data/            原始与处理后的研究数据
docs/research/   产品研究、数据分析和验证材料
public/images/   界面与研究使用的图片资源
```

## 隐私与安全提醒 · Privacy and safety notes

- 不要在测试过程中输入真实姓名、地址、证件号码或其他敏感个人信息。
- 使用第三方 AI 服务时，数据处理方式受相应提供商条款约束。
- 快速退出和伪装模式可以降低部分风险，但无法清除浏览器历史、网络日志或设备监控记录。
- AI 生成内容可能不完整或不准确；采取行动前请向可靠的专业服务核实。
- 部署或公开演示前，应完成隐私、安全、无障碍和内容审核。

## 研究资料 · Research

`docs/research/` 收录了项目的研究过程，包括：

- 澳大利亚家庭暴力支持系统与情境分析
- 竞品与服务路径研究
- 用户旅程和研究问题
- 功能验证矩阵与证据评分
- 数据处理方法与指标字典
- 中英文研究计划及交接资料

这些资料用于记录设计判断的依据，并不构成专业建议。

## 当前状态 · Status

Beacon 目前是一个持续迭代的研究型演示项目。核心体验已经可以运行，但在作为真实公共服务使用之前，仍需要专业领域审查、完整的安全测试、隐私评估、内容治理和可访问性验证。

## 贡献 · Contributing

欢迎通过 Issue 提交以下内容：

- 可访问性或界面问题
- 已失效或不准确的资源链接
- 安全与隐私风险
- 创伤知情语言改进建议
- 技术缺陷和文档修正

提交内容时请勿包含任何真实个案或可识别个人身份的信息。

## 许可 · Licence

本仓库目前未声明开源许可证。除非另有说明，保留所有权利。若计划接受外部代码贡献或复用项目内容，请先添加合适的许可证。

## 官方求助资源 · Official support

- [1800RESPECT](https://1800respect.org.au/) — 澳大利亚全国性家庭、家庭关系及性暴力咨询、信息与支持服务
- [Triple Zero (000)](https://www.triplezero.gov.au/) — 澳大利亚紧急警察、消防与救护服务
