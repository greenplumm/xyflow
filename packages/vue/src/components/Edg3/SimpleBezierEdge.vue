<script setup lang="ts">
import { Position, getBezierEdgeCenter } from '@xyflow/system';
import BaseEdge from './BaseEdge.vue';
import type { SimpleBezierEdgeProps } from '../../types';

const props = defineProps<SimpleBezierEdgeProps>();

const [path, labelX, labelY] = getSimpleBezierPath({
  sourceX: props.sourceX,
  sourceY: props.sourceY,
  sourcePosition: props.sourcePosition || Position.Bottom,
  targetX: props.targetX,
  targetY: props.targetY,
  targetPosition: props.targetPosition || Position.Top,
});

const _id = props.id;
</script>

<template>
  <BaseEdge
    :id="_id"
    :path="path"
    :labelX="labelX"
    :labelY="labelY"
    :label="props.label"
    :labelStyle="props.labelStyle"
    :labelShowBg="props.labelShowBg"
    :labelBgStyle="props.labelBgStyle"
    :labelBgPadding="props.labelBgPadding"
    :labelBgBorderRadius="props.labelBgBorderRadius"
    :style="props.style"
    :markerEnd="props.markerEnd"
    :markerStart="props.markerStart"
    :interactionWidth="props.interactionWidth"
  />
</template>
