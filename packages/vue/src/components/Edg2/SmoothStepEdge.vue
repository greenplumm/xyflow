<script setup lang="ts">
import { computed } from 'vue';
import BaseEdge from './BaseEdge.vue';
import { getSmoothStepPath } from '@xyflow/system';

defineProps<{
  startPoint: [number, number];
  endPoint: [number, number];
  borderRadius?: number;
  markerEnd?: string;
  markerStart?: string;
  interactionWidth?: number;
}>();

const path = computed(() => {
  const [path] = getSmoothStepPath({
    sourceX: startPoint[0],
    sourceY: startPoint[1],
    targetX: endPoint[0],
    targetY: endPoint[1],
    borderRadius,
  });
  return path;
});
</script>

<template>
  <BaseEdge :path="path" :marker-end="markerEnd" :marker-start="markerStart" :interaction-width="interactionWidth" />
</template>
