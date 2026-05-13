# 5. 插图 Prompt 风格指南 Illustration Prompt Style Guide

---

## 5.1 Prompt 构建框架

### 通用前缀 (每次必须包含)

以下三段构成 AutoMage 插图的「品牌锚定前缀」，所有 prompt 必须在开头包含，确保生成结果不偏离品牌视觉语言。

#### 风格锚定 (Style Anchor)

```
Minimalist technical illustration, geometric abstraction style, clean vector linework with 1.5-2px strokes using round line caps and joins, translucent layered overlays, abstract data flow visualization inspired by system architecture diagrams, no photorealism, no 3D rendering, no flat illustration, no cartoon style
```

**中文说明**: 极简技术插图风格。以几何抽象为核心，线条 1.5-2px 粗细、圆头线帽与线角。半透明叠层，受系统架构图启发的数据流可视化。禁止写实、3D、扁平插画、卡通。

#### 色彩约束 (Color Constraint)

```
Strict color palette: deep navy #1E3A5F for authority and human-side elements, signal blue #3B82F6 for AI connections and active paths, highlight cyan #38BDF8 for data particles and light points, dark slate #0F172A for system interior and dashboard surfaces, off-white #FAFBFC for page backgrounds. Accent signals only: amber #F59E0B for warnings, red #EF4444 for risks, green #22C55E for completions. No warm color gradients, no pure gray, no neon colors, no saturated reds/oranges/purples outside signal usage
```

**中文说明**: 严格品牌四色谱约束。Navy 为人类权威色，Blue 为 AI 连接色，Cyan 为数据粒子色，Dark 为系统内部色。信号色仅限 amber/red/green 的状态标注用途。禁止暖色渐变、纯灰、霓虹色。

#### 调性关键词 (Tone Keywords)

```
Authoritative yet restrained, precise and clinical, flowing information energy, trustworthy system aesthetic. The mood is a control room, not a playground. Think engineering blueprint meets data visualization, not marketing illustration
```

**中文说明**: 权威而克制、精密而冷静、信息能量流动、可信赖的系统美学。调性是控制室而非游乐场。工程蓝图与数据可视化的交汇，而非营销插画。

---

### 变量槽位 (Variable Slots)

prompt 模板中以 `{{SLOT_NAME}}` 标记的可替换部分：

| 槽位 | 标记 | 说明 | 示例值 |
|------|------|------|--------|
| 场景描述 | `{{SCENE}}` | 整体场景环境 | "a dark dashboard interface showing signal intake" |
| 主体元素 | `{{SUBJECT}}` | 画面核心视觉对象 | "six nodes arranged in a circular orbital path" |
| 信息流阶段 | `{{LOOP_PHASE}}` | 对应 Loop 的哪个阶段 | "Signal intake phase / Noise compression / Decision gate" |
| 文字叠加 | `{{TEXT_OVERLAY}}` | 需要出现的文字内容 | "Signal > Compress > Review > Decide" |
| 构图方向 | `{{COMPOSITION}}` | 画面布局和视觉引导 | "left-to-right flow, noise-to-structure transformation" |
| 平台适配 | `{{PLATFORM}}` | 目标平台和尺寸 | "1200x630 for Open Graph, 16:9 for presentation" |

---

## 5.2 场景化 Prompt 模板

### 5.2.1 产品概念图 (Product Concept)

**场景**: 展示 AutoMage 核心 Loop 概念 -- 信息从噪声到决策的六节点闭环。

**模板 (英文)**:

```
Minimalist technical illustration, geometric abstraction style, clean vector linework with 1.5-2px strokes using round line caps and joins, translucent layered overlays, abstract data flow visualization inspired by system architecture diagrams.

Six abstract nodes arranged in a circular orbital path on a deep dark slate #0F172A background, connected by thin signal blue #3B82F6 lines with 10% opacity. A glowing cyan #38BDF8 particle travels along the path with a fading trail. Each node is a small circle — inactive nodes are translucent blue (rgba 59,130,246,0.15), the active node glows with signal blue #3B82F6. The center contains a subtle gradient sphere transitioning from deep navy #1E3A5F to signal blue #3B82F6, representing the compression core.

Text labels for each node in clean sans-serif: Signal, Compress, Review, Decide, Execute, Learn. Minimal, no decorative elements. The feeling is a mission control orbital diagram, not a social media graphic.

Strict color palette: navy #1E3A5F, blue #3B82F6, cyan #38BDF8, dark #0F172A. No warm colors, no 3D effects, no flat illustration, no cartoon, no photorealism.
```

**中文翻译参考**: 六个抽象节点沿环形轨道排列在深色背景上，由半透明蓝色细线连接。一个青色光点沿轨道移动并带有衰减尾迹。中心为 navy-to-blue 渐变球体代表压缩核心。整体是任务控制室的轨道图感。

**生成后检查清单**:
- [ ] 是否为六节点环形布局？
- [ ] 色彩是否仅使用 navy/blue/cyan/dark 四色？
- [ ] 是否有光点粒子沿轨道移动的视觉暗示？
- [ ] 中心是否有渐变压缩核心？
- [ ] 是否避免了通用 SaaS 图标（火箭、齿轮、拼图）？
- [ ] 是否传达了"闭环"而非"线性流程"？

---

### 5.2.2 信息流叙事图 (Information Flow Narrative)

**场景**: 展示从噪声到决策的转化过程 -- CompareSection 的核心叙事。

**模板 (英文)**:

