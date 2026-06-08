<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { generateScenicRealtimeData } from '../data/mock.js'

const props = defineProps({
  scenic: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close'])

const heatmapRef = ref(null)
let heatmapChart = null
const realtimeData = ref(null)
const imgError = ref(false)

// 景区切换时重置图片错误状态
watch(() => props.scenic, () => {
  imgError.value = false
})

// 景区打开时生成实时数据
watch(() => props.scenic, (val) => {
  if (val) {
    realtimeData.value = generateScenicRealtimeData(val)
    nextTick(() => {
      renderHeatmap()
    })
  } else {
    realtimeData.value = null
    if (heatmapChart) {
      heatmapChart.dispose()
      heatmapChart = null
    }
  }
}, { immediate: true })

function renderHeatmap() {
  if (!heatmapRef.value || !realtimeData.value) return

  if (heatmapChart) {
    heatmapChart.dispose()
  }

  heatmapChart = echarts.init(heatmapRef.value)

  const data = realtimeData.value.heatmapData
  const values = data.map(d => d.value)
  const maxVal = Math.max(...values) * 1.2

  const option = {
    tooltip: {
      backgroundColor: 'rgba(6, 30, 65, 0.9)',
      borderColor: 'rgba(44, 146, 255, 0.4)',
      textStyle: { color: '#d4e5ff', fontSize: 12 },
      formatter: (params) => {
        const d = data[params.dataIndex]
        return d ? `<b>${d.area}</b><br/>当前人数：${d.value.toLocaleString()}` : ''
      },
    },
    grid: {
      top: 8,
      right: 8,
      bottom: 8,
      left: 8,
    },
    xAxis: {
      type: 'value',
      show: false,
      min: (data[0].coord[0] - 0.02),
      max: (data[data.length - 1].coord[0] + 0.02),
    },
    yAxis: {
      type: 'value',
      show: false,
      min: (data[0].coord[1] - 0.015),
      max: (data[0].coord[1] + 0.015),
    },
    series: [
      {
        type: 'heatmap',
        data: data.map((d, i) => ({
          value: [d.coord[0], d.coord[1], d.value],
          itemStyle: {
            borderColor: 'rgba(0, 228, 255, 0.3)',
            borderWidth: 1,
          },
        })),
        symbolSize: (val) => Math.max(30, (val[2] / maxVal) * 60),
        label: {
          show: true,
          formatter: (params) => data[params.dataIndex].area,
          color: 'rgba(212, 229, 255, 0.9)',
          fontSize: 10,
        },
        itemStyle: {
          shadowBlur: 12,
          shadowColor: 'rgba(44, 146, 255, 0.4)',
        },
        emphasis: {
          itemStyle: {
            borderColor: '#00e4ff',
            borderWidth: 2,
            shadowBlur: 20,
            shadowColor: 'rgba(0, 228, 255, 0.6)',
          },
        },
      },
    ],
    visualMap: {
      min: 0,
      max: maxVal,
      show: false,
      inRange: {
        color: ['#0a2a5a', '#1a5a9a', '#2c92ff', '#00e4ff', '#ffc53d'],
      },
    },
  }

  heatmapChart.setOption(option)
}

function getLoadColor(rate) {
  const r = parseFloat(rate)
  if (r >= 80) return '#ff6b6b'
  if (r >= 60) return '#ffc53d'
  return '#36d7a0'
}

function getLoadText(rate) {
  const r = parseFloat(rate)
  if (r >= 80) return '拥挤'
  if (r >= 60) return '较旺'
  return '舒适'
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (heatmapChart) {
    heatmapChart.dispose()
    heatmapChart = null
  }
})

function handleResize() {
  heatmapChart?.resize()
}
</script>

<template>
  <Transition name="popup-fade">
    <div v-if="scenic && realtimeData" class="scenic-popup-overlay" @click.self="emit('close')">
      <div class="scenic-popup-card">
        <!-- 装饰角 -->
        <div class="corner corner-tl"></div>
        <div class="corner corner-tr"></div>
        <div class="corner corner-bl"></div>
        <div class="corner corner-br"></div>

        <!-- 关闭按钮 -->
        <button class="close-btn" @click="emit('close')">✕</button>

        <!-- 景区图片 -->
        <div class="popup-image">
          <img v-if="scenic.image" :src="scenic.image" :alt="scenic.name" @error="imgError = true" />
          <div v-if="!scenic.image || imgError" class="image-fallback">
            <span class="fallback-icon">🏞️</span>
            <span class="fallback-text">{{ scenic.name }}</span>
          </div>
          <div class="image-overlay"></div>
          <!-- 图片上叠加景区名称 -->
          <div class="image-title-bar">
            <h2 class="scenic-name-overlay">{{ scenic.name }}</h2>
            <span v-if="scenic.level" class="scenic-level-overlay">{{ scenic.level }}</span>
          </div>
        </div>

        <div class="popup-content">
          <!-- 实时数据卡片 -->
          <div class="realtime-cards">
            <div class="rt-card card-entry">
              <div class="rt-card-icon">📥</div>
              <div class="rt-card-info">
                <span class="rt-label">今日累计入园</span>
                <span class="rt-value">{{ realtimeData.todayEntry.toLocaleString() }}</span>
                <span class="rt-unit">人</span>
              </div>
            </div>
            <div class="rt-card card-park">
              <div class="rt-card-icon">👥</div>
              <div class="rt-card-info">
                <span class="rt-label">实时在园人数</span>
                <span class="rt-value">{{ realtimeData.realtimeInPark.toLocaleString() }}</span>
                <span class="rt-unit">人</span>
              </div>
            </div>
            <div class="rt-card card-load">
              <div class="rt-card-icon">📊</div>
              <div class="rt-card-info">
                <span class="rt-label">承载率</span>
                <span class="rt-value" :style="{ color: getLoadColor(realtimeData.loadRate) }">{{ realtimeData.loadRate }}%</span>
                <span class="rt-tag" :style="{ color: getLoadColor(realtimeData.loadRate), borderColor: getLoadColor(realtimeData.loadRate) }">{{ getLoadText(realtimeData.loadRate) }}</span>
              </div>
            </div>
          </div>

          <!-- 热力图区域 -->
          <div class="section-title">
            <span class="section-dot"></span>
            景区热力图
          </div>
          <div class="heatmap-wrapper">
            <div ref="heatmapRef" class="heatmap-chart"></div>
          </div>

          <!-- 分隔线 -->
          <div class="divider"></div>

          <!-- 景区简介 -->
          <div class="section-title">
            <span class="section-dot"></span>
            景区简介
          </div>
          <div class="info-grid">
            <div class="info-item" v-if="scenic.type">
              <span class="info-label">景区类型</span>
              <span class="info-value">{{ scenic.type }}</span>
            </div>
            <div class="info-item" v-if="scenic.city">
              <span class="info-label">所在城市</span>
              <span class="info-value">{{ scenic.city }}</span>
            </div>
            <div class="info-item" v-if="scenic.area">
              <span class="info-label">景区面积</span>
              <span class="info-value">{{ scenic.area }}</span>
            </div>
            <div class="info-item" v-if="scenic.openTime">
              <span class="info-label">开放时间</span>
              <span class="info-value">{{ scenic.openTime }}</span>
            </div>
          </div>
          <p class="desc-text">{{ scenic.description }}</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.scenic-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scenic-popup-card {
  position: relative;
  width: 620px;
  max-width: 92vw;
  max-height: 88vh;
  background: linear-gradient(135deg, rgba(6, 30, 65, 0.97) 0%, rgba(10, 26, 58, 0.97) 100%);
  border: 1px solid $border-main;
  border-radius: 4px;
  padding: 0;
  box-shadow: 0 0 40px rgba(44, 146, 255, 0.25), inset 0 0 30px rgba(44, 146, 255, 0.05);
  overflow: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(44, 146, 255, 0.3);
    border-radius: 2px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

// 图片区域
.popup-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: rgba(6, 30, 65, 0.6);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .image-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(10, 42, 90, 0.8), rgba(6, 30, 65, 0.9));

    .fallback-icon {
      font-size: 48px;
      margin-bottom: 8px;
    }

    .fallback-text {
      font-size: 18px;
      color: rgba(212, 229, 255, 0.5);
      letter-spacing: 2px;
    }
  }

  .image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background: linear-gradient(transparent, rgba(6, 30, 65, 0.97));
  }

  .image-title-bar {
    position: absolute;
    bottom: 12px;
    left: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 1;
  }

  .scenic-name-overlay {
    font-size: 24px;
    font-weight: bold;
    color: #fff;
    margin: 0;
    letter-spacing: 3px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  }

  .scenic-level-overlay {
    padding: 2px 10px;
    background: rgba(255, 197, 61, 0.25);
    border: 1px solid rgba(255, 197, 61, 0.6);
    border-radius: 3px;
    color: $accent-yellow;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 1px;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
  }
}

