<template>
  <Teleport :to="edgeLabelRenderer" v-if="edgeLabelRenderer">
    <slot />
  </Teleport>
</template>

<script setup lang="ts">
import { useStore } from '../../hooks/useStore';
import type { VueFlowState } from '../../types';

const selector = (s: VueFlowState) => s.domNode?.querySelector('.vue-flow__edgelabel-renderer');
const edgeLabelRenderer = useStore(selector);
</script>

<style scoped>
/* 保持与React版本一致的无指针事件样式 */
:deep(.vue-flow__edgelabel-renderer) {
  pointer-events: none;
}
</style>
