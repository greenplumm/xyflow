<script setup lang="ts">
import type { CSSProperties } from 'vue';

defineProps<{
  x: number;
  y: number;
  label?: string | object;
  style?: CSSProperties;
  className?: string;
}>();
</script>

<template>
  <foreignObject :width="1" :height="1" :x="x" :y="y" :class="['vue-flow__edgelabel', className]" :style="style">
    <div class="vue-flow__edgelabel-renderer">
      {{ label }}
    </div>
  </foreignObject>
</template>
