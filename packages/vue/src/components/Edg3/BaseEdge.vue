<script setup lang="ts">
import { isNumeric } from '@xyflow/system';
import { computed } from 'vue';
import EdgeText from './EdgeText.vue';
import type { BaseEdgeProps } from '../../types';

const props = defineProps<BaseEdgeProps>();

const pathClasses = computed(() => ({
  'vue-flow__edge-path': true,
  [props.className || '']: !!props.className,
}));
</script>

<template>
  <g>
    <path v-bind="props" :d="path" fill="none" :class="pathClasses" />
    <path
      v-if="interactionWidth"
      :d="path"
      fill="none"
      stroke-opacity="0"
      :stroke-width="interactionWidth"
      class="vue-flow__edge-interaction"
    />
    <EdgeText
      v-if="label && isNumeric(labelX) && isNumeric(labelY)"
      :x="labelX"
      :y="labelY"
      :label="label"
      :label-style="labelStyle"
      :label-show-bg="labelShowBg"
      :label-bg-style="labelBgStyle"
      :label-bg-padding="labelBgPadding"
      :label-bg-border-radius="labelBgBorderRadius"
    />
  </g>
</template>
