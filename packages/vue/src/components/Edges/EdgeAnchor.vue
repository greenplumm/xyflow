<script setup lang="ts">
import { computed } from 'vue';
import { Position } from '@xyflow/system';

defineProps<{
  position: Position;
  centerX: number;
  centerY: number;
  radius?: number;
}>();

const path = computed(() => {
  return `M ${props.centerX} ${props.centerY} L ${props.centerX} ${props.centerY}`;
});
</script>

<template>
  <path :d="path" fill="none" stroke="transparent" stroke-width="10" class="vue-flow__edge-anchor" />
</template>

<style>
.vue-flow__edge-anchor {
  pointer-events: stroke;
}
</style>
