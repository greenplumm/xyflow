<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../../hooks/useStore';
import { panelProps } from './types';
import type { VueFlowState } from '../../types';

const selector = (s: VueFlowState) => (s.userSelectionActive ? 'none' : 'all');
const props = defineProps(panelProps);

const pointerEvents = useStore(selector);
const positionClasses = computed(() => props.position.split('-').map((p) => `vue-flow__panel-${p}`));
</script>

<template>
  <div :class="['vue-flow__panel', props.class, ...positionClasses]" :style="{ ...props.style, pointerEvents }">
    <slot />
  </div>
</template>
