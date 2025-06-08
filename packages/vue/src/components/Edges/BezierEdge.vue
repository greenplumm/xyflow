<script lang="ts" setup>
import { computed, defineComponent, reactive } from 'vue';
import { Position, getBezierPath } from '@xyflow/system';
import BaseEdge from './BaseEdge.vue';
import type { BezierEdgeProps } from '../../types';

const useBezierPath = (props: BezierEdgeProps) => {
  return computed(() => {
    const [path, labelX, labelY] = getBezierPath({
      sourceX: props.sourceX,
      sourceY: props.sourceY,
      sourcePosition: props.sourcePosition || Position.Bottom,
      targetX: props.targetX,
      targetY: props.targetY,
      targetPosition: props.targetPosition || Position.Top,
      curvature: props.pathOptions?.curvature,
    });
    return { path, labelX, labelY };
  });
};
const props = defineProps<BezierEdgeProps>();
const pathData = useBezierPath(props);
</script>

<template>
  <BaseEdge
    :id="$props.id ? undefined : undefined"
    :path="pathData.path"
    :labelX="pathData.labelX"
    :labelY="pathData.labelY"
    :label="$props.label"
    :labelStyle="$props.labelStyle"
    :labelShowBg="$props.labelShowBg"
    :labelBgStyle="$props.labelBgStyle"
    :labelBgPadding="$props.labelBgPadding"
    :labelBgBorderRadius="$props.labelBgBorderRadius"
    :style="$props.style"
    :markerEnd="$props.markerEnd"
    :markerStart="$props.markerStart"
    :interactionWidth="$props.interactionWidth"
  />
</template>
