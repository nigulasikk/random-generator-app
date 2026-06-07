# 随机数生成器微信小程序 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现一个微信小程序，批量生成随机数并提供带角标计数的红绿色大小分类统计。

**Architecture:** 单页微信小程序，配置区在上、结果区在下。页面逻辑集中在 `index.js`，全局样式在 `app.wxss` 中定义 silent-night-ui 暗色主题变量。历史记录用 `wx.setStorageSync` 本地持久化。

**Tech Stack:** 微信小程序原生框架（WXML / WXSS / JS），无第三方依赖。

---

## 文件结构

| 文件 | 职责 |
|---|---|
| `miniprogram/app.js` | 小程序入口，空壳 |
| `miniprogram/app.json` | 全局配置（页面路由、窗口样式、导航栏） |
| `miniprogram/app.wxss` | 全局样式：silent-night-ui CSS 变量 + 基底 + 通用组件类 |
| `miniprogram/pages/index/index.wxml` | 页面结构：顶栏 + 配置卡片 + 结果卡片 + 历史弹窗 |
| `miniprogram/pages/index/index.wxss` | 页面样式：布局、数字网格、统计区、弹窗 |
| `miniprogram/pages/index/index.js` | 页面逻辑：数据绑定、生成算法、统计计算、历史管理 |
| `miniprogram/project.config.json` | 项目配置 |

---

### Task 1: 项目脚手架 + 全局样式

**Files:**
- Create: `miniprogram/app.js`
- Create: `miniprogram/app.json`
- Create: `miniprogram/app.wxss`
- Create: `miniprogram/project.config.json`

- [ ] **Step 1: 创建 `miniprogram/project.config.json`**

```json
{
  "description": "随机数生成器",
  "packOptions": {
    "ignore": [],
    "include": []
  },
  "setting": {
    "urlCheck": false,
    "es6": true,
    "enhance": true,
    "postcss": true,
    "preloadBackgroundData": false,
    "minified": true,
    "newFeature": false,
    "coverView": true,
    "nodeModules": false,
    "autoAudits": false,
    "showShadowRootInWxmlPanel": true,
    "scopeDataCheck": false,
    "uglifyFileName": false,
    "checkInvalidKey": true,
    "checkSiteMap": true,
    "uploadWithSourceMap": true,
    "compileHotReLoad": false,
    "lazyloadPlaceholderEnable": false,
    "useMultiFrameRuntime": true,
    "useApiHook": true,
    "useApiHostProcess": true,
    "babelSetting": {
      "ignore": [],
      "disablePlugins": [],
      "outputPath": ""
    },
    "enableEngineNative": false,
    "useIsolateContext": true,
    "userConfirmedBundleSwitch": false,
    "packNpmManually": false,
    "packNpmRelationList": [],
    "minifyWXSS": true,
    "showES6CompileOption": false,
    "minifyWXML": true,
    "ignoreUploadUnusedFiles": true
  },
  "compileType": "miniprogram",
  "condition": {},
  "editorSetting": {
    "tabIndent": "insertSpaces",
    "tabSize": 2
  }
}
```

- [ ] **Step 2: 创建 `miniprogram/app.json`**

```json
{
  "pages": [
    "pages/index/index"
  ],
  "window": {
    "navigationBarTitleText": "随机数生成器",
    "navigationBarBackgroundColor": "#0a0d12",
    "navigationBarTextStyle": "white",
    "backgroundColor": "#0a0d12",
    "backgroundTextStyle": "dark"
  },
  "sitemapLocation": "sitemap.json"
}
```

- [ ] **Step 3: 创建 `miniprogram/app.js`**

```js
App({})
```

- [ ] **Step 4: 创建 `miniprogram/app.wxss`（silent-night-ui 全局样式）**

