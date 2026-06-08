<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { formatThousand } from '../utils/format.js'

const chartRef = ref(null)
let chart = null
let resizeObserver = null

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: '各市州客流量排名',
  },
})

function renderChart() {
  if (!chart || !props.data.length) return

  const sortedData = [...props.data].sort((a, b) => a.todayFlow - b.todayFlow)
  const names = sortedData.map(d => d.name.replace(/市|州/g, ''))
  const values = sortedData.map(d => d.todayFlow)
  const maxVal = Math.max(...values)

  const option = {
    grid: {
      left: 70,
      right: 30,
      top: 5,
      bottom: 5,
    },
    xAxis: {
      type: 'value',
      show: false,
      max: maxVal * 1.1,
    },
    yAxis: {
      type: 'category',
      data: names,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#d4e5ff',
        fontSize: 12,
      },
    },
    series: [
      {
        type: 'bar',
        data: values,
        barWidth: 12,
        itemStyle: {
          borderRadius: [0, 6, 6, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: 'rgba(44, 146, 255, 0.3)' },
            { offset: 1, color: '#00e4ff' },
          ]),
        },
        label: {
          show: true,
          position: 'right',
          color: '#00e4ff',
          fontSize: 11,
          fontFamily: 'DIN Alternate, Impact, sans-serif',
          formatter: (params) => formatThousand(params.value),
        },
        backgroundStyle: {
          color: 'rgba(44, 146, 255, 0.08)',
          borderRadius: [0, 6, 6, 0],
        },
        showBackground: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(6, 30, 65, 0.9)',
      borderColor: 'rgba(44, 146, 255, 0.4)',
      textStyle: { color: '#d4e5ff', fontSize: 12 },
      formatter: (params) => {
        const d = params[0]
        const city = sortedData[d.dataIndex]
        return `<b>${city.name}</b><br/>今日客流：${formatThousand(city.todayFlow)}<br/>同比增长：${(city.yoy * 100).toFixed(1)}%`
      },
    },
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
  <div class="city-rank-chart">
    <div class="panel-title">{{ title }}</div>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.city-rank-chart {
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