```
Minimalist technical illustration, geometric abstraction style, clean vector linework with 1.5-2px strokes using round line caps and joins, translucent layered overlays, abstract data flow visualization.

Wide panoramic composition showing a left-to-right transformation journey on off-white #FAFBFC background. LEFT ZONE: 6-8 scattered rectangular fragments at random angles (rotated +-3 degrees), light gray #F1F5F9 backgrounds with subtle 1px borders, representing organizational noise — daily reports, chat messages, spreadsheets, meeting notes. Each fragment has faint text in muted slate #64748B. CENTER ZONE: Three concentric circles of increasing opacity (10%, 20%, 30%) in signal blue #3B82F6, with a solid gradient core sphere (navy #1E3A5F to blue #3B82F6, 48px diameter) representing the compression engine. Thin connecting lines (1px, 15% opacity blue) link the noise fragments toward the center. RIGHT ZONE: Three structured decision cards with white backgrounds, 3px left border in signal blue #3B82F6, each containing structured data rows (owner, deadline, risk level, action item) in clean typography.

The visual narrative: chaos on the left converges to a central processing core, outputting structure on the right. Authoritative and restrained, not playful. No 3D, no flat illustration style, no cartoon.
```

**中文翻译参考**: 宽幅构图展示左到右的转化旅程。左侧散落的噪声碎片（随机角度的矩形卡片），中心是三层同心圆加渐变核心球，右侧是带蓝色左边框的结构化决策卡。

#### 变体 A: 噪声阶段 (Noise Phase)

```
Minimalist technical illustration, geometric abstraction style. A collection of 8 scattered rectangular document fragments floating at random angles on a clean off-white #FAFBFC background. Fragments are light gray #F1F5F9 with 1px subtle borders, rotated between -4 and +4 degrees. Each fragment contains faint placeholder text in muted slate #64748B representing different information sources: daily reports, chat logs, spreadsheets, meeting notes, emails. Some fragments overlap slightly. The overall feeling is information overload and disorganization — organizational noise before processing. Fragments are evenly distributed with natural randomness. No connecting lines, no structure, no hierarchy. Clean minimal style, no 3D effects, no flat illustration, no cartoon.
```

#### 变体 B: 压缩阶段 (Compression Phase)

```
Minimalist technical illustration, geometric abstraction style. On a dark slate #0F172A background, three concentric circles radiate outward from center, each in signal blue #3B82F6 with increasing transparency: innermost ring 30% opacity, middle ring 20% opacity, outermost ring 10% opacity. At the exact center, a solid 48px gradient sphere transitions from deep navy #1E3A5F at the core to signal blue #3B82F6 at the edge, with a subtle glow (rgba 59,130,246, 0.2). Small data fragments (rectangular shards) are shown being pulled toward the center, shrinking and fading as they approach. The compression is active, in-motion. Thin radial lines (1px, blue 15% opacity) extend from fragments to the core. No text overlay. Deeply technical and precise. No 3D, no flat illustration, no cartoon.
```

#### 变体 C: 决策阶段 (Decision Phase)

```
Minimalist technical illustration, geometric abstraction style. Three structured decision cards arranged vertically with 16px gaps on a clean off-white #FAFBFC background. Each card is a white rectangle with rounded corners (12px radius), a 3px left border in signal blue #3B82F6, and subtle shadow. Each card displays structured data rows: "Owner: [name]", "Deadline: [date]", "Risk: [high/medium/low]" with colored risk badges (red #EF4444 for high, amber #F59E0B for medium, green #22C55E for low), and "Action: [description]". Typography is clean sans-serif, data-precise. A thin dashed vertical line (signal blue, 2px, 40% opacity) connects the cards suggesting flow. The feeling is structured clarity emerging from chaos. No 3D, no flat illustration, no cartoon, no decorative elements.
```

**生成后检查清单**:
- [ ] 左到右的叙事方向是否清晰？
- [ ] 噪声碎片是否呈散乱状态（随机角度、无对齐）？
- [ ] 决策卡是否带蓝色左边框和结构化数据？
- [ ] 色彩是否仅使用品牌色谱？
- [ ] 是否避免了"对话气泡"暗示聊天工具？
- [ ] 是否传达了"转化"而非"并列展示"？

---

### 5.2.3 权限门控图 (Human Gate)

**场景**: 展示 AI + 人类双密钥授权概念 -- SecuritySection 的核心叙事。

**模板 (英文)**:

```
Minimalist technical illustration, geometric abstraction style, clean vector linework with 1.5-2px strokes, translucent layered overlays, abstract system diagram.

Horizontal four-stage pipeline on a dark slate #0F172A background, flowing left to right. STAGE 1 (AI Suggestion): A hexagonal shape with 3 orbital dots in signal blue #3B82F6, representing AI capability. STAGE 2 (Policy Check): A shield or gate symbol in muted blue, representing automated policy validation. STAGE 3 (Human Confirmation): A human-side symbol in deep navy #1E3A5F — the authority gate, visually heavier and more grounded than the AI side. STAGE 4 (Execution Released): A green #22C55E unlocked symbol indicating approved execution.

Stages connected by thin horizontal lines (1px, blue, 20% opacity) with small directional arrows. Between Stage 2 and Stage 3, a prominent visual gate or checkpoint barrier — a vertical dashed line or door symbol — marking the AI/Human boundary. The gate is the visual centerpiece: it separates what AI can do (suggest, analyze, compress) from what only humans can do (confirm, authorize, decide). Two distinct color codes: blue #3B82F6 for AI-side, navy #1E3A5F for human-side. A small "unlocked" green indicator shows when human confirmation is complete.

No text labels needed. The visual language alone communicates: AI proposes, gate exists, human decides. Authoritative, precise, trustworthy. No 3D, no flat illustration, no cartoon, no robotic/AI-imagery.
```

