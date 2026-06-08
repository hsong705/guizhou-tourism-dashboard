<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { formatBigNumber, formatMoney } from '../utils/format.js'
import { generateSummaryData } from '../data/mock.js'

const props = defineProps({
  data: {
    type: Object,
    default: () => generateSummaryData(),
  },
})

const displayValues = ref({
  todayFlow: 0,
  scenicCount: 0,
  totalConsum: 0,
  perCapita: 0,
})

let animFrames = []

function animateValue(key, target, duration = 1200) {
  const start = displayValues.value[key]
  const diff = target - start
  const startTime = performance.now()

  function step(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
    displayValues.value[key] = key === 'perCapita'
      ? Math.round((start + diff * eased) * 100) / 100
      : Math.round(start + diff * eased)
    if (progress < 1) {
      animFrames.push(requestAnimationFrame(step))
    }
  }
  animFrames.push(requestAnimationFrame(step))
}

watch(() => props.data, (newVal) => {
  if (newVal) {
    animateValue('todayFlow', newVal.todayFlow || 0)
    animateValue('scenicCount', newVal.scenicCount || 0)
    animateValue('totalConsum', newVal.totalConsum || 0)
    animateValue('perCapita', newVal.perCapita || 0)
  }
}, { immediate: true, deep: true })

const summaryItems = computed(() => [
  {
    label: '今日总客流',
    value: formatBigNumber(displayValues.value.todayFlow),
    icon: '👥',
    color: '#00e4ff',
  },
  {
    label: '在线景区数',
    value: displayValues.value.scenicCount.toLocaleString(),
    icon: '🏔️',
    color: '#2c92ff',
  },
  {
    label: '旅游总收入',
    value: formatMoney(displayValues.value.totalConsum),
    icon: '💰',
    color: '#ffc53d',
  },
  {
    label: '人均消费',
    value: '¥' + displayValues.value.perCapita.toFixed(0),
    icon: '💳',
    color: '#36d7a0',
  },
])
</script>

<template>
  <div class="summary-bar">
    <div
      v-for="(item, index) in summaryItems"
      :key="index"
      class="summary-card"
    >
      <div class="card-icon" :style="{ color: item.color }">{{ item.icon }}</div>
      <div class="card-info">
        <div class="card-label">{{ item.label }}</div>
        <div class="card-value" :style="{ color: item.color }">{{ item.value }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.summary-bar {
  height: 80px;
  display: flex;
  gap: $gap-md;
  flex-shrink: 0;
}

.summary-card {
  flex: 1;
  @include panel-box;
  display: flex;
  align-items: flex-start;
  padding: 10px 16px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
}

.card-icon {
  font-size: 24px;
  margin-right: 10px;
  margin-top: 2px;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-label {
  font-size: $font-size-xs;
  color: $text-secondary;
  margin-bottom: 4px;
}

.card-value {
  font-size: $font-size-md;
  font-weight: bold;
  font-family: 'DIN Alternate', 'Impact', sans-serif;
  letter-spacing: 2px;
  white-space: nowrap;
}
</style>
