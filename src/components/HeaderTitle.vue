<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  title: { type: String, default: '贵州省旅游数智互联平台暨旅游驾驶舱' },
  showBack: { type: Boolean, default: false },
})

const router = useRouter()
const currentTime = ref('')
const currentDate = ref('')
let timer = null

function updateTime() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const weekDay = weekDays[now.getDay()]

  currentDate.value = `${year}年${month}月${day}日 ${weekDay}`
  currentTime.value = `${hours}:${minutes}:${seconds}`
}

function goBack() {
  router.push('/')
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="header-title">
    <div class="header-left">
      <button v-if="showBack" class="back-btn" @click="goBack">
        <span class="back-arrow">◀</span> 返回省级
      </button>
      <span v-else class="date-text">{{ currentDate }}</span>
    </div>
    <div class="header-center">
      <h1 class="title gradient-text">{{ title }}</h1>
      <div class="title-decoration"></div>
    </div>
    <div class="header-right">
      <span class="time-text">{{ currentTime }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.header-title {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $gap-lg;
  background: linear-gradient(180deg, rgba(6, 30, 65, 0.95) 0%, rgba(6, 30, 65, 0.4) 80%, transparent 100%);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10%;
    width: 80%;
    height: 1px;
    background: linear-gradient(90deg, transparent, $accent-cyan, transparent);
  }
}

.header-left, .header-right {
  width: 280px;
}

.header-left {
  text-align: left;
}

.header-right {
  text-align: right;
}

.date-text, .time-text {
  color: $text-secondary;
  font-size: $font-size-sm;
}

.time-text {
  font-size: $font-size-lg;
  color: $accent-cyan;
  font-family: 'DIN Alternate', 'Impact', sans-serif;
  letter-spacing: 2px;
}

.header-center {
  text-align: center;
  position: relative;
}

.title {
  font-size: $font-size-xl;
  font-weight: bold;
  letter-spacing: 8px;
  margin: 0;
  line-height: 1.2;
}

.title-decoration {
  width: 300px;
  height: 6px;
  margin: 4px auto 0;
  background: linear-gradient(90deg, transparent, $accent-blue, $accent-cyan, $accent-blue, transparent);
  border-radius: 3px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(44, 146, 255, 0.15);
  border: 1px solid rgba(44, 146, 255, 0.4);
  color: $accent-cyan;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: $font-size-sm;
  font-family: $font-family;
  transition: all 0.3s;

  &:hover {
    background: rgba(44, 146, 255, 0.3);
    border-color: $accent-cyan;
  }
}

.back-arrow {
  font-size: 10px;
}
</style>
