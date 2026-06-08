<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { formatBigNumber } from '../utils/format.js'

const props = defineProps({
  summaryData: {
    type: Object,
    default: () => ({}),
  },
})

const displayYearFlow = ref(0)
const displayMonthFlow = ref(0)
const displayTodayFlow = ref(0)

let animFrame = null

function animateNumber(displayRef, target, duration = 4000) {
  const start = displayRef.value
  const diff = target - start
  const startTime = performance.now()

  function step(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    // easeOutCubic — 更平缓的曲线
    const eased = 1 - Math.pow(1 - progress, 3)
    displayRef.value = Math.round(start + diff * eased)
    if (progress < 1) {
      animFrame = requestAnimationFrame(step)
    }
  }

  animFrame = requestAnimationFrame(step)
}

watch(() => props.summaryData, (newVal) => {
  if (newVal) {
    animateNumber(displayYearFlow, newVal.yearFlow || 0)
    animateNumber(displayMonthFlow, newVal.monthFlow || 0)
    animateNumber(displayTodayFlow, newVal.todayFlow || 0)
  }
}, { immediate: true, deep: true })

const formattedYearFlow = computed(() => formatBigNumber(displayYearFlow.value))
const formattedMonthFlow = computed(() => formatBigNumber(displayMonthFlow.value))
const formattedTodayFlow = computed(() => formatBigNumber(displayTodayFlow.value))
</script>

<template>
  <div class="flow-summary">
    <div class="summary-item">
      <div class="summary-label">年累计客流</div>
      <div class="summary-value cyan">{{ formattedYearFlow }}</div>
    </div>
    <div class="summary-divider"></div>
    <div class="summary-item">
      <div class="summary-label">月累计客流</div>
      <div class="summary-value blue">{{ formattedMonthFlow }}</div>
    </div>
    <div class="summary-divider"></div>
    <div class="summary-item">
      <div class="summary-label">今日累计客流</div>
      <div class="summary-value yellow">{{ formattedTodayFlow }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.flow-summary {
  @include panel-box;
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  padding: 14px 20px;
}

.summary-item {
  text-align: center;
  flex: 1;
}

.summary-label {
  font-size: $font-size-xs;
  color: $text-secondary;
  margin-bottom: 6px;
}

.summary-value {
  font-size: $font-size-md;
  font-weight: bold;
  font-family: 'DIN Alternate', 'Impact', sans-serif;
  letter-spacing: 2px;
  white-space: nowrap;

  &.cyan { color: $accent-cyan; }
  &.blue { color: $accent-blue; }
  &.yellow { color: $accent-yellow; }
}

.summary-divider {
  width: 1px;
  height: 50px;
  background: linear-gradient(180deg, transparent, $border-main, transparent);
  margin: 4px 8px 0;
}
</style>
