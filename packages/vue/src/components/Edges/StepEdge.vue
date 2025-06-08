<script lang="ts">
import { computed, defineComponent } from 'vue';
import SmoothStepEdge from './SmoothStepEdge.vue';
import type { StepEdgeProps } from '../../types';

export const StepEdgeInternal = defineComponent({
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
    isInternal: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const pathOptions = computed(() => ({
      borderRadius: 0,
      offset: props.pathOptions?.offset,
    }));

    return { pathOptions };
  },
});

const StepEdge = defineComponent({
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
  setup(props) {
    const pathOptions = computed(() => ({
      borderRadius: 0,
      offset: props.pathOptions?.offset,
    }));

    return { pathOptions };
  },
});

export default StepEdge;
</script>

<template>
  <SmoothStepEdge v-bind="$props" :id="props.isInternal ? undefined : props.id" :path-options="pathOptions" />
</template>