```css
page {
  --bg: #0a0d12;
  --bg-soft: #11151a;
  --card: #14181e;
  --card-soft: #1a1f27;
  --card-quiet: #20262f;
  --ink: #ececec;
  --ink-soft: #b8b8b2;
  --ink-quiet: #7e828a;
  --ink-faint: #4f535b;
  --mint: #45e6a4;
  --mint-soft: #8ff0c2;
  --mint-glow: rgba(69, 230, 164, 0.35);
  --mint-tint: rgba(69, 230, 164, 0.10);
  --rule: rgba(255, 255, 255, 0.07);
  --big-bg: rgba(76, 175, 80, 0.15);
  --big-color: #81c784;
  --big-badge: rgba(129, 199, 132, 0.7);
  --small-bg: rgba(239, 83, 80, 0.15);
  --small-color: #ef9a9a;
  --small-badge: rgba(239, 154, 154, 0.7);

  background: var(--bg);
  color: var(--ink);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', 'PingFang SC', 'Noto Sans SC', sans-serif;
  font-size: 28rpx;
  line-height: 1.6;
  min-height: 100vh;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 16rpx;
  font-size: 22rpx;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-quiet);
  font-weight: 600;
  margin-bottom: 28rpx;
}

.section-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: var(--mint);
  box-shadow: 0 0 10rpx var(--mint-glow);
}

.card {
  background: var(--card);
  border-radius: 40rpx;
  padding: 40rpx;
  margin-bottom: 24rpx;
  border: 1rpx solid var(--rule);
}

.pill-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1rpx solid rgba(255, 255, 255, 0.08);
  color: var(--ink-soft);
  padding: 12rpx 28rpx;
  border-radius: 999rpx;
  font-size: 24rpx;
  line-height: 1.4;
}

.pill-btn-primary {
  background: var(--mint);
  color: #0a1010;
  border: none;
  font-weight: 600;
  padding: 24rpx 28rpx;
  border-radius: 999rpx;
  font-size: 28rpx;
  line-height: 1.4;
}
```

- [ ] **Step 5: 在微信开发者工具中打开项目验证**

打开微信开发者工具 → 导入项目 → 选择 `miniprogram/` 目录。确认项目能加载，页面背景为深色 `#0a0d12`。此时页面为空白深色背景是正确的。

- [ ] **Step 6: 提交**

```bash
git add miniprogram/
git commit -m "feat: 项目脚手架和 silent-night-ui 全局样式"
```

---

### Task 2: 顶栏 + 配置卡片 UI

**Files:**
- Create: `miniprogram/pages/index/index.wxml`
- Create: `miniprogram/pages/index/index.wxss`
- Create: `miniprogram/pages/index/index.js`

- [ ] **Step 1: 创建 `miniprogram/pages/index/index.js`（初始数据和输入处理）**

```js
Page({
  data: {
    minVal: 0,
    maxVal: 100,
    count: 1,
    allowDup: true,
    results: [],
    generated: false,
    showHistory: false,
    history: [],
    errorMsg: ''
  },

  onLoad() {
    this.loadHistory()
  },

  onMinInput(e) {
    this.setData({ minVal: this.parseInput(e.detail.value), errorMsg: '' })
  },

  onMaxInput(e) {
    this.setData({ maxVal: this.parseInput(e.detail.value), errorMsg: '' })
  },

  onCountInput(e) {
    this.setData({ count: this.parseInput(e.detail.value), errorMsg: '' })
  },

  onDupChange(e) {
    this.setData({ allowDup: e.detail.value, errorMsg: '' })
  },

  parseInput(val) {
    const n = parseInt(val, 10)
    return isNaN(n) || n < 0 ? 0 : n
  },

  onReset() {
    this.setData({
      minVal: 0,
      maxVal: 100,
      count: 1,
      allowDup: true,
      results: [],
      generated: false,
      errorMsg: ''
    })
  },

  loadHistory() {
    const history = wx.getStorageSync('rng_history') || []
    this.setData({ history })
  }
})
```

- [ ] **Step 2: 创建 `miniprogram/pages/index/index.wxml`（顶栏 + 配置卡片）**

