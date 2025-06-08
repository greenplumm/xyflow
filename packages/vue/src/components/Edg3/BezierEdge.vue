<script setup lang="ts">
import { Position, getBezierPath } from '@xyflow/system';
import BaseEdge from './BaseEdge.vue';
import type { BezierEdgeProps } from '../../types';

const props = defineProps<BezierEdgeProps>();

const [path, labelX, labelY] = getBezierPath({
  sourceX: props.sourceX,
  sourceY: props.sourceY,
  sourcePosition: props.sourcePosition || Position.Bottom,
  targetX: props.targetX,
  targetY: props.targetY,
  targetPosition: props.targetPosition || Position.Top,
  curvature: props.pathOptions?.curvature,
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
