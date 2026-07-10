import type { StyleResult, Swatch } from "@/types";
import { STYLE_IMAGES } from "./styleImages";

interface StyleSeed {
  id: string;
  name_zh: string;
  name_en: string;
  tagline_zh: string;
  tagline_en: string;
  thumb: string;
  palette: Swatch[];
  description_zh: string;
  description_en: string;
  prompt: string;
}

function buildCss(seed: StyleSeed): string {
  const lines = seed.palette
    .map((s, i) => `  --color-${i + 1}: ${s.hex}; /* ${s.role_en} */`)
    .join("\n");
  return `:root {\n${lines}\n}\n\n.surface {\n  background: var(--color-1);\n  color: var(--color-${seed.palette.length});\n  font-family: system-ui, sans-serif;\n}`;
}

function buildMarkdown(seed: StyleSeed): string {
  const swatches = seed.palette
    .map((s) => `- \`${s.hex}\` — ${s.role_en}`)
    .join("\n");
  return `# ${seed.name_en}\n\n${seed.description_en}\n\n## Palette\n${swatches}\n\n## Prompt\n> ${seed.prompt}`;
}

function grad(a: string, b: string, c: string): string {
  return `linear-gradient(135deg, ${a} 0%, ${b} 55%, ${c} 100%)`;
}

