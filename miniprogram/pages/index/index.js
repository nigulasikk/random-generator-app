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
    errorMsg: '',
    threshold: 50,
    bigCount: 0,
    smallCount: 0,
    bigPct: '0.0',
    smallPct: '0.0',
    bigRatio: 50,
    smallRatio: 50,
    roundCount: 0,
    sumTotal: 0,
    splashVisible: true,
    splashLeaving: false,
    splashTip: '点击「摇一摇」即可再次开摇'
  },

  onLoad() {
    this.loadHistory()
    this.playSplash('点击顶部标题可再看一次')
  },

  onReplaySplash() {
    if (this.data.splashVisible) return
    this.playSplash('')
  },

  playSplash(tip) {
    clearTimeout(this.splashTimer1)
    clearTimeout(this.splashTimer2)
    this.setData({
      splashVisible: true,
      splashLeaving: false,
      splashTip: tip || ''
    })
    // 停留约 2.3s，退场动画 0.7s，整体约 3s
    this.splashTimer1 = setTimeout(() => {
      this.setData({ splashLeaving: true })
      this.splashTimer2 = setTimeout(() => {
        this.setData({ splashVisible: false, splashLeaving: false })
      }, 700)
    }, 2300)
  },

  onSkipSplash() {
    if (!this.data.splashVisible || this.data.splashLeaving) return
    clearTimeout(this.splashTimer1)
    this.setData({ splashLeaving: true })
    this.splashTimer2 = setTimeout(() => {
      this.setData({ splashVisible: false, splashLeaving: false })
    }, 700)
  },

  onUnload() {
    clearTimeout(this.splashTimer1)
    clearTimeout(this.splashTimer2)
  },

  onMinInput(e) {
    this.setData({ minVal: this.parseInput(e.detail.value), errorMsg: '', roundCount: 0 })
  },

  onMaxInput(e) {
    this.setData({ maxVal: this.parseInput(e.detail.value), errorMsg: '', roundCount: 0 })
  },

  onCountInput(e) {
    this.setData({ count: this.parseInput(e.detail.value), errorMsg: '', roundCount: 0 })
  },

  onDupChange(e) {
    this.setData({ allowDup: e.detail.value, errorMsg: '', roundCount: 0 })
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
      errorMsg: '',
      roundCount: 0,
      sumTotal: 0
    })
  },

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
      const isGuan = num === minVal || num === maxVal
      return {
        value: num,
        isBig,
        isGuan,
        badge: isBig ? bigCount : smallCount
      }
    })

    const total = bigCount + smallCount
    const bigPct = total > 0 ? (bigCount / total * 100).toFixed(1) : '0.0'
    const smallPct = total > 0 ? (smallCount / total * 100).toFixed(1) : '0.0'
    const bigRatio = total > 0 ? bigCount / total * 100 : 50
    const smallRatio = total > 0 ? smallCount / total * 100 : 50
    const sumTotal = numbers.reduce(function(a, b) { return a + b }, 0)
    const newRound = this.data.roundCount + 1

    this.setData({
      results,
      generated: true,
      threshold,
      bigCount,
      smallCount,
      bigPct,
      smallPct,
      bigRatio,
      smallRatio,
      roundCount: newRound,
      sumTotal,
      errorMsg: ''
    })

    this.saveToHistory(results, threshold, bigCount, smallCount, sumTotal)
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

  onCopy() {
    const text = this.data.results.map(r => r.value).join(', ')
    wx.setClipboardData({
      data: text
    })
  },

  saveToHistory(results, threshold, bigCount, smallCount, sumTotal) {
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
      sumTotal,
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

  loadHistory() {
    const history = wx.getStorageSync('rng_history') || []
    this.setData({ history })
  }
})