// 装饰角
.corner {
  position: absolute;
  width: 16px;
  height: 16px;
  z-index: 2;

  &::before, &::after {
    content: '';
    position: absolute;
    background: $accent-cyan;
  }

  &-tl {
    top: 0;
    left: 0;
    &::before { top: 0; left: 0; width: 16px; height: 2px; }
    &::after { top: 0; left: 0; width: 2px; height: 16px; }
  }
  &-tr {
    top: 0;
    right: 0;
    &::before { top: 0; right: 0; width: 16px; height: 2px; }
    &::after { top: 0; right: 0; width: 2px; height: 16px; }
  }
  &-bl {
    bottom: 0;
    left: 0;
    &::before { bottom: 0; left: 0; width: 16px; height: 2px; }
    &::after { bottom: 0; left: 0; width: 2px; height: 16px; }
  }
  &-br {
    bottom: 0;
    right: 0;
    &::before { bottom: 0; right: 0; width: 16px; height: 2px; }
    &::after { bottom: 0; right: 0; width: 2px; height: 16px; }
  }
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 14px;
  width: 28px;
  height: 28px;
  background: rgba(6, 30, 65, 0.7);
  border: 1px solid rgba(44, 146, 255, 0.4);
  border-radius: 4px;
  color: $accent-cyan;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 3;

  &:hover {
    background: rgba(44, 146, 255, 0.3);
    border-color: $accent-cyan;
  }
}

