<script lang="ts">
import { computed, defineComponent } from 'vue';
import { Position, getSmoothStepPath } from '@xyflow/system';
import BaseEdge from './BaseEdge.vue';
import type { BezierEdgeProps } from '../../types';

export const SmoothStepEdgeInternal = defineComponent({
  props: {
    id: String,
    sourceX: Number,
    sourceY: Number,
    targetX: Number,
    targetY: Number,
    sourcePosition: String,
    targetPosition: String,
    label: String,
    labelStyle: Object,
    labelShowBg: Boolean,
    labelBgStyle: Object,
    labelBgPadding: Number,
    labelBgBorderRadius: Number,
    style: Object,
    markerEnd: String,
    markerStart: String,
    interactionWidth: Number,
    pathOptions: Object,
  },
  setup(props: BezierEdgeProps) {
    const path = computed(() => {
      const [path] = getSmoothStepPath({
        sourceX: props.sourceX,
        sourceY: props.sourceY,
        sourcePosition: props.sourcePosition || Position.Bottom,
        targetX: props.targetX,
        targetY: props.targetY,
        targetPosition: props.targetPosition || Position.Top,
        borderRadius: props.pathOptions?.borderRadius,
      });
      return path;
    });

    return { path };
  },
});

const SmoothStepEdge = defineComponent({
  props: {
    sourceX: Number,
    sourceY: Number,
    targetX: Number,
    targetY: Number,
    sourcePosition: String,
    targetPosition: String,
    label: String,
    labelStyle: Object,
    labelShowBg: Boolean,
    labelBgStyle: Object,
    labelBgPadding: Number,
    labelBgBorderRadius: Number,
    style: Object,
    markerEnd: String,
    markerStart: String,
    interactionWidth: Number,
    pathOptions: Object,
  },
  setup(props: BezierEdgeProps) {
    const path = computed(() => {
      const [path] = getSmoothStepPath({
        sourceX: props.sourceX,
        sourceY: props.sourceY,
        sourcePosition: props.sourcePosition || Position.Bottom,
        targetX: props.targetX,
        targetY: props.targetY,
        targetPosition: props.targetPosition || Position.Top,
        borderRadius: props.pathOptions?.borderRadius,
      });
      return path;
    });

    return { path };
  },
});

export default SmoothStepEdge;
</script>

<template>
  <BaseEdge
    :path="path"
    :label="props.label"
    :label-style="props.labelStyle"
    :label-show-bg="props.labelShowBg"
    :label-bg-style="props.labelBgStyle"
    :label-bg-padding="props.labelBgPadding"
    :label-bg-border-radius="props.labelBgBorderRadius"
    :style="props.style"
    :marker-end="props.markerEnd"
    :marker-start="props.markerStart"
    :interaction-width="props.interactionWidth"
  />
</template>
