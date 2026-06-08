<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { formatThousand } from '../utils/format.js'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

// 自动滚动
const listRef = ref(null)
let scrollTimer = null

function startAutoScroll() {
  stopAutoScroll()
  scrollTimer = setInterval(() => {
    if (!listRef.value) return
    const el = listRef.value
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
      el.scrollTop = 0
    } else {
      el.scrollTop += 1
    }
  }, 50)
}

function stopAutoScroll() {
  clearInterval(scrollTimer)
}

watch(() => props.data, () => {
  startAutoScroll()
}, { immediate: true })

function getRankClass(index) {
  if (index === 0) return 'rank-1'
  if (index === 1) return 'rank-2'
  if (index === 2) return 'rank-3'
  return ''
}

function getYoyClass(yoy) {
  return parseFloat(yoy) >= 0 ? 'up' : 'down'
}

function getYoyText(yoy) {
  const val = parseFloat(yoy)
  const pct = Math.abs(val * 100).toFixed(1)
  return val >= 0 ? `↑${pct}%` : `↓${pct}%`
}

function getCapacityPercent(flow, capacity) {
  return Math.min(100, (flow / capacity * 100)).toFixed(0)
}

function getCapacityColor(flow, capacity) {
  const pct = flow / capacity
  if (pct > 0.9) return '#ff6b6b'
  if (pct > 0.7) return '#ffc53d'
  return '#36d7a0'
}
</script>

<template>
  <div class="scenic-rank-list">
    <div class="panel-title">热门景区排行</div>
    <div class="list-header">
      <span class="col-rank">排名</span>
      <span class="col-name">景区名称</span>
      <span class="col-flow">客流</span>
      <span class="col-yoy">同比</span>
    </div>
    <div ref="listRef" class="list-body">
      <div
        v-for="(item, index) in data"
        :key="item.name"
        class="list-item"
        @mouseenter="stopAutoScroll"
        @mouseleave="startAutoScroll"
      >
        <span class="col-rank" :class="getRankClass(index)">{{ index + 1 }}</span>
        <span class="col-name" :title="item.name">{{ item.name }}</span>
        <span class="col-flow">{{ formatThousand(item.todayFlow) }}</span>
        <span class="col-yoy" :class="getYoyClass(item.yoy)">{{ getYoyText(item.yoy) }}</span>
        <div class="capacity-bar">
          <div
            class="capacity-fill"
            :style="{
              width: getCapacityPercent(item.todayFlow, item.capacity) + '%',
              backgroundColor: getCapacityColor(item.todayFlow, item.capacity),
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.scenic-rank-list {
  flex: 1;
  min-height: 0;
  @include panel-box;
  display: flex;
  flex-direction: column;
}

.list-header {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  color: $text-secondary;
  font-size: $font-size-xs;
  border-bottom: 1px solid rgba(44, 146, 255, 0.2);
  margin-bottom: 4px;
}

.list-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 7px 8px;
  font-size: $font-size-xs;
  transition: background 0.2s;
  position: relative;

  &:hover {
    background: rgba(44, 146, 255, 0.1);
  }

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 8px;
    right: 8px;
    height: 1px;
    background: rgba(44, 146, 255, 0.08);
  }
}

.col-rank {
  width: 28px;
  text-align: center;
  font-weight: bold;
  color: $text-secondary;

  &.rank-1 {
    color: #ff6b6b;
    font-size: 14px;
  }
  &.rank-2 {
    color: #ffc53d;
    font-size: 13px;
  }
  &.rank-3 {
    color: #00e4ff;
    font-size: 13px;
  }
}

.col-name {
  flex: 1;
  color: $text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-flow {
  width: 60px;
  text-align: right;
  color: $accent-cyan;
  font-family: 'DIN Alternate', 'Impact', sans-serif;
}

.col-yoy {
  width: 58px;
  text-align: right;
  font-family: 'DIN Alternate', 'Impact', sans-serif;

  &.up { color: #36d7a0; }
  &.down { color: #ff6b6b; }
}

.capacity-bar {
  position: absolute;
  bottom: 1px;
  left: 36px;
  right: 8px;
  height: 2px;
  background: rgba(44, 146, 255, 0.1);
  border-radius: 1px;
}

.capacity-fill {
  height: 100%;
  border-radius: 1px;
  transition: width 0.5s ease;
}
</style>
