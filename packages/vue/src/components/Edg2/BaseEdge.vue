<script setup lang="ts">
import type { CSSProperties } from 'vue';

defineProps<{
  path: string;
  labelX?: number;
  labelY?: number;
  label?: string;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  markerEnd?: string;
  markerStart?: string;
  interactionWidth?: number;
}>();
</script>

<template>
  <g>
    <path
      class="vue-flow__edge-path"
      :d="path"
      :marker-end="markerEnd"
      :marker-start="markerStart"
      :style="{ strokeWidth: interactionWidth }"
    />
    <EdgeText
      v-if="label"
      :x="labelX"
      :y="labelY"
      :label="label"
      :label-style="labelStyle"
      :label-show-bg="labelShowBg"
      :label-bg-style="labelBgStyle"
    />
  </g>
</template>

<style>
.vue-flow__edge-path {
  fill: none;
  stroke: #b1b1b7;
  stroke-width: 2;
}
</style>
