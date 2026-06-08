/**
 * 数字格式化工具
 */

/**
 * 格式化大数字，如 1234567 → 123.46万
 */
export function formatBigNumber(num) {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(2) + '亿'
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(2) + '万'
  }
  return num.toLocaleString()
}

/**
 * 格式化金额，如 12345678 → 1,234.57万
 */
export function formatMoney(num) {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(2) + '亿'
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(2) + '万'
  }
  return num.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' })
}

/**
 * 格式化百分比，如 0.1234 → 12.34%
 */
export function formatPercent(num, digits = 2) {
  return (num * 100).toFixed(digits) + '%'
}

/**
 * 格式化千分位
 */
export function formatThousand(num) {
  return num.toLocaleString()
}

/**
 * 生成随机整数 [min, max]
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 在基准值附近浮动
 */
export function fluctuate(base, range = 0.1) {
  const delta = base * range
  return Math.round(base + (Math.random() - 0.5) * 2 * delta)
}
