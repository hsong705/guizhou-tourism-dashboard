<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { generateCityFlowData } from '../data/mock.js'

const chartRef = ref(null)
const router = useRouter()
let chart = null
let resizeObserver = null

const props = defineProps({
  cityFlowData: {
    type: Array,
    default: () => generateCityFlowData(),
  },
  // 市级地图模式
  cityCode: {
    type: String,
    default: '',
  },
  cityName: {
    type: String,
    default: '',
  },
  districtFlowData: {
    type: Array,
    default: null,
  },
  // 重点景区数据（方形气泡）
  scenicSpots: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['scenic-click'])

function getMapName() {
  return props.cityCode ? `city_${props.cityCode}` : 'guizhou'
}

function getGeoUrl() {
  if (props.cityCode) {
    return `/geo/city/${props.cityCode}_full.json`
  }
  return '/geo/guizhou.json'
}

function initChart() {
  fetch(getGeoUrl())
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    })
    .then(geoJson => {
      echarts.registerMap(getMapName(), geoJson)
      renderChart()
    })
    .catch(err => {
      console.error('加载地图数据失败:', err)
      // 降级：如果市级地图GeoJSON不存在，用省级地图
      if (props.cityCode) {
        fetch('/geo/guizhou.json')
          .then(res => res.json())
          .then(geoJson => {
            echarts.registerMap(getMapName(), geoJson)
            renderChart()
          })
      }
    })
}

function formatFlowNum(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString()
}

function renderChart() {
  if (!chart) return

  const isProvince = !props.cityCode
  const flowData = isProvince ? props.cityFlowData : (props.districtFlowData || [])

  // 地图区域着色数据
  const mapData = flowData.map(item => ({
    name: item.name,
    value: item.todayFlow,
  }))

  // 涟漪散点数据
  const scatterData = flowData.map(item => ({
    name: item.name,
    value: [...item.coord, item.todayFlow],
    cityCode: item.code,
  }))

  // 客流数字标签 - 使用 scatter 系列
  const labelData = flowData.map(item => ({
    name: item.name,
    value: [...item.coord, item.todayFlow],
  }))

  // 动态计算 visualMap 范围
  const flowValues = flowData.map(d => d.todayFlow)
  const minFlow = flowValues.length ? Math.min(...flowValues) * 0.6 : 0
  const maxFlow = flowValues.length ? Math.max(...flowValues) * 1.2 : 100000

  // 重点景区气泡数据（省级 + 市级地图均可显示）
  const scenicBubbleData = props.scenicSpots.length
    ? props.scenicSpots.map(spot => ({
        name: spot.name,
        value: [...spot.coord, 1],
        scenicInfo: spot,
      }))
    : []

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(6, 30, 65, 0.9)',
      borderColor: 'rgba(44, 146, 255, 0.4)',
      textStyle: { color: '#d4e5ff', fontSize: 13 },
      formatter: (params) => {
        if (params.seriesType === 'map' || params.seriesType === 'effectScatter') {
          const area = flowData.find(c => c.name === params.name)
          if (!area) return params.name
          const tips = [`<b>${area.name}</b>`, `今日客流：${area.todayFlow.toLocaleString()}`]
          if (area.yoy !== undefined) {
            tips.push(`同比增长：${(area.yoy * 100).toFixed(1)}%`)
          }
          if (isProvince) {
            tips.push('<span style="color:#00e4ff">点击查看详情 →</span>')
          }
          return tips.join('<br/>')
        }
        return params.name
      },
    },
    visualMap: {
      min: Math.round(minFlow),
      max: Math.round(maxFlow),
      left: 20,
      bottom: 20,
      text: ['高', '低'],
      textStyle: { color: '#d4e5ff', fontSize: 12 },
      inRange: {
        color: ['#0a2a5a', '#0d3d7a', '#1a5a9a', '#2c92ff', '#00e4ff'],
      },
      calculable: true,
      itemWidth: 12,
      itemHeight: 100,
    },
    geo: {
      map: getMapName(),
      roam: true,
      zoom: isProvince ? 1.15 : 1.1,
      center: isProvince ? [106.7, 26.8] : undefined,
      label: {
        show: false,
      },
      itemStyle: {
        areaColor: '#0d2a5a',
        borderColor: '#2c92ff',
        borderWidth: 1,
        shadowColor: 'rgba(44, 146, 255, 0.3)',
        shadowBlur: 10,
      },
      emphasis: {
        label: {
          show: true,
          color: '#fff',
          fontSize: 14,
          fontWeight: 'bold',
        },
        itemStyle: {
          areaColor: '#1a5a9a',
          borderColor: '#00e4ff',
          borderWidth: 2,
        },
      },
    },
    series: [
      {
        name: '客流热力',
        type: 'map',
        map: getMapName(),
        geoIndex: 0,
        data: mapData,
      },
      {
        name: '城市标注',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: scatterData,
        symbolSize: (val) => Math.max(6, val[2] / 8000),
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke',
          scale: 3,
          period: 4,
        },
        label: {
          show: false,
        },
        itemStyle: {
          color: '#00e4ff',
          shadowBlur: 10,
          shadowColor: '#00e4ff',
        },
      },
      {
        // 各区域名称 + 当日累计客流数字标签
        name: '客流标签',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: labelData,
        symbolSize: 0,
        label: {
          show: true,
          formatter: (params) => {
            const area = flowData.find(c => c.name === params.name)
            if (!area) return params.name
            return `{name|${area.name.replace(/市|州/g, '')}}\n{flow|${formatFlowNum(area.todayFlow)}}`
          },
          rich: {
            name: {
              color: 'rgba(212, 229, 255, 0.85)',
              fontSize: 11,
              fontWeight: 'bold',
              lineHeight: 16,
              align: 'center',
            },
            flow: {
              color: '#ffc53d',
              fontSize: 13,
              fontWeight: 'bold',
              fontFamily: 'DIN Alternate, Impact, sans-serif',
              lineHeight: 18,
              align: 'center',
            },
          },
        },
        tooltip: { show: false },
        zlevel: 2,
      },
      {
        // 重点景区方形气泡
        name: '景区气泡',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: scenicBubbleData,
        symbol: 'rect',
        symbolSize: [68, 30],
        itemStyle: {
          color: 'rgba(6, 30, 65, 0.85)',
          borderColor: '#00e4ff',
          borderWidth: 1.5,
          shadowColor: 'rgba(0, 228, 255, 0.3)',
          shadowBlur: 8,
        },
        label: {
          show: true,
          formatter: (params) => {
            const spot = props.scenicSpots.find(s => s.name === params.name)
            return spot ? spot.shortName : params.name
          },
          color: '#00e4ff',
          fontSize: 12,
          fontWeight: 'bold',
          letterSpacing: 1,
        },
        emphasis: {
          itemStyle: {
            color: 'rgba(0, 228, 255, 0.2)',
            borderColor: '#00e4ff',
            borderWidth: 2,
            shadowColor: 'rgba(0, 228, 255, 0.6)',
            shadowBlur: 15,
          },
          label: {
            color: '#ffffff',
            fontSize: 13,
          },
        },
        tooltip: {
          show: true,
          backgroundColor: 'rgba(6, 30, 65, 0.9)',
          borderColor: 'rgba(0, 228, 255, 0.5)',
          textStyle: { color: '#d4e5ff', fontSize: 13 },
          formatter: (params) => {
            const spot = props.scenicSpots.find(s => s.name === params.name)
            if (!spot) return params.name
            return `<b>${spot.name}</b><br/>${spot.level} · ${spot.type}<br/><span style="color:#00e4ff">点击查看详情 →</span>`
          },
        },
        zlevel: 3,
      },
    ],
  }

  chart.setOption(option, true)
}