**中文翻译参考**: 水平四阶段管道，从 AI 建议（蓝色六边形+轨道点）到策略校验，再到人类确认门控（深海军蓝，更重更沉稳的视觉重量），最后到执行释放（绿色解锁）。Stage 2 和 Stage 3 之间的门控边界是视觉核心。

**生成后检查清单**:
- [ ] 是否有清晰的 AI 侧 (blue) 与人类侧 (navy) 色彩分离？
- [ ] 是否有可见的门控/关卡边界？
- [ ] AI 元素是否使用六边形+轨道点而非"AI 大脑"？
- [ ] 人类侧是否视觉上更"重"（更深色、更沉稳）？
- [ ] 是否传达了"AI 建议但不能越权"的核心信息？
- [ ] 是否避免了机器人/人形 AI 形象？

---

### 5.2.4 社交媒体分享图 (Social Card)

**场景**: og:image / 微信分享卡片 -- 用于社交媒体平台的品牌分享图。

**模板 (英文) -- og:image (1200x630)**:

```
Minimalist technical illustration, geometric abstraction style, clean vector linework with 1.5-2px strokes, translucent layered overlays. 1200x630 aspect ratio for Open Graph social sharing card.

Deep dark slate #0F172A background filling the entire canvas. LEFT SIDE: Abstract geometric composition — a simplified circular loop path (thin blue #3B82F6 lines, 15% opacity) with 6 small node dots, a cyan #38BDF8 particle with fading trail moving along the path. The loop is partially cropped at the left edge, suggesting continuation. CENTER-RIGHT: Clean typography zone. Large heading text in white #F1F5F9 "From Noise to Decision" (or Chinese "从噪声到决策") in bold sans-serif. Below, smaller subtitle text in muted slate #94A3B8: "Organizational Information Flow OS". Bottom-right corner: small brand mark area — a minimal eye-shaped logo in blue #60A5FA.

The composition balances abstract visual energy on the left with clear readable text on the right. Generous whitespace (dark space). The card should feel like a high-end tech conference slide, not a marketing banner. No stock imagery, no gradients, no decorative patterns, no 3D, no flat illustration.
```

**模板 (英文) -- 微信分享 (900x500)**:

```
Minimalist technical illustration, geometric abstraction style. 900x500 aspect ratio for WeChat sharing card.

Deep dark slate #0F172A background. Center composition: A simplified representation of the noise-to-decision transformation — left side shows 3-4 scattered small rectangular fragments (gray #F1F5F9, random rotations) representing noise, connected by thin converging lines (blue #3B82F6, 10% opacity) to a central gradient sphere (navy-to-blue). From the sphere, 3 structured card outlines emerge to the right with blue left borders. Minimal, symbolic, not detailed.

Below the visual: "AutoMage — 组织信息流 OS" in white, clean sans-serif. The entire composition is vertically centered with breathing room. Compact but impactful. No 3D, no flat illustration, no cartoon.
```

**文字叠加规范**:
- 主标题: 白色 #F1F5F9, Bold, 32-48px
- 副标题: Muted slate #94A3B8, Regular, 16-20px
- 品牌名: 白色或 blue #3B82F6, Medium, 14-16px
- 文字区域至少占画面 40% 宽度
- 确保文字与背景对比度 >= 4.5:1 (WCAG AA)

**生成后检查清单**:
- [ ] 尺寸是否为 1200x630 (og:image) 或 900x500 (微信)？
- [ ] 深色背景上文字是否清晰可读？
- [ ] 是否有品牌 Loop 视觉元素？
- [ ] 是否避免了密集信息堆砌（社交卡片需要"呼吸感"）？
- [ ] 是否适合在手机小屏预览时仍然辨识？

---

### 5.2.5 演讲/PPT 配图 (Presentation)

**场景**: 幻灯片背景或插图 -- 用于线下演讲、投资人演示。

**模板 (英文) -- 概念幻灯片**:

```
Minimalist technical illustration, geometric abstraction style, clean vector linework with 1.5-2px strokes, translucent layered overlays. 16:9 aspect ratio (1920x1080) for widescreen presentation slide.

Dark slate #0F172A background. The illustration occupies the left 60% of the canvas. Visual: An abstract information flow diagram showing the six Loop phases as connected nodes in a gentle arc (not full circle — open arc for presentation readability). Nodes are small circles (14-20px) with inactive nodes in translucent blue (rgba 59,130,246,0.15) and the currently active node in solid blue #3B82F6 with a soft glow. Connecting lines are thin (1px, blue, 10% opacity). A cyan #38BDF8 particle marks the current position. Each node has a small label beneath in clean sans-serif (12px, white on dark).

The right 40% is intentionally empty — this is where presentation text will be overlaid. A subtle gradient vignette darkens the right edge slightly to ensure text readability. No text in the illustration itself. The feeling is a technical diagram suitable for a boardroom, precise and authoritative. No 3D, no flat illustration, no cartoon, no decorative elements.
```

**模板 (英文) -- 数据对比幻灯片**:

