<script setup lang="ts">
import { getStraightPath } from '@xyflow/system';
import BaseEdge from './BaseEdge.vue';
import type { StraightEdgeProps } from '../../types';

const props = defineProps<StraightEdgeProps>();

const [path, labelX, labelY] = getStraightPath({
  sourceX: props.sourceX,
  sourceY: props.sourceY,
  targetX: props.targetX,
  targetY: props.targetY,
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