.popup-content {
  padding: 20px 24px 24px;
}

// 实时数据卡片
.realtime-cards {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.rt-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: rgba(6, 30, 65, 0.6);
  border: 1px solid rgba(44, 146, 255, 0.3);
  border-radius: 4px;
  transition: border-color 0.3s;

  &:hover {
    border-color: rgba(44, 146, 255, 0.6);
  }

  .rt-card-icon {
    font-size: 24px;
    flex-shrink: 0;
  }

  .rt-card-info {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 4px;
  }

  .rt-label {
    width: 100%;
    font-size: 11px;
    color: $text-secondary;
    letter-spacing: 0.5px;
  }

  .rt-value {
    font-size: 22px;
    font-weight: bold;
    font-family: 'DIN Alternate', 'Impact', sans-serif;
    color: $accent-cyan;
    line-height: 1.1;
  }

  .rt-unit {
    font-size: 12px;
    color: $text-secondary;
    margin-left: 2px;
  }

  .rt-tag {
    display: inline-block;
    font-size: 11px;
    font-weight: bold;
    padding: 1px 6px;
    border: 1px solid;
    border-radius: 2px;
    margin-left: 4px;
    line-height: 1.4;
  }

  &.card-entry .rt-value { color: #2c92ff; }
  &.card-park .rt-value { color: #00e4ff; }
}

// 区块标题
.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: $accent-cyan;
  font-weight: bold;
  margin-bottom: 10px;
}

.section-dot {
  width: 8px;
  height: 8px;
  background: $accent-cyan;
  border-radius: 50%;
  box-shadow: 0 0 6px $accent-cyan;
  flex-shrink: 0;
}

// 热力图
.heatmap-wrapper {
  width: 100%;
  height: 200px;
  background: rgba(6, 30, 65, 0.4);
  border: 1px solid rgba(44, 146, 255, 0.2);
  border-radius: 4px;
  margin-bottom: 16px;
  overflow: hidden;
}

.heatmap-chart {
  width: 100%;
  height: 100%;
}

// 分隔线
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, $border-main, transparent);
  margin-bottom: 16px;
}

// 信息网格
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 20px;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 11px;
  color: $text-secondary;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 13px;
  color: $text-primary;
  font-weight: 500;
}

// 简介
.desc-text {
  font-size: 13px;
  color: rgba(212, 229, 255, 0.8);
  line-height: 1.8;
  margin: 0;
  text-align: justify;
}

// 过渡动画
.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 0.3s ease;

  .scenic-popup-card {
    transition: transform 0.3s ease;
  }
}

.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;

  .scenic-popup-card {
    transform: scale(0.9);
  }
}
</style>