```
Minimalist technical illustration, geometric abstraction style. 16:9 widescreen format.

Dark slate #0F172A background with subtle grid pattern (very faint blue lines, 3% opacity, 40px spacing) suggesting a technical dashboard. Left half: Abstract representation of scattered data fragments — 6-8 small rectangular cards at random angles, light gray backgrounds, some overlapping, representing raw organizational data. Thin blue lines (1px, 10% opacity) converge from the fragments toward the center.

Right half: Three clean decision cards emerge, neatly stacked with consistent spacing, each with a 3px blue left border and structured rows of data. A thin horizontal arrow (blue, 30% opacity) bridges the left and right halves at the vertical center, indicating transformation.

The left side is intentionally messier than the right. The contrast itself tells the story. Clean, technical, suitable for a professional presentation context. No 3D, no flat illustration, no cartoon.
```

**宽屏 16:9 比例适配要点**:
- 所有元素在 1920x1080 画布上测试
- 预留右侧 40% 空间给演讲文字
- 避免顶部和底部 10% 区域放置关键视觉（投影仪裁切区）
- 对比度考虑: 投影仪色彩偏暗偏灰，深色背景需加深 10-15%

**生成后检查清单**:
- [ ] 是否为 16:9 宽屏比例？
- [ ] 是否有预留文字叠加空间？
- [ ] 在投影仪低对比度环境下是否仍可辨识？
- [ ] 视觉复杂度是否适合演讲场景（不过于密集）？
- [ ] 是否避免了过于"营销化"的风格？

---

## 5.3 反面约束 Negative Prompts

### 5.3.1 核心 Negative Prompt (每次必须包含)

以下是所有 AutoMage 插图生成必须使用的 negative prompt 基础集：

```
Negative prompt: flat illustration, 3D render, isometric 3D, cartoon, anime, chibi, kawaii, cute style, cyberpunk, neon glow, neon colors, vaporwave, synthwave, photorealistic, photograph, real people, human faces, stock photo, robot, humanoid AI, brain neural network illustration, AI brain, chat bubbles, speech bubbles, conversation icons, rocket icon, gear icon, puzzle piece, light bulb cliche, handshake cliche, generic SaaS icons, corporate clipart, warm color gradients, orange gradient, red background, pure gray, gray background, saturated purple, magenta, busy pattern, decorative border, ornamental frame, text-heavy composition, watermark, lens flare, bokeh effect, cinematic lighting, dramatic shadows, HDR effect, film grain, vignette, Instagram filter, vintage filter
```

### 5.3.2 按类别分组详解

#### 风格禁止 (Style Prohibitions)

| 禁止项 | Negative Prompt 文本 | 禁止原因 |
|--------|---------------------|---------|
| 扁平插画 | `flat illustration, flat design illustration, flat vector art` | 扁平插画是 SaaS 行业的通用视觉语言（Notion、Linear、Stripe 均大量使用），使用它会让 AutoMage 淹没在同质化竞争中。AutoMage 的视觉语言是几何抽象+数据流，比扁平插画更精密、更技术、更克制 |
| 3D 渲染 | `3D render, 3D illustration, isometric 3D, 3D objects, three-dimensional, clay render, low poly 3D` | 3D 渲染传达"产品化玩具感"，与 AutoMage "精密系统"的调性冲突。3D 元素也容易引入非品牌色（材质色、环境光色） |
| 卡通/可爱 | `cartoon, anime, chibi, kawaii, cute style, whimsical, playful illustration, character design, mascot` | 卡通风格暗示"轻松工具"，而 AutoMage 面向企业决策者，调性要求权威和信任。卡通形象也会暗示 AI 有人格，与"AI 能建议但不能越权"的立场矛盾 |
| 赛博朋克/霓虹 | `cyberpunk, neon glow, neon colors, neon signs, vaporwave, synthwave, retro futuristic, Tron style, blade runner` | 赛博朋克美学的核心是"高科技低生活"和霓虹溢出，与 AutoMage "克制"的品牌调性直接对立。霓虹色也违反品牌四色谱约束 |
| 真人照片 | `photorealistic, photograph, real people, human faces, portrait photography, stock photo, editorial photography` | 真人照片会将注意力从"信息流系统"转移到"人的面部"，破坏产品即主角的叙事。也引入肤色/种族/年龄等无关变量 |

#### 色彩禁止 (Color Prohibitions)

