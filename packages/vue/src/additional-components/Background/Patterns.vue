<template>
  <path
    v-if="type === 'line'"
    :stroke-width="lineWidth"
    :d="`M${dimensions[0] / 2} 0 V${dimensions[1]} M0 ${dimensions[1] / 2} H${dimensions[0]}`"
    :class="cc(['vue-flow__background-pattern', variant, className])"
  />
  <circle
    v-else="type === 'dot'"
    :cx="radius"
    :cy="radius"
    :r="radius"
    :class="cc(['vue-flow__background-pattern', 'dots', className])"
  />
</template>

<script lang="ts">
import cc from 'classcat';
import { defineComponent, PropType } from 'vue';
import { BackgroundVariant } from './types';

export default defineComponent({
  name: 'Patterns',
  data() {
    return {
      cc,
    };
  },
  props: {
    type: {
      type: String as PropType<'line' | 'dot'>,
      required: true,
    },
    dimensions: {
      type: Array as PropType<[number, number]>,
      required: false,
    },
    variant: {
      type: String as PropType<BackgroundVariant>,
      required: false,
    },
    lineWidth: {
      type: Number,
      default: 1,
    },
    radius: {
      type: Number,
      required: false,
      default: 0.355478,
    },
    className: {
      type: String,
      required: false,
    },
  },
});
</script>