```html
<view class="page">
  <!-- 顶栏 -->
  <view class="topbar">
    <view class="brand">
      <view class="brand-dot"></view>
      <text class="brand-text">随机数生成器</text>
    </view>
    <view class="pill-btn" bindtap="onShowHistory">历史记录</view>
  </view>

  <!-- 配置卡片 -->
  <view class="card">
    <view class="section-label">
      <view class="section-dot"></view>
      <text>参数设置</text>
    </view>

    <view class="param-grid">
      <view class="param-cell">
        <text class="param-label">最小值</text>
        <input class="param-input" type="number" value="{{minVal}}" bindinput="onMinInput" />
      </view>
      <view class="param-cell">
        <text class="param-label">最大值</text>
        <input class="param-input" type="number" value="{{maxVal}}" bindinput="onMaxInput" />
      </view>
      <view class="param-cell">
        <text class="param-label">生成个数</text>
        <input class="param-input" type="number" value="{{count}}" bindinput="onCountInput" />
      </view>
      <view class="param-cell param-switch-cell">
        <view>
          <text class="param-label">允许重复</text>
          <text class="param-status" style="color: {{allowDup ? 'var(--mint)' : 'var(--ink-quiet)'}}">{{allowDup ? '已开启' : '已关闭'}}</text>
        </view>
        <switch checked="{{allowDup}}" bindchange="onDupChange" color="#45e6a4" />
      </view>
    </view>

    <view wx:if="{{errorMsg}}" class="error-msg">{{errorMsg}}</view>

    <view class="btn-row">
      <view class="pill-btn btn-reset" bindtap="onReset">重置</view>
      <view class="pill-btn-primary btn-generate" bindtap="onGenerate">生成随机数</view>
    </view>
  </view>

  <!-- 结果卡片（占位，Task 3 实现） -->
  <view class="card" wx:if="{{generated}}">
    <view class="section-label">
      <view class="section-dot"></view>
      <text>生成结果</text>
    </view>
    <text class="empty-text">结果区待实现</text>
  </view>

  <view class="card" wx:if="{{!generated}}">
    <text class="empty-text">请生成随机数</text>
  </view>
</view>
```

- [ ] **Step 3: 创建 `miniprogram/pages/index/index.wxss`（顶栏 + 配置样式）**

```css
.page {
  padding: 32rpx 24rpx 80rpx;
}

/* 顶栏 */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.brand {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.brand-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: var(--mint);
  box-shadow: 0 0 16rpx var(--mint-glow);
}

.brand-text {
  font-size: 24rpx;
  letter-spacing: 0.18em;
  color: var(--ink-soft);
  font-weight: 500;
}

/* 参数区 */
.param-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  margin-bottom: 28rpx;
}

.param-cell {
  background: var(--card-soft);
  border-radius: 24rpx;
  padding: 24rpx 28rpx;
}

.param-label {
  font-size: 20rpx;
  color: var(--ink-quiet);
  letter-spacing: 0.12em;
  font-weight: 600;
  display: block;
  margin-bottom: 10rpx;
}

.param-input {
  font-size: 40rpx;
  font-weight: 600;
  color: var(--ink);
  font-family: 'SF Mono', Consolas, Menlo, monospace;
  background: transparent;
  border: none;
  padding: 0;
  width: 100%;
}

.param-switch-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.param-status {
  font-size: 24rpx;
  font-weight: 500;
  display: block;
  margin-top: 4rpx;
}

/* 错误提示 */
.error-msg {
  color: var(--small-color);
  font-size: 24rpx;
  margin-bottom: 20rpx;
  padding: 0 8rpx;
}

/* 按钮行 */
.btn-row {
  display: flex;
  gap: 16rpx;
}

.btn-reset {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
}

.btn-generate {
  flex: 2;
  text-align: center;
}

/* 空状态 */
.empty-text {
  display: block;
  text-align: center;
  color: var(--ink-faint);
  font-size: 28rpx;
  padding: 60rpx 0;
}
```

- [ ] **Step 4: 在微信开发者工具中预览**

确认：深色背景、顶栏（绿点 + 品牌名 + 历史按钮）、配置卡片（4 个参数输入 + 开关 + 重置/生成按钮）、底部空状态提示「请生成随机数」。输入框可编辑，开关可切换。

- [ ] **Step 5: 提交**

```bash
git add miniprogram/pages/
git commit -m "feat: 顶栏和配置卡片 UI"
```

---

### Task 3: 随机数生成逻辑 + 边界校验

**Files:**
- Modify: `miniprogram/pages/index/index.js`

- [ ] **Step 1: 在 `index.js` 中添加 `validate` 方法和 `onGenerate` 方法**

在 `onReset()` 方法后面添加：