function handleMapClick(params) {
  // 景区气泡点击
  if (params.seriesName === '景区气泡') {
    const spot = props.scenicSpots.find(s => s.name === params.name)
    if (spot) {
      emit('scenic-click', spot)
      return
    }
  }
  // 仅省级地图支持城市点击跳转
  if (!props.cityCode && params.componentType === 'series' && (params.seriesType === 'map' || params.seriesType === 'effectScatter')) {
    const city = props.cityFlowData.find(c => c.name === params.name)
    if (city && city.code) {
      router.push(`/city/${city.code}`)
    }
  }
}

watch([() => props.cityFlowData, () => props.districtFlowData], () => {
  renderChart()
}, { deep: true })

onMounted(() => {
  chart = echarts.init(chartRef.value)
  chart.on('click', handleMapClick)
  initChart()

  resizeObserver = new ResizeObserver(() => {
    chart?.resize()
  })
  resizeObserver.observe(chartRef.value)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  chart?.off('click', handleMapClick)
  chart?.dispose()
})
</script>

<template>
  <div class="center-map">
    <div ref="chartRef" class="chart-container"></div>
    <div v-if="!cityCode" class="map-hint">点击市州查看详情</div>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.center-map {
  flex: 1;
  min-height: 0;
  @include panel-box;
  position: relative;
  perspective: 900px;
}

.chart-container {
  width: 100%;
  height: 100%;
  transform: rotateX(12deg);
  transform-style: preserve-3d;
  transition: transform 0.4s ease;
}

.map-hint {
  position: absolute;
  bottom: 24px;
  right: 20px;
  font-size: $font-size-xs;
  color: $text-secondary;
  animation: breathe 2s ease-in-out infinite;
}
</style>
