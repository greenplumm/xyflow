<script setup lang="ts">
import { computed } from 'vue';
import SmoothStepEdge from './SmoothStepEdge.vue';
import type { StepEdgeProps } from '../../types';

const props = defineProps<StepEdgeProps>();

const pathOptions = computed(() => ({
  borderRadius: 0,
  offset: props.pathOptions?.offset,
}));
</script>

<template>
  <SmoothStepEdge v-bind="props" :path-options="pathOptions" />
</template>
