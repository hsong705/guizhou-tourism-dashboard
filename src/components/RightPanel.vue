<script setup>
import FlowTrendChart from './FlowTrendChart.vue'
import ConsumStats from './ConsumStats.vue'
import ConsumTypeChart from './ConsumTypeChart.vue'
import { generateFlowTrendData, generateConsumData } from '../data/mock.js'

const props = defineProps({
  flowTrend: { type: Object, default: () => generateFlowTrendData() },
  consum: { type: Object, default: () => generateConsumData() },
})
</script>

<template>
  <div class="right-panel">
    <FlowTrendChart :data="flowTrend" />
    <ConsumStats :data="consum" />
    <ConsumTypeChart :data="consum.typeData" />
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.right-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: $gap-md;
}
</style>
