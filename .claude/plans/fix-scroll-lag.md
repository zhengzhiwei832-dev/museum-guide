# 修复 ExhibitCard 页面滑动卡顿问题

## 问题描述
ExhibitCard 页面内连续滑动多次后出现卡顿现象

## 根本原因分析

### 1. **motion.div 动画过度触发** (ExhibitCard.tsx:52-106)
- 图片区域使用 `motion.div` 和 `motion.img`，动画配置复杂
- `AnimatePresence` 每次切换展品都会重新挂载/卸载
- 动画配置使用了自定义贝塞尔曲线 `ease: [0.22, 1, 0.36, 1]`，计算开销大
- 图片缩放动画 `scale: 1.05` 触发频繁的 GPU 重绘

### 2. **wheel 事件拦截过于激进** (useSnapScroll.ts:43-60)
- `preventDefault()` 阻止了默认滚动行为
- 400ms 的锁定时间对于快速滑动来说太长
- 没有区分滚动方向和意图

### 3. **scroll-snap 与 JS 干预冲突**
- CSS `scroll-snap-type: y mandatory` 与 wheel 事件处理冲突
- 浏览器原生 snap 和 JS 强制干预产生抖动

### 4. **内存累积问题**
- 每个 ExhibitCard 都有独立的 AnimatePresence
- 连续滑动时，动画组件不断创建/销毁
- 没有复用 ImageViewer 实例

## 修复方案

### 方案 1: 简化动画系统
**文件**: `src/components/ExhibitCard.tsx`
- 将 `motion.div` 改为普通 `div`
- 保留简单的 CSS transition 淡入效果
- 移除复杂的 AnimatePresence 动画
- 图片加载使用 CSS opacity transition

### 方案 2: 优化 wheel 事件处理
**文件**: `src/hooks/useSnapScroll.ts`
- 移除 `preventDefault()`，让浏览器自然处理
- 缩短锁定时间为 200ms
- 添加滚动方向检测，只限制快速连续滚动

### 方案 3: 优化 CSS 性能
**文件**: `src/index.css`
- 移除 `will-change: scroll-position`
- 简化 backdrop-filter 使用
- 添加 `content-visibility: auto` 优化渲染

### 方案 4: 组件级优化
**文件**: `src/components/ExhibitCard.tsx`
- 使用 `React.memo` 避免不必要的重渲染
- 优化 ImageViewer 懒加载逻辑

## 实施步骤

1. **简化 ExhibitCard 动画** - 移除 framer-motion 过度动画，改用 CSS
2. **优化 useSnapScroll** - 减少 wheel 事件干预，提高响应性
3. **添加 CSS 优化** - 使用 content-visibility 等现代 CSS 特性
4. **Memo 优化组件** - 防止滑动时全树重渲染

## 验证方法
- 连续快速滑动 10+ 次，观察是否出现卡顿
- 检查 DevTools Performance 面板，确认帧率稳定在 60fps
- 监控内存使用，确认无内存泄漏
