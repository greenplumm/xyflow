<template>
  <div class="vue-flow__viewport xyflow__viewport vue-flow__container" :style="{ transform }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../../hooks/useStore';
import type { VueFlowState } from '../../types';

const selector = (s: VueFlowState) =>
  s?.transform ? `translate(${s.transform[0]}px,${s.transform[1]}px) scale(${s.transform[2]})` : '';

const transform = useStore(selector);
</script>