const SEEDS: StyleSeed[] = [
  {
    id: "naive-design",
    name_zh: "稚拙设计 Naive",
    name_en: "Naive Design",
    tagline_zh: "稚拙手绘，不完美的可爱",
    tagline_en: "Childlike, charming imperfection",
    thumb: grad("#F0D8D8", "#F0D8C0", "#141414"),
    palette: [
      { hex: "#F2EFE9", role_zh: "纸底", role_en: "Paper base" },
      { hex: "#F0D8D8", role_zh: "腮红粉", role_en: "Blush pink" },
      { hex: "#F0D8C0", role_zh: "奶油橘", role_en: "Cream peach" },
      { hex: "#C0A8A8", role_zh: "藕荷灰", role_en: "Mauve grey" },
      { hex: "#141414", role_zh: "手绘黑", role_en: "Hand-drawn ink" },
    ],
    description_zh:
      "稚拙风（Naive）刻意抛开专业技巧，用孩子般的手绘线条、歪扭的图形与不完美的填色，营造真诚、天真、亲切的气质。造型简单、比例夸张，配色柔和温暖。",
    description_en:
      "Naive design deliberately drops polish for childlike hand-drawn lines, wonky shapes and imperfect fills — sincere, innocent and approachable. Simple forms, exaggerated proportions, warm soft colors.",
    prompt:
      "naive art style, childlike hand-drawn shapes, wobbly imperfect outlines, flat warm pastel fills, simple exaggerated forms, sincere and playful, textured paper, marker and crayon feel, folk-art charm",
  },
  {
    id: "dark-tonalism",
    name_zh: "暗色调主义",
    name_en: "Dark Tonalism",
    tagline_zh: "明暗对比，戏剧光影",
    tagline_en: "Chiaroscuro drama",
    thumb: grad("#64482F", "#33321C", "#0B0B0B"),
    palette: [
      { hex: "#0B0B0B", role_zh: "深黑", role_en: "Deep black" },
      { hex: "#1C1C1C", role_zh: "炭黑", role_en: "Charcoal" },
      { hex: "#33321C", role_zh: "暗橄榄", role_en: "Dark olive" },
      { hex: "#4A3330", role_zh: "暗赭", role_en: "Umber" },
      { hex: "#64482F", role_zh: "青铜高光", role_en: "Bronze light" },
    ],
    description_zh:
      "暗色调主义以低明度、大面积深色为主，借强烈明暗对比（chiaroscuro）塑造戏剧张力。光只落在关键处，暗部吞没细节，氛围沉静、高级而神秘。",
    description_en:
      "Dark Tonalism leans on low-key, deep-shadow imagery with strong chiaroscuro for dramatic tension. Light falls only where it matters; shadows swallow detail — quiet, premium and mysterious.",
    prompt:
      "dark tonalism, chiaroscuro lighting, deep shadows, low-key palette, single dramatic light source, rich umber and bronze highlights, moody premium atmosphere, fine grain, cinematic contrast",
  },
  {
    id: "pop-art",
    name_zh: "波普艺术",
    name_en: "Pop Art",
    tagline_zh: "高饱和撞色，漫画感",
    tagline_en: "Bold comic saturation",
    thumb: grad("#B21D1D", "#FFA800", "#FFC000"),
    palette: [
      { hex: "#B21D1D", role_zh: "波普红", role_en: "Pop red" },
      { hex: "#FFA800", role_zh: "亮橙", role_en: "Bright orange" },
      { hex: "#FFC000", role_zh: "明黄", role_en: "Vivid yellow" },
      { hex: "#111111", role_zh: "描边黑", role_en: "Ink black" },
      { hex: "#F5F5F5", role_zh: "留白", role_en: "Paper white" },
    ],
    description_zh:
      "波普艺术挪用大众文化与商业符号，用高饱和撞色、粗黑描边、半调网点（Ben-Day dots）和漫画分格，直白、热闹、张扬。",
    description_en:
      "Pop Art appropriates mass-culture and commercial imagery with high-saturation clashes, bold black outlines, Ben-Day halftone dots and comic panels — loud, direct and exuberant.",
    prompt:
      "pop art style, bold high-saturation colors, thick black outlines, Ben-Day halftone dots, comic book panels, red orange and yellow, screenprint look, Warhol and Lichtenstein influence, graphic and punchy",
  },
  {
    id: "surrealism",
    name_zh: "超现实主义",
    name_en: "Surrealism",
    tagline_zh: "梦境拼接，超脱现实",
    tagline_en: "Dreamlike & uncanny",
    thumb: grad("#F00030", "#F06078", "#60A8C0"),
    palette: [
      { hex: "#F00030", role_zh: "超现实红", role_en: "Surreal red" },
      { hex: "#F06078", role_zh: "梦境粉", role_en: "Dream pink" },
      { hex: "#60A8C0", role_zh: "灰蓝天", role_en: "Dusty sky" },
      { hex: "#304848", role_zh: "深青影", role_en: "Teal shadow" },
      { hex: "#101010", role_zh: "墨黑", role_en: "Ink" },
    ],
    description_zh:
      "超现实主义把不相干的物象并置，制造梦境般的错位与荒诞：漂浮的物体、扭曲的比例、不合逻辑的空间，理性之外的潜意识景象。",
    description_en:
      "Surrealism juxtaposes unrelated objects into dreamlike dislocation — floating forms, warped scale, illogical space — an image of the subconscious beyond reason.",
    prompt:
      "surrealism, dreamlike juxtaposition, floating objects, impossible scale, uncanny illogical space, Dali and Magritte influence, soft dusty sky against vivid red, symbolic and subconscious, painterly render",
  },
  {
    id: "brutalism",
    name_zh: "粗野主义",
    name_en: "Brutalism",
    tagline_zh: "裸露粗粝，硬朗结构",
    tagline_en: "Raw, heavy structure",
    thumb: grad("#ECECDF", "#606090", "#141414"),
    palette: [
      { hex: "#ECECDF", role_zh: "水泥白", role_en: "Concrete white" },
      { hex: "#C0C0C0", role_zh: "灰", role_en: "Grey" },
      { hex: "#484878", role_zh: "石板蓝", role_en: "Slate blue" },
      { hex: "#606090", role_zh: "长春花", role_en: "Periwinkle" },
      { hex: "#141414", role_zh: "墨黑", role_en: "Ink" },
    ],
    description_zh:
      "粗野主义（Brutalism）裸露结构、拒绝修饰：粗重的黑边、系统默认字体、生硬的高对比与水泥质感，刻意的原始与笨拙，带反叛气息。",
    description_en:
      "Brutalism exposes structure and refuses polish: heavy black borders, system-default type, harsh contrast and raw concrete texture — deliberately blunt and rebellious.",
    prompt:
      "brutalist design, raw exposed structure, heavy black borders, concrete texture, system default fonts, harsh high contrast, oversized blocky type, unpolished and rebellious, monolithic layout",
  },
  {
    id: "gothic",
    name_zh: "哥特风格",
    name_en: "Gothic",
    tagline_zh: "暗黑华丽，肃穆神秘",
    tagline_en: "Dark, ornate, solemn",
    thumb: grad("#4A2E2E", "#2E4444", "#0E0E0E"),
    palette: [
      { hex: "#0E0E0E", role_zh: "暗夜黑", role_en: "Night black" },
      { hex: "#2A2A2A", role_zh: "炭灰", role_en: "Charcoal" },
      { hex: "#4A2E2E", role_zh: "氧化血红", role_en: "Oxblood" },
      { hex: "#2E4444", role_zh: "深青", role_en: "Midnight teal" },
      { hex: "#6A6A6A", role_zh: "石灰", role_en: "Stone grey" },
    ],
    description_zh:
      "哥特风格庄严而幽暗，尖拱、繁复花饰、衬线与黑体字母交织，深色主导、点缀氧化血红与冷青，透出宗教感、神秘与华丽的忧郁。",
    description_en:
      "Gothic is solemn and shadowed — pointed arches, ornate tracery, blackletter and serif type over a dark base with oxblood and cold teal, evoking sacred mystery and ornate melancholy.",
    prompt:
      "gothic style, dark and ornate, pointed arches, intricate tracery, blackletter typography, oxblood and midnight teal accents, candlelit cathedral mood, solemn mysterious and melancholic, high detail",
  },
  {
    id: "mixed-media",
    name_zh: "混合媒介",
    name_en: "Mixed Media",
    tagline_zh: "多材质拼接，实验质感",
    tagline_en: "Layered material textures",
    thumb: grad("#F2F2F2", "#606060", "#101010"),
    palette: [
      { hex: "#F2F2F2", role_zh: "纸白", role_en: "Paper white" },
      { hex: "#C4C4C4", role_zh: "银灰", role_en: "Silver" },
      { hex: "#606060", role_zh: "中灰", role_en: "Mid grey" },
      { hex: "#303030", role_zh: "深灰", role_en: "Dark grey" },
      { hex: "#101010", role_zh: "墨", role_en: "Ink" },
    ],
    description_zh:
      "混合媒介把摄影、手绘、印刷、拓印与拼贴叠加在一起，强调真实的材质与工序痕迹：胶带、撕边、扫描噪点与手写标注，实验性而有手感。",
    description_en:
      "Mixed media layers photography, drawing, print, frottage and collage — foregrounding real materials and process: tape, torn edges, scan grain and handwriting. Experimental and tactile.",
    prompt:
      "mixed media collage, layered photography drawing and print, torn paper edges, tape and staples, scan grain, handwritten annotations, tactile experimental texture, monochrome with material contrast",
  },
  {
    id: "minimalism",
    name_zh: "极简主义",
    name_en: "Minimalism",
    tagline_zh: "极致留白，克制精准",
    tagline_en: "Restrained, precise, spacious",
    thumb: grad("#FAF6F0", "#E8E4DA", "#E23B34"),
    palette: [
      { hex: "#FAF6F0", role_zh: "米白", role_en: "Off-white" },
      { hex: "#F0EEE2", role_zh: "象牙", role_en: "Ivory" },
      { hex: "#E8E4DA", role_zh: "暖灰米", role_en: "Warm grey" },
      { hex: "#C9C4B8", role_zh: "中性灰", role_en: "Neutral" },
      { hex: "#E23B34", role_zh: "单点红", role_en: "Signal red" },
    ],
    description_zh:
      "极简主义做减法：大量留白、克制的中性色、清晰的层级与精准的对齐，去掉一切非必要，仅保留一个克制的强调点，安静而高级。",
    description_en:
      "Minimalism subtracts: generous whitespace, restrained neutrals, crisp hierarchy and precise alignment. Everything inessential is removed, leaving one disciplined accent — quiet and refined.",
    prompt:
      "minimalism, generous negative space, restrained neutral palette, off-white and ivory, one disciplined red accent, precise alignment, clean typographic hierarchy, calm refined and uncluttered",
  },
  {
    id: "diffused-gradient",
    name_zh: "弥散光设计",
    name_en: "Diffused Gradient",
    tagline_zh: "柔和光晕，弥散渐变",
    tagline_en: "Soft glow, diffused gradient",
    thumb: grad("#C0A8F0", "#A860F0", "#7890F0"),
    palette: [
      { hex: "#F1F0FF", role_zh: "光晕白", role_en: "Aura white" },
      { hex: "#C0A8F0", role_zh: "淡紫", role_en: "Lilac" },
      { hex: "#A860F0", role_zh: "紫罗兰", role_en: "Violet" },
      { hex: "#9078F0", role_zh: "蓝紫", role_en: "Blue violet" },
      { hex: "#7890F0", role_zh: "柔蓝", role_en: "Soft blue" },
    ],
    description_zh:
      "弥散光（Aura / Diffused Light）用大面积柔和渐变与朦胧光晕营造梦幻氛围，色彩相互晕染、边界模糊，通透轻盈、温柔治愈。",
    description_en:
      "Diffused / aura gradients build a dreamy mood from large soft gradients and hazy glows — colors bleed into one another with blurred edges, airy and gently soothing.",
    prompt:
      "diffused aura gradient, soft blurred glow, large smooth color transitions, lilac violet and soft blue, hazy dreamy atmosphere, luminous and airy, gentle bokeh light, ethereal and calming",
  },
  {
    id: "collage",
    name_zh: "拼贴",
    name_en: "Collage",
    tagline_zh: "剪贴混排，拼接叙事",
    tagline_en: "Cut-and-paste narrative",
    thumb: grad("#EDEDED", "#1848A8", "#161616"),
    palette: [
      { hex: "#EDEDED", role_zh: "纸面", role_en: "Paper" },
      { hex: "#C0C0C0", role_zh: "灰调", role_en: "Grey" },
      { hex: "#1848A8", role_zh: "印刷蓝", role_en: "Print blue" },
      { hex: "#184890", role_zh: "深蓝", role_en: "Deep blue" },
      { hex: "#161616", role_zh: "墨黑", role_en: "Ink" },
    ],
    description_zh:
      "拼贴（Collage）把剪报、照片、印刷碎片重新剪切、错位、叠压，混排不同字体与图像，制造粗粝的手作感与并置叙事。",
    description_en:
      "Collage re-cuts newspaper, photos and print fragments into offset, overlapping compositions — mixing typefaces and images for a raw handmade, juxtaposed narrative.",
    prompt:
      "cut-and-paste collage, torn newspaper and magazine fragments, overlapping offset layers, mixed typefaces, photocopied texture, print blue and paper grey, handmade dada aesthetic, layered narrative",
  },
  {
    id: "cybercore",
    name_zh: "赛博核",
    name_en: "Cybercore",
    tagline_zh: "冷峻科技，暗夜数据",
    tagline_en: "Cold-tech, dark data",
    thumb: grad("#8E8EF0", "#1B3048", "#0A0E18"),
    palette: [
      { hex: "#0A0E18", role_zh: "深空", role_en: "Deep space" },
      { hex: "#12122A", role_zh: "靛蓝", role_en: "Indigo" },
      { hex: "#1B3048", role_zh: "钢蓝", role_en: "Steel blue" },
      { hex: "#303060", role_zh: "夜蓝", role_en: "Night blue" },
      { hex: "#8E8EF0", role_zh: "电子蓝", role_en: "Electric periwinkle" },
    ],
    description_zh:
      "赛博核（Cybercore）是冷色调的数字未来美学：深蓝黑底、电子蓝辉光、网格与数据流、HUD 界面与等宽字体，冷峻、克制、机械感强。",
    description_en:
      "Cybercore is a cold digital-future aesthetic: deep blue-black base, electric-blue glow, grids and data streams, HUD interfaces and monospace type — cold, restrained and machine-like.",
    prompt:
      "cybercore aesthetic, deep blue-black base, electric periwinkle glow, wireframe grids and data streams, HUD interface elements, monospace type, cold restrained high-tech, dark futuristic UI",
  },
  {
    id: "girly-kawaii",
    name_zh: "少女风",
    name_en: "Girly Kawaii",
    tagline_zh: "甜美粉嫩，梦幻少女",
    tagline_en: "Sweet, dreamy, kawaii",
    thumb: grad("#F0A8C0", "#F2C4C4", "#D8D8F0"),
    palette: [
      { hex: "#F7EFF2", role_zh: "奶白", role_en: "Milky white" },
      { hex: "#F2C4C4", role_zh: "玫瑰粉", role_en: "Rose" },
      { hex: "#F0A8C0", role_zh: "甜粉", role_en: "Sweet pink" },
      { hex: "#E7A8A8", role_zh: "珊瑚粉", role_en: "Coral pink" },
      { hex: "#D8D8F0", role_zh: "淡蓝紫", role_en: "Lilac blue" },
    ],
    description_zh:
      "少女风甜美梦幻：以粉色系为主，搭配蝴蝶结、爱心、星星、亮片等可爱元素，圆润造型、柔光与闪光点缀，轻盈而治愈。",
    description_en:
      "Girly kawaii is sweet and dreamy: pink-led palettes with bows, hearts, stars and glitter, rounded forms, soft light and sparkle accents — light and heart-warming.",
    prompt:
      "girly kawaii aesthetic, sweet pink palette, bows hearts stars and glitter, rounded soft shapes, soft glow and sparkles, dreamy pastel, cute and heart-warming, lilac blue accents",
  },
  {
    id: "utilitarian",
    name_zh: "实用主义设计",
    name_en: "Utilitarian",
    tagline_zh: "功能优先，克制中性",
    tagline_en: "Function-first neutral",
    thumb: grad("#FFFFFF", "#D6D6D6", "#5E5E5E"),
    palette: [
      { hex: "#FFFFFF", role_zh: "纯白", role_en: "Pure white" },
      { hex: "#F0F0F0", role_zh: "浅灰", role_en: "Light grey" },
      { hex: "#D6D6D6", role_zh: "银灰", role_en: "Silver" },
      { hex: "#A8A8A8", role_zh: "中灰", role_en: "Mid grey" },
      { hex: "#5E5E5E", role_zh: "深灰", role_en: "Dark grey" },
    ],
    description_zh:
      "实用主义设计以功能为先，去装饰化：中性灰白、清晰的信息结构、真实的产品与 3D 元素，理性、可靠、工业感，强调可用性而非风格表达。",
    description_en:
      "Utilitarian design puts function first and strips ornament: neutral greys and white, clear information structure, honest product and 3D elements — rational, reliable and industrial.",
    prompt:
      "utilitarian design, function-first, neutral grey and white palette, clean information hierarchy, realistic product and 3D elements, industrial and rational, honest materials, no decoration",
  },
  {
    id: "acid-metal",
    name_zh: "酸性金属",
    name_en: "Acid Metal",
    tagline_zh: "酸性荧光，液态金属",
    tagline_en: "Acid neon, liquid chrome",
    thumb: grad("#C0D890", "#90C060", "#6F9E2E"),
    palette: [
      { hex: "#DDE3D2", role_zh: "冷白", role_en: "Cool white" },
      { hex: "#C0D890", role_zh: "浅酸绿", role_en: "Light acid" },
      { hex: "#90C060", role_zh: "酸性绿", role_en: "Acid green" },
      { hex: "#6F9E2E", role_zh: "苔绿", role_en: "Moss green" },
      { hex: "#B8BCC0", role_zh: "铬银", role_en: "Chrome silver" },
    ],
    description_zh:
      "酸性设计（Acid / Y2K 金属）以液态铬金属、镜面反射、荧光酸性色和扭曲字体为标志，前卫、迷幻、带地下俱乐部气质。",
    description_en:
      "Acid / Y2K metal design is defined by liquid chrome, mirror reflections, neon acid hues and warped type — avant-garde, psychedelic and rave-adjacent.",
    prompt:
      "acid design, liquid chrome metal, mirror reflections, neon acid green, warped distorted typography, glossy 3D blobs, psychedelic Y2K rave aesthetic, iridescent and futuristic",
  },
  {
    id: "graffiti",
    name_zh: "涂鸦风格",
    name_en: "Graffiti",
    tagline_zh: "街头喷绘，张扬涂写",
    tagline_en: "Street spray, bold tags",
    thumb: grad("#F06090", "#C04878", "#101010"),
    palette: [
      { hex: "#F2F2F2", role_zh: "墙面", role_en: "Wall" },
      { hex: "#F06090", role_zh: "荧光粉", role_en: "Hot pink" },
      { hex: "#C04878", role_zh: "品红", role_en: "Magenta" },
      { hex: "#90A8C0", role_zh: "喷绘蓝", role_en: "Spray blue" },
      { hex: "#101010", role_zh: "描边黑", role_en: "Ink black" },
    ],
    description_zh:
      "涂鸦风格来自街头：喷漆的飞白与滴流、夸张的泡泡字与签名 tag、粗黑描边和高饱和荧光色，叛逆、张扬、充满能量。",
    description_en:
      "Graffiti comes from the street: spray-paint overspray and drips, exaggerated bubble letters and tags, thick black outlines and hot neon colors — rebellious, loud and energetic.",
    prompt:
      "graffiti street art, spray paint drips and overspray, bold bubble letters and tags, thick black outlines, hot pink and neon, concrete wall texture, rebellious energetic urban style",
  },
  {
    id: "futuristic-digital",
    name_zh: "未来感数字艺术",
    name_en: "Futuristic Digital Art",
    tagline_zh: "数字未来，冷光科技",
    tagline_en: "Digital future, cold glow",
    thumb: grad("#304860", "#2E3048", "#0F1020"),
    palette: [
      { hex: "#0F1020", role_zh: "深蓝黑", role_en: "Deep blue-black" },
      { hex: "#1A1A30", role_zh: "午夜蓝", role_en: "Midnight" },
      { hex: "#2E3048", role_zh: "石墨蓝", role_en: "Graphite blue" },
      { hex: "#304860", role_zh: "钢青", role_en: "Steel cyan" },
      { hex: "#6A6C80", role_zh: "冷灰蓝", role_en: "Cool grey-blue" },
    ],
    description_zh:
      "未来感数字艺术以精密的 3D 渲染、金属与玻璃材质、冷调蓝光和体积雾构建高科技场景，光洁、精致、充满未来氛围。",
    description_en:
      "Futuristic digital art builds high-tech scenes from precise 3D renders, metal and glass materials, cold blue light and volumetric haze — sleek, refined and forward-looking.",
    prompt:
      "futuristic digital art, precise 3D render, metal and glass materials, cold blue lighting, volumetric haze, sleek high-tech surfaces, sci-fi environment, refined cinematic detail",
  },
  {
    id: "vaporwave",
    name_zh: "蒸汽波",
    name_en: "Vaporwave",
    tagline_zh: "复古未来，霓虹梦境",
    tagline_en: "Retro-future neon dream",
    thumb: grad("#F49AC1", "#6A78F0", "#2A1E3F"),
    palette: [
      { hex: "#2A1E3F", role_zh: "暮紫", role_en: "Twilight purple" },
      { hex: "#6A78F0", role_zh: "蒸汽蓝", role_en: "Vapor blue" },
      { hex: "#7890F0", role_zh: "长春蓝", role_en: "Periwinkle" },
      { hex: "#F49AC1", role_zh: "蒸汽粉", role_en: "Vapor pink" },
      { hex: "#67D3E0", role_zh: "青碧", role_en: "Aqua cyan" },
    ],
    description_zh:
      "蒸汽波（Vaporwave）混搭 80/90 年代复古数字美学：霓虹粉紫青、网格地平线、罗马雕像、日语与老式 UI，怀旧、梦幻又略带反讽。",
    description_en:
      "Vaporwave mashes up 80s/90s retro-digital nostalgia: neon pink-purple-cyan, grid horizons, Roman busts, Japanese glyphs and vintage UI — dreamy, nostalgic and faintly ironic.",
    prompt:
      "vaporwave aesthetic, neon pink purple and cyan, retro grid horizon, roman statue busts, 80s 90s digital nostalgia, chrome text, japanese glyphs, dreamy sunset gradient, glitchy VHS mood",
  },
  {
    id: "steampunk",
    name_zh: "蒸汽朋克",
    name_en: "Steampunk",
    tagline_zh: "蒸汽齿轮，黄铜工业",
    tagline_en: "Brass gears, industrial",
    thumb: grad("#B08E68", "#66492F", "#241B14"),
    palette: [
      { hex: "#241B14", role_zh: "深皮革", role_en: "Dark leather" },
      { hex: "#4A3330", role_zh: "赭褐", role_en: "Oxblood brown" },
      { hex: "#66492F", role_zh: "青铜", role_en: "Bronze" },
      { hex: "#8C7350", role_zh: "黄铜", role_en: "Brass" },
      { hex: "#B08E68", role_zh: "做旧金", role_en: "Aged gold" },
    ],
    description_zh:
      "蒸汽朋克把维多利亚时代工业与蒸汽机械幻想化：黄铜齿轮、铆钉管道、皮革与做旧金属、复古仪表，厚重、精密、复古未来。",
    description_en:
      "Steampunk fantasizes Victorian industry and steam machinery: brass gears, riveted pipes, leather and aged metal, vintage gauges — heavy, intricate and retro-futuristic.",
    prompt:
      "steampunk style, brass gears and cogs, riveted copper pipes, leather and aged metal, victorian machinery, vintage gauges and dials, warm bronze and gold, intricate industrial retro-futurism",
  },
  {
    id: "medieval",
    name_zh: "中世纪风格",
    name_en: "Medieval",
    tagline_zh: "古朴厚重，手抄卷轴",
    tagline_en: "Ancient, weighty, manuscript",
    thumb: grad("#C6B091", "#907860", "#141414"),
    palette: [
      { hex: "#141414", role_zh: "墨黑", role_en: "Ink black" },
      { hex: "#6E5A44", role_zh: "深棕", role_en: "Umber" },
      { hex: "#907860", role_zh: "皮革棕", role_en: "Leather brown" },
      { hex: "#A89078", role_zh: "米褐", role_en: "Tan" },
      { hex: "#C6B091", role_zh: "羊皮纸", role_en: "Parchment" },
    ],
    description_zh:
      "中世纪风格取自手抄本与教堂艺术：羊皮纸底、繁复首字母装饰、哥特衬线、木刻插图与土褐配色，古朴、厚重、庄严。",
    description_en:
      "Medieval style draws on illuminated manuscripts and church art: parchment grounds, ornate drop-caps, gothic serifs, woodcut illustration and earthy browns — ancient, weighty and solemn.",
    prompt:
      "medieval illuminated manuscript, aged parchment texture, ornate illuminated drop-cap, gothic serif lettering, woodcut illustration, earthy browns and ink, gold leaf accents, ancient and solemn",
  },
];

export const STYLES: StyleResult[] = SEEDS.map((seed) => {
  const images = STYLE_IMAGES[seed.id] ?? [];
  return {
    ...seed,
    images,
    image: images[0],
    css: buildCss(seed),
    markdown: buildMarkdown(seed),
  };
});

export function getStyleById(id: string): StyleResult | undefined {
  return STYLES.find((s) => s.id === id);
}
