<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    id: string;
    color?: string;
    strokeWidth?: number;
  }>(),
  {
    id: '',
    color: '#b1b1b7',
    strokeWidth: 1,
  }
);

const markerId = computed(() => `vue-flow__${props.id}`);
</script>

<template>
  <symbol :id="markerId" :class="`vue-flow__${props.id}`" :stroke="props.color" :stroke-width="props.strokeWidth">
    <slot />
  </symbol>
</template>
