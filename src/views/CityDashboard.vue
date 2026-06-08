<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import HeaderTitle from '../components/HeaderTitle.vue'
import LeftPanel from '../components/LeftPanel.vue'
import CenterMap from '../components/CenterMap.vue'
import RightPanel from '../components/RightPanel.vue'
import SummaryBar from '../components/SummaryBar.vue'
import ScenicDetailPopup from '../components/ScenicDetailPopup.vue'
import { generateCityDashboardData, getCityInfo, keyScenicSpots } from '../data/mock.js'

const route = useRoute()
const cityCode = computed(() => route.params.code)
const cityInfo = computed(() => getCityInfo(cityCode.value))
const cityTitle = computed(() => cityInfo.value ? `${cityInfo.value.name}文旅数据大屏` : '市州文旅数据大屏')

const dashboardData = ref(generateCityDashboardData(cityCode.value))

// 当前市州的重点景区（按城市名筛选）
const cityScenicSpots = computed(() => {
  if (!cityInfo.value) return []
  return keyScenicSpots.filter(s => s.city === cityInfo.value.name)
})

const selectedScenic = ref(null)

function onScenicClick(spot) {
  selectedScenic.value = spot
}

function closeScenicPopup() {
  selectedScenic.value = null
}

let refreshTimer = null

function refreshData() {
  const data = generateCityDashboardData(cityCode.value)
  if (data) {
    dashboardData.value = data
  }
}

watch(cityCode, (newCode) => {
  const data = generateCityDashboardData(newCode)
  if (data) {
    dashboardData.value = data
  }
})

onMounted(() => {
  refreshTimer = setInterval(refreshData, 5000)
})

onUnmounted(() => {
  clearInterval(refreshTimer)
})
</script>

<template>
  <div class="dashboard" v-if="dashboardData">
    <HeaderTitle :title="cityTitle" :showBack="true" />
    <div class="dashboard-body">
      <LeftPanel
        class="panel-left"
        :cityFlow="dashboardData.districtFlow"
        :scenicRank="dashboardData.scenicRank"
        :summary="dashboardData.summary"
        :isCity="true"
      />
      <div class="panel-center">
        <CenterMap
          :cityCode="cityCode"
          :cityName="dashboardData.cityName"
          :districtFlowData="dashboardData.districtFlow"
          :scenicSpots="cityScenicSpots"
          @scenic-click="onScenicClick"
        />
        <SummaryBar :data="dashboardData.summary" />
      </div>
      <RightPanel
        class="panel-right"
        :flowTrend="dashboardData.flowTrend"
        :consum="dashboardData.consum"
      />
    </div>
    <ScenicDetailPopup :scenic="selectedScenic" @close="closeScenicPopup" />
  </div>
  <div v-else class="not-found">
    <p>未找到该市州数据</p>
    <router-link to="/">返回省级大屏</router-link>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.dashboard {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $bg-primary;
  overflow: hidden;
}

.dashboard-body {
  flex: 1;
  display: flex;
  gap: $gap-md;
  padding: 0 $gap-lg $gap-md;
  min-height: 0;
}

.panel-left {
  width: 25%;
  min-width: 0;
}

.panel-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $gap-md;
  min-width: 0;
}

.panel-right {
  width: 25%;
  min-width: 0;
}

.not-found {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: $bg-primary;
  color: $text-primary;

  p {
    font-size: $font-size-xl;
    margin-bottom: $gap-lg;
  }

  a {
    color: $accent-cyan;
    font-size: $font-size-md;
  }
}
</style>
