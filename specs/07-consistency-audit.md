# 7. 一致性审查报告 Consistency Audit

> 审查日期: 2026-05-14 | 审查者: Brand Guardian | 审查范围: 01 ~ 06 全部六份规范文档

---

## 7.1 审查概览

### 审查范围

| 文档 | 文件名 | 核心内容 |
|------|--------|---------|
| 01 | `01-brand-core.md` | 品牌定位、调性、色彩语义、视觉隐喻、红线 |
| 02 | `02-visual-system.md` | 色彩 token、排版、间距、圆角、阴影、硬编码修复 |
| 03 | `03-component-layout.md` | 页面架构、组件模式、毛玻璃参数、样式方案 |
| 04 | `04-illustration-style.md` | SVG Glyph 体系、色彩约束、动效要求、反面约束 |
| 05 | `05-illustration-prompts.md` | 插图 prompt 模板、色彩速查、平台优化 |
| 06 | `06-motion-language.md` | 缓动曲线、时长阶梯、动效矩阵、交互反馈 |

### 发现统计

| 严重度 | 数量 | 说明 |
|--------|------|------|
| **CRITICAL** | **4** | 必须修复，否则导致开发实现偏差或品牌表达矛盾 |
| **WARNING** | **3** | 建议修复，不修复可能导致理解歧义或未来维护困难 |
| **INFO** | **1** | 可忽略，仅作记录 |

---

## 7.2 已发现的不一致（按严重度排序）

### CRITICAL (必须修复)

