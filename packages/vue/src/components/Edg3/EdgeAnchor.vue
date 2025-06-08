<script setup lang="ts">
import { Position } from '@xyflow/system';
import type { CustomSVGAttributes } from '../../types';

interface Props extends CustomSVGAttributes {
  position: Position;
  centerX: number;
  centerY: number;
  radius?: number;
  onMouseDown: (event: MouseEvent) => void;
  onMouseEnter: (event: MouseEvent) => void;
  onMouseOut: (event: MouseEvent) => void;
  type: string;
}

const props = defineProps<Props>();

const EdgeUpdaterClassName = 'react-flow__edgeupdater';

const shiftX = (x: number, shift: number, position: Position): number => {
  if (position === Position.Left) return x - shift;
  if (position === Position.Right) return x + shift;
  return x;
};

const shiftY = (y: number, shift: number, position: Position): number => {
  if (position === Position.Top) return y - shift;
  if (position === Position.Bottom) return y + shift;
  return y;
};

const classes = computed(() => [EdgeUpdaterClassName, `${EdgeUpdaterClassName}-${props.type}`]);

const cx = computed(() => shiftX(props.centerX, props.radius || 10, props.position));
const cy = computed(() => shiftY(props.centerY, props.radius || 10, props.position));
</script>

<template>
  <circle
    @mousedown="props.onMouseDown"
    @mouseenter="props.onMouseEnter"
    @mouseout="props.onMouseOut"
    :class="classes"
    :cx="cx"
    :cy="cy"
    :r="props.radius || 10"
    stroke="transparent"
    fill="transparent"
  />
</template>
