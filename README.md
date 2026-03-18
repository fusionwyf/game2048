# 2048 · 数字海洋

一款具有沉浸式“数字海洋”设计风格的2048游戏，使用React + TypeScript + Vite构建。

![游戏截图](https://img.shields.io/badge/游戏-2048-blue) ![技术栈](https://img.shields.io/badge/技术栈-React%20%2B%20TypeScript%20%2B%20Vite-green) ![许可证](https://img.shields.io/badge/许可证-MIT-orange)

## ✨ 功能特性

- 🎮 **经典2048玩法**：通过滑动合并数字方块，达到2048即可获胜
- 🎨 **沉浸式设计**：深海/数字海洋主题，带有柔和的霓虹光效和玻璃态效果
- 🌊 **粒子背景**：动态浮动粒子效果，增强沉浸感
- 🎵 **音效系统**：移动、合并、胜利、失败等操作配有音效
- 🌙 **多主题切换**：深海、黄昏、极光、午夜四种视觉主题
- 📱 **响应式设计**：支持键盘和触屏操作，适配移动设备
- ⚡ **流畅动画**：方块移动和合并动画流畅自然
- 🏆 **分数追踪**：实时显示当前分数和历史最高分

## 🛠️ 技术栈

- **前端框架**：React 19.x
- **开发语言**：TypeScript 5.x
- **构建工具**：Vite 8.x
- **样式方案**：CSS Modules + 现代CSS特性
- **状态管理**：React Hooks (自定义Hook)

## 📦 安装与运行

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
# 克隆项目
git clone <仓库地址>
cd 2048

# 安装依赖
npm install
# 或
yarn install
```

### 开发模式

```bash
npm run dev
# 或
yarn dev
```

### 生产构建

```bash
npm run build
# 或
yarn build
```

### 预览构建结果

```bash
npm run preview
# 或
yarn preview
```

## 🎯 使用说明

1. **开始游戏**：打开应用后自动开始新游戏
2. **移动方块**：
   - **键盘**：使用 ↑ ↓ ← → 方向键
   - **触屏**：在游戏区域滑动手指
3. **游戏目标**：合并相同数字，达到2048即可获胜
4. **控制选项**：
   - 🔄 **新游戏**：重新开始
   - 🔊 **音效**：开启/关闭音效
   - 🎨 **主题**：切换视觉主题

## 📁 项目结构

```
2048/
├── src/
│   ├── components/          # React组件
│   │   ├── Grid.tsx         # 4x4游戏网格
│   │   ├── Tile.tsx         # 数字方块
│   │   ├── ScoreBoard.tsx   # 分数显示
│   │   ├── GameControls.tsx # 游戏控制面板
│   │   ├── GameOverlay.tsx  # 游戏结束/胜利覆盖层
│   │   └── ParticleBackground.tsx # 粒子背景
│   ├── hooks/               # 自定义Hook
│   │   ├── useGameLogic.ts  # 游戏核心逻辑
│   │   ├── useKeyboard.ts   # 键盘事件处理
│   │   ├── useTouch.ts      # 触屏事件处理
│   │   └── useSound.ts      # 音效管理
│   ├── types.ts             # TypeScript类型定义
│   ├── App.tsx              # 主应用组件
│   ├── App.css              # 应用样式
│   └── main.tsx             # 入口文件
├── public/                  # 静态资源
├── index.html               # HTML入口
├── package.json             # 项目配置
├── tsconfig.json            # TypeScript配置
└── vite.config.ts           # Vite配置
```

## 🎨 设计理念

本项目以“数字海洋中滑行”为核心设计理念，旨在创造一种沉浸式、放松却又令人上瘾的游戏体验。通过深空/深海美学与柔和的霓虹光效相结合，配合玻璃态效果的数字方块和流畅的动画，让玩家在数字的海洋中享受冥想般的滑行体验。

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件（如有）。

## 🙏 致谢

- 灵感来源于经典2048游戏
- 感谢所有开源贡献者

---

**享受游戏，探索数字的海洋！** 🌊