```js
  validate() {
    const { minVal, maxVal, count, allowDup } = this.data
    if (minVal > maxVal) {
      this.setData({ errorMsg: '最小值不能大于最大值' })
      return false
    }
    if (count < 1) {
      this.setData({ errorMsg: '生成个数至少为 1' })
      return false
    }
    if (!allowDup && count > (maxVal - minVal + 1)) {
      this.setData({ errorMsg: '不允许重复时，生成个数不能超过 ' + (maxVal - minVal + 1) })
      return false
    }
    return true
  },

  onGenerate() {
    if (!this.validate()) return

    const { minVal, maxVal, count, allowDup } = this.data
    const numbers = this.generateNumbers(minVal, maxVal, count, allowDup)
    const threshold = Math.ceil((minVal + maxVal) / 2)

    let bigCount = 0
    let smallCount = 0
    const results = numbers.map(num => {
      const isBig = num >= threshold
      if (isBig) {
        bigCount++
      } else {
        smallCount++
      }
      return {
        value: num,
        isBig,
        badge: isBig ? bigCount : smallCount
      }
    })

    this.setData({
      results,
      generated: true,
      threshold,
      bigCount,
      smallCount,
      errorMsg: ''
    })

    this.saveToHistory(results, threshold, bigCount, smallCount)
  },

  generateNumbers(min, max, count, allowDup) {
    const numbers = []
    if (allowDup) {
      for (let i = 0; i < count; i++) {
        numbers.push(Math.floor(Math.random() * (max - min + 1)) + min)
      }
    } else {
      const pool = []
      for (let i = min; i <= max; i++) {
        pool.push(i)
      }
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]]
      }
      numbers.push(...pool.slice(0, count))
    }
    return numbers
  },

  // Task 6 会替换为完整实现
  saveToHistory() {},
```

- [ ] **Step 2: 在 `data` 中补充 `threshold`、`bigCount`、`smallCount` 初始值**

在 `index.js` 的 `data` 对象中添加：

```js
    threshold: 50,
    bigCount: 0,
    smallCount: 0,
```

- [ ] **Step 3: 在微信开发者工具中测试**

测试用例：
1. 设 min=0, max=60, count=10, 允许重复 → 点击生成 → 应生成 10 个数字
2. 设 min=5, max=3 → 点击生成 → 应显示错误「最小值不能大于最大值」
3. 设 min=0, max=5, count=10, 不允许重复 → 应显示错误「不允许重复时，生成个数不能超过 6」
4. 设 count=0 → 应显示错误「生成个数至少为 1」

- [ ] **Step 4: 提交**

```bash
git add miniprogram/pages/index/index.js
git commit -m "feat: 随机数生成逻辑和边界校验"
```

---

### Task 4: 结果数字网格（红绿背景 + 角标）

**Files:**
- Modify: `miniprogram/pages/index/index.wxml`
- Modify: `miniprogram/pages/index/index.wxss`

- [ ] **Step 1: 替换 `index.wxml` 中的结果卡片占位为完整实现**

将 `<!-- 结果卡片（占位，Task 3 实现） -->` 开始的两个结果区 `<view>` 块替换为：

```html
  <!-- 结果卡片 -->
  <view class="card" wx:if="{{generated}}">
    <view class="result-header">
      <view class="section-label">
        <view class="section-dot"></view>
        <text>生成结果</text>
      </view>
      <view class="pill-btn" bindtap="onCopy">复制结果</view>
    </view>

    <!-- 数字网格 -->
    <view class="num-grid">
      <view
        wx:for="{{results}}"
        wx:key="index"
        class="num-cell {{item.isBig ? 'big' : 'small'}}"
      >
        <text class="num-value">{{item.value}}</text>
        <text class="num-badge {{item.isBig ? 'big' : 'small'}}">{{item.badge}}</text>
      </view>
    </view>

    <!-- 统计区（Task 5 实现） -->
  </view>

  <!-- 空状态 -->
  <view class="card" wx:if="{{!generated}}">
    <text class="empty-text">请生成随机数</text>
  </view>
```

- [ ] **Step 2: 在 `index.wxss` 中添加数字网格样式**

