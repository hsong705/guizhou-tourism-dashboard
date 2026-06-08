<script setup>
import { computed } from 'vue'
import FlowSummary from './FlowSummary.vue'
import CityRankChart from './CityRankChart.vue'
import ScenicRankList from './ScenicRankList.vue'
import { generateCityFlowData, generateScenicRankData, generateSummaryData } from '../data/mock.js'

const props = defineProps({
  cityFlow: { type: Array, default: () => generateCityFlowData() },
  scenicRank: { type: Array, default: () => generateScenicRankData() },
  summary: { type: Object, default: () => generateSummaryData() },
  isCity: { type: Boolean, default: false },
})

const rankTitle = computed(() => props.isCity ? '各区县客流量排名' : '各市州客流量排名')
</script>

<template>
  <div class="left-panel">
    <FlowSummary :summaryData="summary" />
    <CityRankChart :data="cityFlow" :title="rankTitle" />
    <ScenicRankList :data="scenicRank" />
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.left-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: $gap-md;
}
</style>
