<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';

defineProps<{
  position: [number, number];
  radius?: number;
  stroke?: string;
  strokeWidth?: number;
  style?: CSSProperties;
  className?: string;
}>();

const cx = computed(() => props.position[0]);
const cy = computed(() => props.position[1]);
</script>

<template>
  <circle
    :cx="cx"
    :cy="cy"
    :r="radius"
    :stroke="stroke"
    :stroke-width="strokeWidth"
    :class="['vue-flow__edgeupdater', className]"
    :style="style"
  />
</template>