```css
/* 结果标题行 */
.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.result-header .section-label {
  margin-bottom: 0;
}

/* 数字网格 */
.num-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 32rpx;
}

.num-cell {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  font-size: 26rpx;
  font-weight: 600;
  position: relative;
}

.num-cell.big {
  background: var(--big-bg);
  color: var(--big-color);
}

.num-cell.small {
  background: var(--small-bg);
  color: var(--small-color);
}

.num-badge {
  position: absolute;
  top: 4rpx;
  right: 8rpx;
  font-size: 16rpx;
  font-weight: 500;
}

.num-badge.big {
  color: var(--big-badge);
}

.num-badge.small {
  color: var(--small-badge);
}
```

- [ ] **Step 3: 在微信开发者工具中验证**

设 min=0, max=60, count=20, 允许重复 → 点击生成 → 确认：
1. 每个数字显示为方块，绿色底 = 大（≥30），红色底 = 小（<30）
2. 右上角角标分别标注是第几个大数/小数
3. 网格自动换行

- [ ] **Step 4: 提交**

```bash
git add miniprogram/pages/index/index.wxml miniprogram/pages/index/index.wxss
git commit -m "feat: 红绿背景数字网格和角标计数"
```

---

### Task 5: 统计区 + 比例条 + 复制功能

**Files:**
- Modify: `miniprogram/pages/index/index.wxml`
- Modify: `miniprogram/pages/index/index.wxss`
- Modify: `miniprogram/pages/index/index.js`

- [ ] **Step 1: 在 `index.wxml` 的结果卡片内，数字网格下方添加统计区**

在 `<!-- 统计区（Task 5 实现） -->` 位置替换为：

```html
    <!-- 统计区 -->
    <view class="stats-divider"></view>
    <view class="stats-section">
      <text class="stats-title">大小统计（分界点：{{threshold}}）</text>
      <view class="stats-row">
        <view class="stats-cell">
          <text class="stats-label big">大（≥{{threshold}}）</text>
          <text class="stats-num big">{{bigCount}}</text>
          <text class="stats-pct">{{bigCount + smallCount > 0 ? (bigCount / (bigCount + smallCount) * 100).toFixed(1) : '0.0'}}%</text>
        </view>
        <view class="stats-cell">
          <text class="stats-label small">小（<{{threshold}}）</text>
          <text class="stats-num small">{{smallCount}}</text>
          <text class="stats-pct">{{bigCount + smallCount > 0 ? (smallCount / (bigCount + smallCount) * 100).toFixed(1) : '0.0'}}%</text>
        </view>
      </view>
      <view class="ratio-bar">
        <view class="ratio-big" style="width: {{bigCount + smallCount > 0 ? bigCount / (bigCount + smallCount) * 100 : 50}}%"></view>
        <view class="ratio-small" style="width: {{bigCount + smallCount > 0 ? smallCount / (bigCount + smallCount) * 100 : 50}}%"></view>
      </view>
    </view>
```

- [ ] **Step 2: 在 `index.wxss` 中添加统计区样式**

```css
/* 统计区 */
.stats-divider {
  border-top: 1rpx solid var(--rule);
  padding-top: 28rpx;
}

.stats-title {
  font-size: 20rpx;
  color: var(--ink-quiet);
  letter-spacing: 0.12em;
  font-weight: 600;
  display: block;
  margin-bottom: 20rpx;
}

.stats-row {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.stats-cell {
  flex: 1;
  background: var(--card-soft);
  border-radius: 24rpx;
  padding: 28rpx;
  text-align: center;
}

.stats-label {
  font-size: 20rpx;
  letter-spacing: 0.12em;
  font-weight: 600;
  display: block;
  margin-bottom: 10rpx;
}

.stats-label.big { color: var(--big-color); }
.stats-label.small { color: var(--small-color); }

.stats-num {
  font-size: 56rpx;
  font-weight: 600;
  font-family: 'SF Mono', Consolas, Menlo, monospace;
  display: block;
}

.stats-num.big { color: var(--big-color); }
.stats-num.small { color: var(--small-color); }

.stats-pct {
  font-size: 22rpx;
  color: var(--ink-quiet);
  display: block;
  margin-top: 6rpx;
}

/* 比例条 */
.ratio-bar {
  height: 10rpx;
  border-radius: 5rpx;
  overflow: hidden;
  display: flex;
  background: var(--card-soft);
}

.ratio-big {
  background: rgba(76, 175, 80, 0.5);
  transition: width 0.3s ease;
}

.ratio-small {
  background: rgba(239, 83, 80, 0.5);
  transition: width 0.3s ease;
}
```

