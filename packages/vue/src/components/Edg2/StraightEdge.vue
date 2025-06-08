<script setup lang="ts">
import { computed } from 'vue';
import BaseEdge from './BaseEdge.vue';
import { getStraightPath } from '@xyflow/system';

defineProps<{
  startPoint: [number, number];
  endPoint: [number, number];
  markerEnd?: string;
  markerStart?: string;
  interactionWidth?: number;
}>();

const path = computed(() => {
  const [path] = getStraightPath({
    sourceX: startPoint[0],
    sourceY: startPoint[1],
    targetX: endPoint[0],
    targetY: endPoint[1],
  });
  return path;
});
</script>

<template>
  <BaseEdge :path="path" :marker-end="markerEnd" :marker-start="markerStart" :interaction-width="interactionWidth" />
</template>