| # | 文档 A | 文档 B | 矛盾描述 | 建议修复 |
|---|--------|--------|---------|---------|
| C1 | 02-visual-system 2.6.1 | globals.css L80-L82 / design-tokens.json | **Duration Token 数值冲突**。`globals.css` 在用值为 fast=150ms / normal=300ms / slow=500ms；`tokens.css`（由 design-tokens.json 生成）值为 fast=200ms / normal=350ms / slow=600ms。两套值同时存在于代码库中，且 `tokens.css` 未被 `@import` 引入。02-visual-system 已识别此冲突并建议以 `globals.css` 为准，但 06-motion-language 也独立确认了此修复方案。若不统一，未来生成的 `tokens.css` 会覆盖实际行为。 | 以 `globals.css` 为准（150/300/500），更新 `design-tokens.json` 源值。新增 `instant: 80ms` 和 `crawl: 1000ms`。重新生成 `tokens.css`。 |
| C2 | 01-brand-core 1.5 | 06-motion-language 6.7.3 / 03-component-layout 3.3 | **Loop 节点命名双重体系未明示**。01-brand-core 的代码落地注释（L33）使用 `Staff/AI/Manager/Dream/Boss/Task` 作为 `LOOP_NODES` 标识符，而 The Loop 的概念节点为 `Signal/Compress/Review/Decide/Execute/Learn`。03-component-layout 和 06-motion-language 一致使用概念名称。但 01-brand-core 的代码注释会让读者误以为两套名称是同一事物。 | 在 01-brand-core 1.5 中明确区分：概念节点（Signal/Compress/Review/Decide/Execute/Learn）为品牌叙事层，代码变量名（Staff/AI/Manager/Dream/Boss/Task）为技术实现层，两者的映射关系通过 `design-tokens.json` 的 `loopRail.nodes` 配置。 |
| C3 | 02-visual-system 2.1.2 | 01-brand-core 1.4 | **`brand-accent-alt` (#6366F1) 未在品牌核心文档中定义**。02-visual-system 定义了 `brand-accent-alt`（靛蓝，`#6366F1`，`oklch(0.50 0.20 280)`），`globals.css` L7 也声明了 `--color-brand-accent-alt`。但 01-brand-core 的色彩语义映射（1.4 节）仅定义了 Primary/Accent/Cyan/Dark Surface 四色 + 信号色 + Gate 色，完全遗漏了 `brand-accent-alt`。这是一个品牌级颜色，应在品牌核心中锚定语义。 | 在 01-brand-core 1.4 节新增 `brand-accent-alt` 条目：靛蓝，`#6366F1`，语义为"谨慎辅助高亮"，使用场景限定为 LogoMarquee decision 节点和极少量视觉分层。 |
| C4 | 06-motion-language 6.2.1 | 06-motion-language 6.2.2 | **CSS `ease-in-out` 与 GSAP `sine.inOut` 的映射关系描述不一致**。6.2.1 定义 CSS `ease-in-out` 为 `cubic-bezier(0.65, 0, 0.35, 1)`，使用场景为"SVG path draw、Loop-back 路径绘制"。6.2.2 将 GSAP `sine.inOut` 映射到 CSS `--ease-in-out`，但同时 GSAP `power2.inOut` 也映射到 `--ease-in-out`。实际代码中，`sine.inOut` 的数学曲线 (`cubic-bezier(0.37, 0, 0.63, 1)`) 与 `power2.inOut` (`cubic-bezier(0.45, 0, 0.55, 1)`) 均不等于 `--ease-in-out` (`0.65, 0, 0.35, 1`)。三者是不同的缓动曲线，不应等价映射。 | 将 GSAP 到 CSS 映射表修正为"近似参考"而非"等价"：注明 `sine.inOut` 与 `power2.inOut` 均为 `--ease-in-out` 的视觉近似（语义同属"平滑往返"），但数学值不同。CSS 动画应使用对应的 CSS token，GSAP 动画使用 GSAP 缓动名。 |

### WARNING (建议修复)

| # | 文档 A | 文档 B | 矛盾描述 | 建议修复 |
|---|--------|--------|---------|---------|
| W1 | 01-brand-core 1.6 | 06-motion-language 6.1 / 04-illustration-style 4.5.4 | **"禁止弹跳"措辞过于宽泛**。01-brand-core 1.6 动画禁区表格中写"禁止循环弹跳：不使用 `bounce`、`elastic` 等缓动函数"。但 04 和 06 均允许 `back.out(2.5)` 和 `back.out(2)`，这两者具有"弹性过冲"（overshoot）特征。`back.out` 不是 `bounce` 或 `elastic`，但"等"字给读者留下模糊空间。 | 将 01-brand-core 的禁区措辞改为"禁止 `bounce` 和 `elastic` 缓动函数。`back.out` 仅限品牌标识特殊动画（如 Logo 眼睛弹出），其他场景禁止使用"。 |
| W2 | 04-illustration-style 4.5.3 | 06-motion-language 6.3.1 | **CSS @keyframes 动画时长分类存在歧义**。04 将 CSS @keyframes 分为 4 级（微交互 1.5-1.8s、标准循环 2.2-2.8s、慢速循环 5s、探索微移 2.4s），这些是"循环动画"的持续时间。06 定义的 duration token（80ms ~ 1000ms）是"单次过渡/入场"的持续时间。两者属于不同时长体系（循环 vs 过渡），但未在文档中明确区分。读者可能混淆两套时长标准。 | 在 06-motion-language 6.3 节开头增加注释："以下 duration token 适用于 CSS transition 和单次 GSAP 入场动画。CSS @keyframes 循环动画的时长由各 Glyph 组件自行定义（见 04-illustration-style 4.5.3），不受此阶梯约束。" |
| W3 | 02-visual-system 2.6.1 | globals.css 实际内容 | **`--duration-instant` 和 `--duration-crawl` 未实际存在于 globals.css**。02 和 06 均建议新增 `instant: 80ms` 和 `crawl: 1000ms`，但截至审查时 globals.css 中只有 `--duration-fast`、`--duration-normal`、`--duration-slow` 三个 token。设计规范已采纳此建议，但代码尚未同步。 | 在 `globals.css` 的 Motion 区域新增 `--duration-instant: 80ms` 和 `--duration-crawl: 1000ms`。 |

### INFO (可忽略)

| # | 描述 |
|---|------|
| I1 | 01-brand-core（L293）和 06-motion-language（L29）对"闪烁/抖动"禁令的 StatusDot pulse 例外描述完全一致，措辞几乎相同。非矛盾，仅说明两份文档的禁令同步良好。 |

---

## 7.3 修复结果

### C1: Duration Token 数值冲突

**处理方式**: 在 `design-system.md` 中确认以 `globals.css` 为准的权威值，并将修复操作纳入附录 A。`design-tokens.json` 源值需更新为 fast=150ms, normal=300ms, slow=500ms。新增 instant=80ms, crawl=1000ms。

**design-system.md 中的权威值**:

| Token | 值 | 来源 |
|-------|-----|------|
| `instant` | `80ms` | 新增 |
| `fast` | `150ms` | globals.css L80 |
| `normal` | `300ms` | globals.css L81 |
| `slow` | `500ms` | globals.css L82 |
| `crawl` | `1000ms` | 新增 |

### C2: Loop 节点命名双重体系

**处理方式**: 在 `design-system.md` 的品牌核心章节中明确标注两层命名：概念层（Signal/Compress/Review/Decide/Execute/Learn）和技术层（Staff/AI/Manager/Dream/Boss/Task），以及映射关系来源。

### C3: brand-accent-alt 缺失

**处理方式**: 在 `design-system.md` 的色彩速查表中纳入 `brand-accent-alt`，标注为"谨慎辅助色"。在品牌核心色彩章节中补充其语义定义。

### C4: 缓动曲线映射不一致

**处理方式**: 在 `design-system.md` 的动效章节中将 GSAP-to-CSS 映射表修正为"语义近似"而非"数学等价"，并注明各自的精确公式。

### W1: "禁止弹跳"措辞

**处理方式**: 在 `design-system.md` 红线速查中使用精确措辞，明确区分 `bounce`/`elastic`（禁止）和 `back.out`（仅限品牌标识）。

### W2: 时长体系歧义

**处理方式**: 在 `design-system.md` 动效速查中明确标注两套时长体系：duration token（过渡/入场）vs @keyframes 循环（Glyph 动画）。

### W3: instant/crawl 未落地

**处理方式**: 标记为待代码修复项，纳入附录 A 修复清单。

---

## 7.4 审查通过的章节

以下章节在交叉审查中**未发现不一致**：

| 文档 | 章节 | 审查结论 |
|------|------|---------|
| 01-brand-core | 1.1 品牌定位 | 一致。定位语句、三个"不是"、The Loop 六节点在所有文档中统一 |
| 01-brand-core | 1.2 目标受众 | 一致。受众画像和决策场景未与其他文档冲突 |
| 01-brand-core | 1.3 品牌调性 | 一致。5 个关键词（权威/克制/精密/流动/信任）在 04 和 05 中作为调性锚定一致引用 |
| 01-brand-core | 1.6 红线（除动画禁区措辞外） | 基本一致。视觉元素禁止清单与 04 完全对齐 |
| 02-visual-system | 2.1.1 品牌色 | 一致。四色 HEX/OKLCH/CSS var 三重校验通过 |
| 02-visual-system | 2.1.2 语义色 | 一致。Text/Surface/Border/Signal/Gate/Loop Rail 全部 token 值与 globals.css 一致 |
| 02-visual-system | 2.1.3 对比度矩阵 | 一致。WCAG 计算值与实际 HEX 值匹配 |
| 02-visual-system | 2.2 排版系统 | 基本一致。`Noto Sans SC` 缺失问题已标注在 2.6.2 |
| 02-visual-system | 2.3 间距 / 2.4 圆角 / 2.5 阴影 | 一致。全部 token 值与 globals.css 一致 |
| 03-component-layout | 全部章节 | 一致。页面架构、z-index 体系、样式方案、技术约束均无跨文档矛盾 |
| 04-illustration-style | 4.1 技术规范 | 一致。SVG 渲染方式、viewBox、stroke-width 与代码一致 |
| 04-illustration-style | 4.2 色彩约束 | 一致。Glyph 色阶与 02-visual-system 的硬编码统一方案完全对齐 |
| 04-illustration-style | 4.4 Glyph 体系 | 一致。所有 Glyph 的颜色引用与 4.2 的色彩矩阵一致 |
| 04-illustration-style | 4.6 反面约束 | 一致。禁止项与 01-brand-core 的红线完全对齐 |
| 05-illustration-prompts | 5.1 Prompt 框架 | 一致。色彩约束中的 HEX 值与 02-visual-system 完全匹配 |
| 05-illustration-prompts | 5.2 场景模板 | 一致。所有 prompt 中的颜色引用（HEX 和 rgba）与品牌色谱一致 |
| 05-illustration-prompts | 5.3 反面约束 | 一致。与 01 和 04 的禁止项完全对齐 |
| 06-motion-language | 6.1 核心原则 | 一致。禁止项与 01-brand-core 对齐，框架约束与 03-component-layout 一致 |
| 06-motion-language | 6.4 Section 动效矩阵 | 一致。与 03-component-layout 的组件配置和 ScrollTrigger 规格一致 |
| 06-motion-language | 6.5 粒子系统 | 一致。与 03-component-layout 的 Footer/PageParticles/FlowNavigation 参数一致 |
| 06-motion-language | 6.8 Reduced Motion | 一致。策略与 01-brand-core 的红线要求和 04 的回退规范完全对齐 |
