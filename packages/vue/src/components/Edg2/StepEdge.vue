<script setup lang="ts">
import { computed } from 'vue';
import SmoothStepEdge from './SmoothStepEdge.vue';
import type { StepEdgeProps } from '../../types';

interface Props extends /* @vue-ignore */ StepEdgeProps {
  isInternal?: boolean;
}

const props = defineProps<Props>();

const pathOptions = computed(() => ({
  borderRadius: 0,
  offset: props.pathOptions?.offset,
}));
</script>

<template>
  <SmoothStepEdge v-bind="$props" :id="props.isInternal ? undefined : props.id" :path-options="pathOptions" />
</template>