- [ ] **Step 3: 在 `index.js` 中添加 `onCopy` 方法**

在 `generateNumbers` 方法后面添加：

```js
  onCopy() {
    const text = this.data.results.map(r => r.value).join(', ')
    wx.setClipboardData({
      data: text
    })
  },
```

- [ ] **Step 4: 在微信开发者工具中验证**

1. 生成 20 个随机数 → 确认统计区显示大/小数量、百分比和比例条
2. 点击「复制结果」→ 确认弹出微信复制成功提示
3. 粘贴检查 → 确认格式为逗号分隔的数字

- [ ] **Step 5: 提交**

```bash
git add miniprogram/pages/index/
git commit -m "feat: 大小统计区、比例条和复制功能"
```

---

### Task 6: 历史记录弹窗

**Files:**
- Modify: `miniprogram/pages/index/index.wxml`
- Modify: `miniprogram/pages/index/index.wxss`
- Modify: `miniprogram/pages/index/index.js`

- [ ] **Step 1: 在 `index.js` 中替换 `saveToHistory` 空桩并添加历史相关方法**

删除 Task 3 中的 `saveToHistory() {},` 空桩，在 `onCopy` 方法后面添加以下完整实现：

```js
  saveToHistory(results, threshold, bigCount, smallCount) {
    const { minVal, maxVal, count, allowDup } = this.data
    const record = {
      id: Date.now(),
      minVal,
      maxVal,
      count,
      allowDup,
      threshold,
      bigCount,
      smallCount,
      results,
      timestamp: Date.now()
    }
    let history = wx.getStorageSync('rng_history') || []
    history.unshift(record)
    if (history.length > 20) {
      history = history.slice(0, 20)
    }
    wx.setStorageSync('rng_history', history)
    this.setData({ history })
  },

  onShowHistory() {
    this.loadHistory()
    this.setData({ showHistory: true })
  },

  onHideHistory() {
    this.setData({ showHistory: false })
  },

  onHistoryTap(e) {
    const record = e.currentTarget.dataset.record
    this.setData({
      minVal: record.minVal,
      maxVal: record.maxVal,
      count: record.count,
      allowDup: record.allowDup,
      results: record.results,
      generated: true,
      threshold: record.threshold,
      bigCount: record.bigCount,
      smallCount: record.smallCount,
      showHistory: false
    })
  },

  formatTime(timestamp) {
    const d = new Date(timestamp)
    const now = new Date()
    const pad = n => String(n).padStart(2, '0')
    const time = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
    if (d.toDateString() === now.toDateString()) {
      return time
    }
    return pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes())
  },
```

- [ ] **Step 2: 在 `index.wxml` 底部（`</view>` 结束标签前）添加历史弹窗**

在最后的 `</view>` 前添加：

```html
  <!-- 历史记录弹窗 -->
  <view class="modal-mask" wx:if="{{showHistory}}" bindtap="onHideHistory">
    <view class="modal-panel" catchtap="">
      <view class="modal-header">
        <view class="section-label">
          <view class="section-dot"></view>
          <text>历史记录</text>
        </view>
        <text class="modal-close" bindtap="onHideHistory">×</text>
      </view>

      <scroll-view scroll-y class="modal-scroll">
        <view wx:if="{{history.length === 0}}" class="empty-text" style="padding: 40rpx 0;">暂无记录</view>
        <view
          wx:for="{{history}}"
          wx:key="id"
          class="history-item"
          data-record="{{item}}"
          bindtap="onHistoryTap"
        >
          <view class="history-top">
            <text class="history-params">{{item.minVal}} ~ {{item.maxVal}} × {{item.count}}个</text>
            <text class="history-time">{{formatTime(item.timestamp)}}</text>
          </view>
          <view class="history-stats">
            <text class="history-big">大 {{item.bigCount}}</text>
            <text class="history-sep">|</text>
            <text class="history-small">小 {{item.smallCount}}</text>
            <text class="history-dup">{{item.allowDup ? '允许重复' : '不重复'}}</text>
          </view>
        </view>
      </scroll-view>

      <text class="modal-hint">点击记录可回看完整结果</text>
    </view>
  </view>
```

- [ ] **Step 3: 注意 — `formatTime` 不能在 WXML 中直接调用**

