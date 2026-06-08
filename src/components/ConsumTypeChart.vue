<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { formatMoney } from '../utils/format.js'

const chartRef = ref(null)
let chart = null
let resizeObserver = null

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

function renderChart() {
  if (!chart || !props.data.length) return

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(6, 30, 65, 0.9)',
      borderColor: 'rgba(44, 146, 255, 0.4)',
      textStyle: { color: '#d4e5ff', fontSize: 12 },
      formatter: (params) => {
        return `<b>${params.name}</b><br/>金额：${formatMoney(params.value)}<br/>占比：${params.percent.toFixed(1)}%`
      },
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: {
        color: '#d4e5ff',
        fontSize: 11,
      },
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 10,
      formatter: (name) => {
        const item = props.data.find(d => d.name === name)
        if (item) {
          const total = props.data.reduce((s, d) => s + d.value, 0)
          const pct = ((item.value / total) * 100).toFixed(1)
          return `${name}  ${pct}%`
        }
        return name
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['0%', '65%'],
        center: ['35%', '50%'],
        roseType: 'area',
        data: props.data.map(d => ({
          name: d.name,
          value: d.value,
          itemStyle: { color: d.color },
        })),
        label: { show: false },
        emphasis: {
          scaleSize: 5,
          label: {
            show: true,
            color: '#d4e5ff',
            fontSize: 12,
          },
        },
        itemStyle: {
          borderColor: 'rgba(6, 30, 65, 0.85)',
          borderWidth: 2,
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
  <div class="consum-type-chart">
    <div class="panel-title">消费类型占比</div>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.consum-type-chart {
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
