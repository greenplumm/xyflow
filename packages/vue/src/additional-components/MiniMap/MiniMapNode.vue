<script setup lang="ts">
import { defineProps } from 'vue';
import cc from 'classcat';

defineProps<{
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style?: Record<string, any>;
  color?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
  borderRadius?: number;
  shapeRendering?: string;
  selected?: boolean;
}>();

const emit = defineEmits(['click']);

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<template>
  <rect
    :class="cc(['vue-flow__minimap-node', { selected }, className])"
    :x="x"
    :y="y"
    :rx="borderRadius"
    :ry="borderRadius"
    :width="width"
    :height="height"
    :style="{
      fill: color || style?.background || style?.backgroundColor,
      stroke: strokeColor,
      strokeWidth,
    }"
    :shape-rendering="shapeRendering"
    @click="handleClick"
  />
</template>