微信小程序的 WXML 不支持在模板中调用页面方法。需要用 WXS 来格式化时间。

在 `miniprogram/pages/index/` 目录下创建 `index.wxs`：

```js
var formatTime = function(timestamp) {
  var d = getDate(timestamp)
  var now = getDate()
  var pad = function(n) {
    return n < 10 ? '0' + n : '' + n
  }
  var time = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
  if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()) {
    return time
  }
  return pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes())
}

module.exports = {
  formatTime: formatTime
}
```

然后在 `index.wxml` 顶部添加 WXS 引用：

```html
<wxs src="./index.wxs" module="utils" />
```

同时将弹窗中的 `{{formatTime(item.timestamp)}}` 改为 `{{utils.formatTime(item.timestamp)}}`。

- [ ] **Step 4: 在 `index.wxss` 中添加弹窗样式**

```css
/* 历史弹窗 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48rpx;
}

.modal-panel {
  background: var(--card);
  border-radius: 40rpx;
  padding: 40rpx;
  width: 100%;
  max-height: 70vh;
  border: 1rpx solid var(--rule);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.modal-header .section-label {
  margin-bottom: 0;
}

.modal-close {
  color: var(--ink-quiet);
  font-size: 40rpx;
  padding: 8rpx 16rpx;
  line-height: 1;
}

.modal-scroll {
  flex: 1;
  max-height: 50vh;
}

.history-item {
  background: var(--card-soft);
  border-radius: 24rpx;
  padding: 24rpx 28rpx;
  margin-bottom: 16rpx;
}

.history-item:last-child {
  margin-bottom: 0;
}

.history-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.history-params {
  font-size: 24rpx;
  color: var(--ink);
  font-weight: 600;
}

.history-time {
  font-size: 20rpx;
  color: var(--ink-quiet);
}

.history-stats {
  display: flex;
  gap: 12rpx;
  font-size: 22rpx;
  align-items: center;
}

.history-big { color: var(--big-color); }
.history-sep { color: var(--ink-quiet); }
.history-small { color: var(--small-color); }
.history-dup {
  color: var(--ink-quiet);
  margin-left: auto;
}

.modal-hint {
  text-align: center;
  font-size: 22rpx;
  color: var(--ink-faint);
  padding-top: 20rpx;
  display: block;
}
```

- [ ] **Step 5: 在微信开发者工具中验证**

1. 先生成几次随机数
2. 点击「历史记录」→ 确认弹窗展示，列表显示每条记录的参数、时间戳、统计
3. 点击某条记录 → 确认弹窗关闭，结果区加载该历史记录的完整结果
4. 确认时间戳格式：当天显示 HH:MM:SS，跨天显示 MM-DD HH:MM

- [ ] **Step 6: 提交**

```bash
git add miniprogram/pages/index/
git commit -m "feat: 历史记录弹窗（本地存储 + 时间戳 + 回看）"
```

---

### Task 7: 收尾调整

**Files:**
- Modify: `miniprogram/pages/index/index.js`（清理 `formatTime` 方法，因已移至 WXS）
- Review: 所有文件

- [ ] **Step 1: 清理 `index.js` 中的 `formatTime` 方法**

删除 `index.js` 中的 `formatTime` 方法（已迁移到 `index.wxs`）。

- [ ] **Step 2: 端到端验收测试**

在微信开发者工具中执行以下完整流程：

1. **初始状态**：深色背景、配置卡片（默认值 0/100/1/允许重复）、空状态提示「请生成随机数」
2. **基础生成**：设 min=0, max=60, count=100 → 生成 → 确认 100 个数字方块、红绿分色正确、角标连续
3. **统计验证**：手动核对角标最大值与统计区的大/小数量一致，百分比正确
4. **比例条**：绿红比例与统计数量一致
5. **边界校验**：min>max → 错误提示；count=0 → 错误提示；不重复+count>范围 → 错误提示
6. **复制**：点击复制 → 粘贴检查格式
7. **历史**：点击历史 → 确认有记录 → 点击回看 → 确认结果恢复
8. **重置**：点击重置 → 确认参数恢复默认、结果清空

- [ ] **Step 3: 提交**

```bash
git add miniprogram/
git commit -m "chore: 收尾清理和端到端验收"
```
