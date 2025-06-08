<script setup lang="ts">
import { MarkerType, type MarkerProps } from '@xyflow/system';

const props = withDefaults(
  defineProps<{
      id: MarkerProps['id'];
      type: MarkerProps['type'];
      width?: MarkerProps['width'];
      height?: MarkerProps['height'];
      color?: MarkerProps['color'];
      strokeWidth?: MarkerProps['strokeWidth'];
      markerUnits?: MarkerProps['markerUnits'];
      orient?: MarkerProps['orient'];
    }>(),
  {
    width: 12.5,
    height: 12.5,
    markerUnits: 'strokeWidth',
    orient: 'auto-start-reverse',
    color: '#b1b1b7',
    strokeWidth: 1,
  }
);
</script>

<template>
  <marker
    class="xyflow__arrowhead"
    :id="id"
    :markerWidth="width"
    :markerHeight="height"
    viewBox="-10 -10 20 20"
    :markerUnits="markerUnits"
    :orient="orient"
    refX="0"
    refY="0"
  >
    <polyline
      v-if="type === MarkerType.Arrow"
      :stroke="color"
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-width="strokeWidth"
      fill="none"
      points="-5,-4 0,0 -5,4"
    />
    <polyline
      v-else-if="type === MarkerType.ArrowClosed"
      :stroke="color"
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-width="strokeWidth"
      :fill="color"
      points="-5,-4 0,0 -5,4 -5,-4"
    />
  </marker>
</template>
