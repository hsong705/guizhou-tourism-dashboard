<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import * as echarts from 'echarts'
import { formatMoney } from '../utils/format.js'

const chartRef = ref(null)
let chart = null
let resizeObserver = null

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
})

const displayTotal = ref(0)
let animFrame = null

function animateNumber(target, duration = 1500) {
  const start = displayTotal.value
  const diff = target - start
  const startTime = performance.now()

  function step(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
    displayTotal.value = Math.round(start + diff * eased)
    if (progress < 1) {
      animFrame = requestAnimationFrame(step)
    }
  }
  animFrame = requestAnimationFrame(step)
}

const formattedTotal = computed(() => formatMoney(displayTotal.value))

function renderChart() {
  if (!chart || !props.data.typeData) return

  const { typeData, totalConsum, yoy, mom } = props.data

  animateNumber(totalConsum)

  const option = {
    series: [
      {
        type: 'pie',
        radius: ['55%', '75%'],
        center: ['50%', '50%'],
        data: typeData,
        label: { show: false },
        emphasis: {
          scaleSize: 5,
          label: {
            show: true,
            color: '#d4e5ff',
            fontSize: 12,
            formatter: '{b}: {d}%',
          },
        },
        itemStyle: {
          borderColor: 'rgba(6, 30, 65, 0.85)',
          borderWidth: 2,
        },
      },
    ],
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(6, 30, 65, 0.9)',
      borderColor: 'rgba(44, 146, 255, 0.4)',
      textStyle: { color: '#d4e5ff', fontSize: 12 },
      formatter: (params) => {
        return `<b>${params.name}</b><br/>金额：${formatMoney(params.value)}<br/>占比：${params.percent.toFixed(1)}%`
      },
    },
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: '38%',
        style: {
          text: formattedTotal.value,
          fill: '#ffc53d',
          fontSize: 20,
          fontWeight: 'bold',
          fontFamily: 'DIN Alternate, Impact, sans-serif',
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        left: 'center',
        top: '56%',
        style: {
          text: '消费总额(元)',
          fill: 'rgba(212, 229, 255, 0.5)',
          fontSize: 11,
          textAlign: 'center',
        },
      },
    ],
  }

  chart.setOption(option, true)
}

watch(() => props.data, () => {
  renderChart()
}, { deep: true })

// 中心数字也需要响应式更新
watch(formattedTotal, () => {
  if (!chart) return
  chart.setOption({
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: '38%',
        style: {
          text: formattedTotal.value,
          fill: '#ffc53d',
          fontSize: 20,
          fontWeight: 'bold',
          fontFamily: 'DIN Alternate, Impact, sans-serif',
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        left: 'center',
        top: '56%',
        style: {
          text: '消费总额(元)',
          fill: 'rgba(212, 229, 255, 0.5)',
          fontSize: 11,
          textAlign: 'center',
        },
      },
    ],
  })
})

onMounted(() => {
  chart = echarts.init(chartRef.value)
  renderChart()

  resizeObserver = new ResizeObserver(() => {
    chart?.resize()
  })
  resizeObserver.observe(chartRef.value)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  chart?.dispose()
  cancelAnimationFrame(animFrame)
})
</script>

<template>
  <div class="consum-stats">
    <div class="panel-title">消费金额统计</div>
    <div class="stats-info">
      <div class="stat-item">
        <span class="stat-label">同比</span>
        <span class="stat-value up" v-if="data.yoy >= 0">↑{{ (data.yoy * 100).toFixed(1) }}%</span>
        <span class="stat-value down" v-else>↓{{ (Math.abs(data.yoy) * 100).toFixed(1) }}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">环比</span>
        <span class="stat-value up" v-if="data.mom >= 0">↑{{ (data.mom * 100).toFixed(1) }}%</span>
        <span class="stat-value down" v-else>↓{{ (Math.abs(data.mom) * 100).toFixed(1) }}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">人均</span>
        <span class="stat-value yellow">¥{{ data.perCapita }}</span>
      </div>
    </div>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.consum-stats {
  flex: 1;
  min-height: 0;
  @include panel-box;
  display: flex;
  flex-direction: column;
}

.stats-info {
  display: flex;
  justify-content: space-around;
  padding: 4px 0 8px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: $font-size-xs;
  color: $text-secondary;
  margin-right: 4px;
}

.stat-value {
  font-size: $font-size-sm;
  font-family: 'DIN Alternate', 'Impact', sans-serif;

  &.up { color: #36d7a0; }
  &.down { color: #ff6b6b; }
  &.yellow { color: $accent-yellow; }
}

.chart-container {
  flex: 1;
  min-height: 0;
}
</style>