| 禁止项 | Negative Prompt 文本 | 禁止原因 |
|--------|---------------------|---------|
| 暖色渐变 | `warm color gradient, orange gradient, sunset colors, red-to-orange, golden gradient` | 暖色传达"活力/热情/创意"，与 AutoMage "冷静/精密/权威"的调性冲突。品牌仅允许 amber/red 作为信号警告色 |
| 纯灰 | `pure gray, gray background, #808080, neutral gray, grayscale` | 品牌中性色基于 Slate 色系（带蓝色调的灰），纯灰缺乏品牌调性。设计规范明确禁止纯灰 |
| 霓虹/高饱和 | `neon colors, fluorescent, electric blue, hot pink, magenta, lime green, high saturation colors` | 超出品牌色谱范围，破坏视觉一致性 |
| 紫色主调 | `purple dominant, purple background, purple gradient, lavender, violet scheme` | 品牌体系中无紫色角色。accent-alt (#6366F1) 是谨慎使用的靛蓝，不等于紫色 |

#### 元素禁止 (Element Prohibitions)

| 禁止项 | Negative Prompt 文本 | 禁止原因 |
|--------|---------------------|---------|
| AI 大脑/神经网络 | `brain illustration, neural network diagram, brain with connections, AI brain, synapse, neuron, synaptic` | 暗示"AI 替代人类思维"，与品牌核心"AI 能建议但不能越权"直接矛盾。已有替代方案：六角几何+轨道旋转的 AI Logo |
| 对话气泡 | `chat bubble, speech bubble, conversation icon, message bubble, dialog box, chat window` | 暗示"聊天工具"定位，与"不是聊天工具"的品牌排除项矛盾。信息流用 Pipeline 和 Loop 路径表达 |
| 通用 SaaS 图标 | `rocket icon, gear icon, puzzle piece, light bulb, handshake, trophy, target, chart going up, lightning bolt, star rating, checkmark list` | 这些图标是 SaaS 行业的"通货"，无法建立品牌辨识度。AutoMage 使用自定义 SVG Glyph 系统（AI Logo、Human Logo、Policy Gate、Execution Ledger） |
| 人物/团队 | `people group, team photo, person silhouette, human figures, crowd, audience, team meeting` | 与"系统/OS"产品调性不匹配，分散对信息流叙事的注意力。AutoMage 的主角是系统本身 |
| 具体设备 | `laptop screen, smartphone mockup, desktop monitor, tablet device, UI screenshot` | 设备 mockup 强调"工具"而非"系统"。AutoMage 不是 app 屏幕截图，而是组织级信息流操作系统 |

#### 调性禁止 (Tone Prohibitions)

| 禁止项 | Negative Prompt 文本 | 禁止原因 |
|--------|---------------------|---------|
| 花哨装饰 | `ornamental, decorative border, flourish, decorative pattern, damask, filigree, fancy frame` | 违反"克制"调性。每个视觉元素必须有信息传达目的 |
| 情绪化表达 | `exciting, thrilling, dramatic, explosive, energetic burst, celebration, party, confetti` | 违反"权威"调性。AutoMage 的视觉叙事是冷静的系统运转，不是营销兴奋 |
| 模糊/抽象过度 | `abstract art, painterly, watercolor, oil painting, artistic brushstrokes, impressionist` | "精密"调性要求视觉清晰、边界锐利。过度抽象会丧失数据可视化的技术感 |
| 黑暗/沉重 | `dark and gritty, dystopian, ominous, menacing, horror, apocalyptic` | 虽然使用深色背景，但调性是"精密控制室"而非"黑暗世界"。需要保持专业和可信赖感 |

---

## 5.4 一致性验证清单 Post-Generation Checklist

生成每张插图后，必须逐项检查以下项目。任何一项不通过都需要重新生成或修改 prompt。

### 色彩一致性

- [ ] **品牌四色谱**: 画面中是否仅使用 navy #1E3A5F / blue #3B82F6 / cyan #38BDF8 / dark #0F172A 作为主要色彩？
- [ ] **信号色限制**: amber/red/green 是否仅用于状态标注（风险等级、完成状态），而未作为装饰色？
- [ ] **无非品牌色**: 是否未出现紫色主调、纯灰、霓虹色、暖色渐变等品牌色谱外的颜色？
- [ ] **色彩语义**: navy 是否仅出现在人类/决策侧？blue 是否仅出现在 AI/连接侧？（不可互换）

### 品牌辨识度

- [ ] **无通用图标**: 是否避免了火箭、齿轮、拼图、灯泡、握手等 SaaS 通用图标？
- [ ] **无 AI 大脑**: 是否避免了神经网络、大脑插画等"AI 替代人类"的视觉隐喻？
- [ ] **无对话气泡**: 是否避免了聊天框、对话图标等暗示"聊天工具"的元素？
- [ ] **无真人形象**: 是否避免了人物照片、人形剪影等？

### 信息流表达

- [ ] **动态感**: 是否传达了信息正在流动（而非静态堆积）的感觉？即使静止图也应有方向感和运动暗示
- [ ] **Loop 概念**: 是否隐含了闭环/循环结构（而非单向箭头）？
- [ ] **噪声到结构**: 如果涉及转化叙事，是否清晰表达了从散乱到有序的旅程？

### 调性匹配

- [ ] **权威感**: 是否传达了"专业系统"而非"消费产品"的气质？
- [ ] **克制感**: 是否保持了极简、留白、信息密度适中？没有多余装饰？
- [ ] **精密感**: 线条是否干净锐利？几何元素是否精确？
- [ ] **信任感**: 是否传达了可信赖的系统感，而非夸大承诺？

### 反面检查

- [ ] **无"AI 替代人类"暗示**: AI 元素是否始终处于"建议/连接"角色而非"主导/控制"角色？
- [ ] **无扁平插画感**: 是否有足够的几何深度和半透明叠层，区别于通用扁平插画？
- [ ] **无赛博朋克**: 是否避免了霓虹光效、暗黑城市等赛博朋克美学？

### 平台适配

- [ ] **尺寸匹配**: 是否为目标平台的正确尺寸？(og:image 1200x630 / 微信 900x500 / PPT 1920x1080)
- [ ] **文字空间**: 如果需要文字叠加，是否预留了足够空间？
- [ ] **可读性**: 在目标平台的显示环境中（手机屏幕/投影仪/暗色模式），关键元素是否可辨识？

---

## 5.5 Prompt 示例 (完整可复制)

以下 prompt 可直接复制到 DALL-E / Midjourney / Stable Diffusion / Flux 等 AI 图片生成工具使用。

### 示例 1: 核心 Loop 概念图 (Core Loop Concept)

**用途**: 产品介绍文章配图 / 投资人 deck

```
Minimalist technical illustration, geometric abstraction style, clean vector linework with 1.5-2px strokes using round line caps and joins, translucent layered overlays, abstract data flow visualization inspired by system architecture diagrams, no photorealism, no 3D rendering, no flat illustration, no cartoon style.

Six abstract nodes arranged in a circular orbital path on a deep dark slate #0F172A background, connected by thin signal blue #3B82F6 lines with 10% opacity forming a continuous loop. A glowing cyan #38BDF8 particle (6px circle) sits on the path with a fading trail of two smaller circles behind it (4px and 2px, decreasing opacity). Each node is a small circle (14px radius) — five inactive nodes are translucent blue rgba(59,130,246,0.15), one active node glows solid #3B82F6 with a soft halo rgba(59,130,246,0.3). The center contains a subtle gradient sphere transitioning from deep navy #1E3A5F to signal blue #3B82F6.

Small clean sans-serif labels beneath each node. No decorative elements, no background patterns, no gradients outside the center sphere. The feeling is a mission control orbital diagram for a sophisticated organizational system. Authoritative, restrained, precise.

Negative prompt: flat illustration, 3D render, cartoon, anime, cyberpunk, neon, photorealistic, brain neural network, chat bubbles, rocket icon, gear icon, warm colors, pure gray, decorative elements
```

> **适用平台**: Midjourney v6 (--ar 16:9), DALL-E 3, Flux Pro
> **建议参数**: Midjourney --style raw --s 50 以减少 AI 默认美化

---

### 示例 2: 噪声到决策转化图 (Noise to Decision Transformation)

**用途**: 产品概念文章配图 / 社交媒体分享

```
Minimalist technical illustration, geometric abstraction style, clean vector linework with 1.5-2px strokes using round line caps and joins, translucent layered overlays, abstract data flow visualization.

Wide panoramic composition, 1200x630 aspect ratio. Off-white #FAFBFC background with subtle depth. LEFT ZONE: 7 scattered rectangular fragments at random angles (rotated between -4 and +4 degrees), each a light gray #F1F5F9 rectangle with 1px subtle border, representing organizational noise — daily reports, chat logs, spreadsheets, meeting notes. Fragments overlap slightly, creating visual chaos.

CENTER ZONE: Three concentric circles of signal blue #3B82F6 radiating from center — innermost 30% opacity, middle 20% opacity, outermost 10% opacity. At the exact center, a 48px solid gradient sphere from deep navy #1E3A5F core to blue #3B82F6 edge. Thin lines (1px, blue, 15% opacity) converge from scattered fragments toward the center, showing compression in action.

RIGHT ZONE: Three structured white decision cards, evenly stacked with 16px gaps, each with a 3px left border in signal blue #3B82F6 and subtle shadow. Cards contain structured text rows. The visual narrative moves left-to-right from chaos to clarity.

Strict color palette: navy #1E3A5F, blue #3B82F6, cyan #38BDF8, slate gray #F1F5F9, off-white #FAFBFC. No warm colors, no 3D, no flat illustration, no cartoon, no photorealism.

Negative prompt: flat illustration, 3D render, cartoon, cyberpunk, neon, photorealistic, brain, chat bubbles, SaaS icons, warm gradients, pure gray, decorative borders, people, robot
```

> **适用平台**: DALL-E 3, Flux Pro (自然语言描述效果最佳)
> **建议尺寸**: 1200x630 (og:image) 或 1792x1024 (宽幅)

---

### 示例 3: AI+人类双密钥门控 (Dual-Key Human Gate)

**用途**: 安全/信任主题文章配图 / 投资人 deck

```
Minimalist technical illustration, geometric abstraction style, clean vector linework with 1.5-2px strokes, translucent layered overlays, abstract system diagram on deep dark slate #0F172A background.

Horizontal four-stage pipeline flowing left to right. Stage 1: A hexagonal shape with 3 small orbital dots positioned around it, rendered in signal blue #3B82F6, representing AI suggestion capability. A thin connecting line (1px, blue, 20% opacity) leads to Stage 2: A shield-like shape in medium blue representing automated policy validation. 

Between Stage 2 and Stage 3: A prominent vertical gate barrier — two parallel dashed lines (blue to navy gradient) forming a checkpoint doorway. This is the visual centerpiece separating AI capability from human authority.

Stage 3: A heavier, more grounded circular symbol in deep navy #1E3A5F — visually denser and darker than the AI elements, representing human confirmation authority. Stage 4: A small unlocked symbol in green #22C55E indicating execution approved.

Color coding is strict and semantic: blue #3B82F6 only on AI-side (Stages 1-2), navy #1E3A5F only on human-side (Stage 3), green only on execution (Stage 4). The gate is the dominant visual element. Authoritative, precise, trustworthy. The message: AI proposes, human decides.

Negative prompt: flat illustration, 3D render, cartoon, cyberpunk, neon, photorealistic, brain neural network, robot humanoid, chat bubbles, rocket gear icons, warm colors, pure gray, people photos, decorative elements
```

> **适用平台**: Midjourney v6 (--ar 16:9 --style raw), DALL-E 3
> **建议参数**: 加入 --no brain robot neon 以强化排除

---

### 示例 4: 微信分享卡片 (WeChat Social Card)

**用途**: 微信/即刻/知乎分享缩略图

```
Minimalist technical illustration, geometric abstraction style. 900x500 aspect ratio for WeChat sharing card.

Deep dark slate #0F172A background filling entire canvas. Center composition: A symbolic noise-to-decision transformation. Left side: 4 scattered small rectangular fragments (gray #F1F5F9, slight random rotations) representing raw organizational data — these fragments are intentionally small and numerous, suggesting information overload.

From the fragments, thin converging lines (signal blue #3B82F6, 10% opacity, 1px) draw inward toward a central gradient sphere (24px, navy #1E3A5F to blue #3B82F6) representing the compression core. From the core, 3 neat structured card outlines emerge to the right, each with a blue left border and clean internal lines suggesting structured data.

Below the visual composition: "AutoMage" in white, bold sans-serif, and below that "Organizational Information Flow OS" in muted slate #94A3B8, regular weight. Text is centered, clean, generous spacing.

The card is compact but impactful. Balanced composition with intentional dark space. The feeling is a premium tech product card, not a marketing banner. No 3D, no flat illustration, no cartoon, no decorative patterns.

Negative prompt: flat illustration, 3D render, cartoon, cyberpunk, neon, photorealistic, brain, chat bubbles, SaaS icons, warm colors, pure gray, busy background, text-heavy, watermark, people, robot
```

> **适用平台**: 微信/即刻/知乎 (900x500), Twitter/X (1200x630)
> **注意**: 生成后需确认文字清晰度，AI 生成的文字可能需要后期替换

---

### 示例 5: 演讲幻灯片背景 (Presentation Slide Background)

**用途**: 演讲/路演/内部培训幻灯片

```
Minimalist technical illustration, geometric abstraction style, clean vector linework with 1.5-2px strokes, translucent layered overlays. 16:9 widescreen aspect ratio (1920x1080).

Dark slate #0F172A background with very subtle grid pattern (faint blue lines, 3% opacity, 40px spacing) suggesting a technical dashboard surface. 

The illustration occupies the LEFT 55% of the canvas. Visual: An open arc of 6 connected nodes — not a full circle, but a graceful 240-degree arc opening to the right. Nodes are small circles (14-20px). Five nodes are inactive (translucent blue, rgba 59,130,246, 0.15), one node is active (solid blue #3B82F6 with glow). Nodes connected by thin lines (1px, blue, 10% opacity). A cyan #38BDF8 particle with trail marks the current position on the arc. Each node has a tiny label beneath in clean sans-serif (11px, white).

The RIGHT 45% is intentionally empty dark space — designed for presentation text overlay. A very subtle gradient vignette (5% opacity black) feathers the right edge slightly. No text, no borders, no frames in the illustration itself. 

The feeling is a professional technical diagram for a boardroom audience — precise, authoritative, confident. Suitable for a CEO presenting to investors. No 3D, no flat illustration, no cartoon, no decorative elements.

Negative prompt: flat illustration, 3D render, cartoon, cyberpunk, neon, photorealistic, brain, chat bubbles, SaaS icons, warm colors, pure gray, decorative borders, busy pattern, text-heavy, watermark, people, robot, lens flare
```

> **适用平台**: PowerPoint / Keynote / Google Slides (1920x1080)
> **后期建议**: 生成后在右侧叠加演讲文字，使用 Inter 或 JetBrains Mono 字体

---

### 示例 6: 信息流仪表盘概念图 (Information Flow Dashboard Concept)

**用途**: 帮助中心/产品文档功能说明配图

```
Minimalist technical illustration, geometric abstraction style, clean vector linework with 1.5-2px strokes, translucent layered overlays, abstract dashboard interface.

Deep dark slate #0F172A background. The composition shows a stylized dashboard interface — not a realistic UI screenshot, but an abstract representation. Top area: Three horizontal signal chips (small rounded rectangles with tiny status dots — green for success, amber for warning, blue for active) suggesting real-time signal intake. Middle area: Three vertical bar chart indicators at different heights, rendered as simple gradient rectangles (transparent to colored top), representing data compression metrics. Bottom area: A horizontal mini-pipeline of 4 connected stages with the third stage highlighted (human confirmation gate).

All elements are rendered in the brand palette: blue #3B82F6 for active states and connections, navy #1E3A5F for the human gate stage, cyan #38BDF8 for highlight accents, dark slate for backgrounds. Text labels use clean monospace style in muted slate #94A3B8. The overall composition resembles a mission control console — minimal, functional, data-dense but not cluttered.

No realistic UI chrome (no browser frames, no OS title bars, no mouse cursors). The abstraction level is between a wireframe and a finished product — suggestive rather than literal. Authoritative and technical. No 3D, no flat illustration, no cartoon.

Negative prompt: flat illustration, 3D render, cartoon, cyberpunk, neon, photorealistic, realistic UI screenshot, browser mockup, laptop screen, brain, chat bubbles, SaaS icons, warm colors, pure gray, decorative elements, people
```

> **适用平台**: 文档站点配图 / 产品介绍长图
> **建议尺寸**: 1200x800 或 1600x900

---

### 示例 7: 闭环完成概念图 (Loop Closed Concept)

**用途**: CTA 区域配图 / 产品价值主张配图

```
Minimalist technical illustration, geometric abstraction style, clean vector linework with 1.5-2px strokes, translucent layered overlays.

Off-white #FAFBFC background. Center: A complete circular loop path drawn in thin signal blue #3B82F6 (1.5px, 30% opacity). The circle is clean and precise. At the top of the circle, the path thickens slightly and glows brighter (blue at 60% opacity with subtle blue shadow), indicating the loop is active and closed. 

Around the circle, 6 small node dots are evenly spaced — all rendered in solid blue #3B82F6 indicating all nodes are active and the loop is complete. A small green #22C55E checkmark or completion indicator sits near the top node. Inside the circle, very faint text reads "Loop Closed" in clean sans-serif (muted slate #64748B, 14px).

From the bottom of the circle, thin lines (1px, blue, 10% opacity) extend outward suggesting the loop connects to a larger organizational system — it is not isolated but part of a network. The overall feeling is a completed circuit, a system running smoothly, a closed information loop. Minimal, precise, satisfying. No 3D, no flat illustration, no cartoon.

Negative prompt: flat illustration, 3D render, cartoon, cyberpunk, neon, photorealistic, brain, chat bubbles, SaaS icons, warm colors, pure gray, decorative elements, celebration, confetti, party, people, robot
```

> **适用平台**: 官网 CTA 区域 / 博客文章结尾 / 邮件模板
> **建议尺寸**: 800x800 (正方形) 或 1200x630 (横幅)

---

## 5.6 平台特定优化建议

### Midjourney 优化

| 参数 | 推荐值 | 说明 |
|------|--------|------|
| `--style raw` | 始终使用 | 减少 Midjourney 的默认美化和细节添加 |
| `--s` (stylize) | 50-150 | 低值保持 prompt 精确度，高值增加艺术感 |
| `--ar` | 按场景设置 | 16:9 (PPT), 19:10 (og:image 1200x630), 9:5 (微信 900x500) |
| `--no` | 见 negative prompt | 将核心 negative prompt 的关键词放入 --no 参数 |
| `--v` | 6 或更高 | 使用最新版本以获得最佳文字生成质量 |

### DALL-E 3 优化

- DALL-E 3 对自然语言理解最佳，可将 prompt 保持为段落式描述
- 色彩描述用 HEX 值，DALL-E 3 能识别并接近匹配
- 明确声明 "No text in the image" 可避免 AI 生成乱码文字
- 使用 "digital illustration" 而非 "AI art" 以获得更干净的输出

### Flux 优化

- Flux 对细节描述的遵循度最高，可使用更长更精确的 prompt
- 色彩约束用 HEX 值效果好
- 添加 "photorealistic" 负面词时 Flux 响应最积极
- 建议使用 Flux Pro 而非 Schnell 以获得更高质量

### Stable Diffusion 优化

- 使用正向权重强调关键元素: `(geometric abstraction:1.3), (navy #1E3A5F:1.2)`
- 使用负向权重排除干扰: `[(flat illustration:1.5), (cartoon:1.5), (3D:1.5)]`
- 建议搭配 ControlNet 使用参考图控制构图
- 推荐模型: SDXL + 偏技术风格的 LoRA

---

## 5.7 附录: 色彩速查表

### 品牌主色 (Primary Palette)

| 角色 | HEX | RGB | Prompt 描述关键词 |
|------|-----|-----|-----------------|
| Navy (人类权威) | #1E3A5F | 30,58,95 | "deep navy", "authority blue", "dark ocean blue" |
| Blue (AI 连接) | #3B82F6 | 59,130,246 | "signal blue", "active blue", "bright blue" |
| Cyan (数据粒子) | #38BDF8 | 56,189,248 | "highlight cyan", "light blue", "data particle blue" |
| Dark (系统内部) | #0F172A | 15,23,42 | "dark slate", "near-black blue", "deep dark background" |
| Surface (页面) | #FAFBFC | 250,251,252 | "off-white", "clean white", "light background" |

### 信号色 (Signal Colors) -- 仅限状态标注

| 角色 | HEX | RGB | Prompt 描述关键词 |
|------|-----|-----|-----------------|
| Warning | #F59E0B | 245,158,11 | "amber warning", "golden amber" |
| Risk | #EF4444 | 239,68,68 | "red risk", "alert red" |
| Success | #22C55E | 34,197,94 | "green success", "completion green" |

### 色彩替换建议

当 AI 生成工具无法精确匹配 HEX 值时的近似替换：

| 目标色 | 可接受范围 | 不可接受 |
|--------|-----------|---------|
| Navy #1E3A5F | #1a3555 ~ #224466 | 任何偏绿或偏紫的深蓝 |
| Blue #3B82F6 | #3580f0 ~ #4585ff | 天蓝、钴蓝、皇家蓝 |
| Cyan #38BDF8 | #30b8f5 ~ #40c0ff | 绿松石、蒂芙尼蓝 |
| Dark #0F172A | #0d1525 ~ #121a30 | 纯黑、深灰、深棕 |

---

## 5.8 Prompt 快速组装工作流

### 步骤 1: 选择场景

根据用途选择 5.2 中的模板：
- 产品概念/闭环 → 5.2.1
- 噪声到决策转化 → 5.2.2
- 安全/信任/门控 → 5.2.3
- 社交媒体分享 → 5.2.4
- 演讲/PPT → 5.2.5

### 步骤 2: 组装 Prompt

1. 复制「通用前缀」(5.1) 的风格锚定 + 色彩约束 + 调性关键词
2. 插入场景模板的具体视觉描述
3. 填充变量槽位 (SCENE / SUBJECT / LOOP_PHASE / TEXT_OVERLAY)
4. 追加核心 negative prompt (5.3.1)

### 步骤 3: 平台适配

根据目标工具调整 (5.6):
- Midjourney: 添加 --style raw --s 参数
- DALL-E: 保持段落式自然语言
- Flux: 使用完整详细描述
- SD: 添加权重标记

### 步骤 4: 生成后验证

逐项检查 5.4 一致性验证清单。全部通过方可使用。

### 步骤 5: 后期微调

- AI 生成的文字如有乱码，使用设计工具替换为品牌字体
- 色彩如有偏差，使用色彩校正工具调整到品牌 HEX 值
- 尺寸如有出入，裁切到目标平台精确尺寸
