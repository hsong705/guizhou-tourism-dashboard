<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { formatThousand } from '../utils/format.js'

const chartRef = ref(null)
let chart = null
let resizeObserver = null

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
})

function renderChart() {
  if (!chart || !props.data.hours) return

  const { hours, todayData, yesterdayData } = props.data

  const option = {
    grid: {
      left: 50,
      right: 15,
      top: 30,
      bottom: 25,
    },
    legend: {
      top: 0,
      right: 10,
      textStyle: { color: '#d4e5ff', fontSize: 11 },
      itemWidth: 16,
      itemHeight: 8,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(6, 30, 65, 0.9)',
      borderColor: 'rgba(44, 146, 255, 0.4)',
      textStyle: { color: '#d4e5ff', fontSize: 12 },
      formatter: (params) => {
        let html = `<b>${params[0].axisValue}</b><br/>`
        params.forEach(p => {
          if (p.value !== null && p.value !== undefined) {
            html += `${p.marker} ${p.seriesName}：${formatThousand(p.value)}<br/>`
          }
        })
        return html
      },
    },
    xAxis: {
      type: 'category',
      data: hours,
      axisLine: { lineStyle: { color: 'rgba(44, 146, 255, 0.3)' } },
      axisTick: { show: false },
      axisLabel: {
        color: 'rgba(212, 229, 255, 0.6)',
        fontSize: 10,
        interval: 2,
      },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(44, 146, 255, 0.1)' } },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: 'rgba(212, 229, 255, 0.5)',
        fontSize: 10,
        formatter: (val) => val >= 10000 ? (val / 10000).toFixed(0) + 'w' : val,
      },
    },
    series: [
      {
        name: '昨日客流',
        type: 'line',
        data: yesterdayData,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: 'rgba(44, 146, 255, 0.4)',
          width: 2,
          type: 'dashed',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(44, 146, 255, 0.1)' },
            { offset: 1, color: 'transparent' },
          ]),
        },
      },
      {
        name: '今日客流',
        type: 'line',
        data: todayData,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: '#00e4ff',
          width: 2,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 228, 255, 0.25)' },
            { offset: 1, color: 'transparent' },
          ]),
        },
      },
    ],
  }

  chart.setOption(option, true)
}

watch(() => props.data, () => {
  renderChart()
}, { deep: true })

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
})
</script>

<template>
  <div class="flow-trend-chart">
    <div class="panel-title">实时客流趋势</div>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.flow-trend-chart {
  flex: 1;
  min-height: 0;
  @include panel-box;
  display: flex;
  flex-direction: column;
}

.chart-container {
  flex: 1;
  min-height: 0;
}
</style>
