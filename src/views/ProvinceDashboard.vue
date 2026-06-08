<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import HeaderTitle from '../components/HeaderTitle.vue'
import LeftPanel from '../components/LeftPanel.vue'
import CenterMap from '../components/CenterMap.vue'
import RightPanel from '../components/RightPanel.vue'
import SummaryBar from '../components/SummaryBar.vue'
import ScenicDetailPopup from '../components/ScenicDetailPopup.vue'
import { generateDashboardData, keyScenicSpots } from '../data/mock.js'

const dashboardData = ref(generateDashboardData())
const selectedScenic = ref(null)

function onScenicClick(spot) {
  selectedScenic.value = spot
}

function closeScenicPopup() {
  selectedScenic.value = null
}

let refreshTimer = null

function refreshData() {
  dashboardData.value = generateDashboardData()
}

onMounted(() => {
  refreshTimer = setInterval(refreshData, 5000)
})

onUnmounted(() => {
  clearInterval(refreshTimer)
})
</script>

<template>
  <div class="dashboard">
    <HeaderTitle title="贵州省旅游数智互联平台暨旅游驾驶舱" />
    <div class="dashboard-body">
      <LeftPanel
        class="panel-left"
        :cityFlow="dashboardData.cityFlow"
        :scenicRank="dashboardData.scenicRank"
        :summary="dashboardData.summary"
      />
      <div class="panel-center">
        <CenterMap :cityFlowData="dashboardData.cityFlow" :scenicSpots="keyScenicSpots" @scenic-click="onScenicClick" />
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
</style>
