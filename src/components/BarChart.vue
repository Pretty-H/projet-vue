<!-- src/components/BarChart.vue -->
<template>
  <Bar :data="data" :options="options" />
</template>

<script setup>
import { Bar } from 'vue-chartjs'

defineProps({
  data: Object,
  options: Object
})
</script>
