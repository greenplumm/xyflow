<script lang="ts">
import { computed, defineComponent } from 'vue';
import { getStraightPath } from '@xyflow/system';
import BaseEdge from './BaseEdge.vue';
import type { BezierEdgeProps } from '../../types';

export const StraightEdgeInternal = defineComponent({
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
    isInternal: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const path = computed(() => {
      const [path] = getStraightPath({
        sourceX: props.sourceX,
        sourceY: props.sourceY,
        targetX: props.targetX,
        targetY: props.targetY,
      });
      return path;
    });

    return { path };
  },
});

const StraightEdge = defineComponent({
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
  },
  setup(props) {
    const path = computed(() => {
      const [path] = getStraightPath({
        sourceX: props.sourceX,
        sourceY: props.sourceY,
        targetX: props.targetX,
        targetY: props.targetY,
      });
      return path;
    });

    return { path };
  },
});

export default StraightEdge;
</script>

<template>
  <BaseEdge
    v-bind="$props"
    :id="props.isInternal ? undefined : props.id"
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
