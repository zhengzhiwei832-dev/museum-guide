# Claude Code 协作规范

## 项目概述

- **技术栈**：React 19 + Vite 8 + Tailwind CSS 4 + TypeScript 6 + React Router 7 + Framer Motion
- **类型**：移动端优先的博物馆导览 PWA
- **部署**：Vercel（生产）+ GitHub Pages（备用）
- **关键约束**：`HashRouter`、snap scroll 交互、大量静态数据硬编码在 TS 中

## 核心安全规则（按优先级排序）

### 规则 1：Import 修改必须遵循「追加优先」原则

**禁止**：直接替换 import 中的符号名，尤其涉及 React hooks 时。

```typescript
// ❌ 危险：如果文件中还有其他 useEffect 调用，会直接编译报错
import { useState, useRef, useCallback, useLayoutEffect } from 'react';
//     删除了 useEffect ↑

// ✅ 安全：追加新符号，保留旧符号
import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
//     保留 useEffect，追加 useLayoutEffect ↑
```

**操作流程**：
1. 需要新 symbol → 追加到 import，不要删除旧的
2. 确认旧 symbol 不再使用 → `grep -n '旧符号' 文件` 检查全文件
3. 确认无引用后才可删除旧 symbol

### 规则 2：任何 .ts/.tsx 修改后，必须立即运行双重验证

**强制顺序**：
```bash
npx tsc --noEmit      # 1. TypeScript 编译检查
npx eslint src        # 2. ESLint 检查
npm run build         # 3. 生产构建检查（多文件修改后必须做）
```

**不允许**：修改完一个文件后，继续改下一个文件，不做验证。

### 规则 3：批量编辑多文件时，每改完一个文件组就验证一次

**危险模式**：连续修改 5 个文件后，一次性运行验证 → 出错时无法定位是哪个文件引入的。

**安全模式**：
- 改完 1-3 个逻辑相关的文件 → 运行 `tsc --noEmit`
- 全部改完后 → 运行 `eslint` + `build`
- dev server 在运行时 → 刷新浏览器确认 golden path 正常

### 规则 4：使用 Edit 工具时，old_string 必须包含足够上下文

**禁止**：
```typescript
// ❌ 太短，容易误匹配
import { useState, useRef, useCallback, useEffect } from 'react';
```

**推荐**：
```typescript
// ✅ 包含前后行，确保唯一性
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
```

### 规则 5：React Hook 的 import 变更是高危操作，必须全文件扫描

**高危场景**：
- `useEffect` ↔ `useLayoutEffect` 切换
- 添加/删除 `useState`、`useRef` 等基础 hook
- 从 react 包导入新的 hook

**必须操作**：修改 import 后，用 `grep` 或搜索确认全文件中：
1. 旧 hook 是否还有调用
2. 新 hook 的调用位置是否正确

### 规则 6：ESLint disable 注释必须附带原因说明

```typescript
// ✅ 好：说明为什么禁用
/* eslint-disable react-hooks/set-state-in-effect */
// Reset zoom state on modal open — state reset on prop change is intentional
useLayoutEffect(() => { ... });
/* eslint-enable react-hooks/set-state-in-effect */

// ❌ 差：没有说明
// eslint-disable-next-line react-hooks/set-state-in-effect
```

## 常见陷阱清单

| 陷阱 | 场景 | 预防措施 |
|---|---|---|
| **Import 替换遗漏** | 将 `useEffect` 改为 `useLayoutEffect` 时删除旧 import | 规则 1 + 规则 5 |
| **Hook 条件调用** | 在 `if (!data) return` 之后调用 useState/useEffect | ESLint `react-hooks/rules-of-hooks` 会自动捕获，修复时不能简单移动代码 |
| **Effect 中同步 setState** | `react-hooks/set-state-in-effect` 报错 | 优先考虑用 `key` 强制 remount，或用 `useLayoutEffect` + disable 注释 |
| **CSS 类未定义** | 组件用了 `className="xxx"` 但 CSS 中无定义 | 全局搜索 className，确认 index.css 中有定义或 Tailwind 有对应 utility |
| **类型签名不匹配** | 修改组件 props 类型后，调用方未更新 | `tsc --noEmit` 会捕获 |
| **多余文件未清理** | 调试脚本、截图、HTML 留在根目录 | 规则 7 |

### 规则 7：调试文件不得提交到仓库

**必须排除**：
- `*.png`（验证截图）
- `*.py`（下载/检查脚本）
- `check_*.html`、`debug_*.html`
- `verify_*.png`、`screenshot_*.png`

已在 `.gitignore` 中配置，但新建此类文件时需提醒用户及时清理。

## 协作流程

### 当用户要求「修复问题」时

1. **定位问题**：运行 lint / build，获取精确错误位置
2. **分析影响**：用 grep 确认该符号在全文件/全项目中的使用
3. **制定修复方案**：优先最小改动，避免连带重构
4. **修改 → 验证**：改完立即 `tsc --noEmit`
5. **多文件修改 → 全量验证**：`eslint src` + `npm run build`
6. **确认运行**：dev server 刷新后，走一遍主流程（首页 → 博物馆 → 攻略 → 现场）

### 当用户要求「创建新功能」时

1. **查看现有模式**：同类功能怎么实现的（数据流、组件结构、样式方案）
2. **复用而非创新**：优先 copy & modify 现有模式
3. **类型优先**：先写类型定义，再写实现
4. **样式归属**：组件级样式用 Tailwind utility，页面级/全局样式放 `index.css`

## 项目特定约定

### 数据管理
- 博物馆数据全部硬编码在 `src/data/` 中
- 新增博物馆时，需同时创建 `museums/xxx.ts` + `guides/popular/xxx.ts` + `guides/enthusiast/xxx.ts`
- 数据文件不运行 lint（但需保持 TypeScript 类型正确）

### 路由结构
```
/                           → HomePage
/:museumId                  → ModeSelect
/:museumId/pre-trip         → PreTripGuide（snap scroll）
/:museumId/on-site          → OnSiteGuide
/:museumId/on-site/explore  → ExploreMode（snap scroll）
/:museumId/on-site/route    → SmartRoute（snap scroll）
/:museumId/exhibit/:id      → ExhibitDetail
```

### Snap Scroll 页面规范
- 外层容器：`ref={containerRef} className="snap-container"`
- 每个页面：`className="snap-page" data-page-index={index}`
- 内层滚动区域：使用 `useNestedScroll()`，将 `scrollProps` spread 到滚动 div
- 页面总数必须传给 `useSnapScroll(totalPages)`

### 图片路径
- 本地图片：`/images/xxx.jpg`（通过 `resolveImageUrl()` 处理 base path）
- 外部图片：直接写完整 URL
- 新增图片必须放入 `public/images/{museumId}/`

## 规范更新机制

当以下情况发生时，必须更新本规范：
1. 引入了新的技术/依赖
2. 发现了新的高频 bug 模式
3. 用户明确反馈某种做法有问题
4. 项目架构发生重大变化
