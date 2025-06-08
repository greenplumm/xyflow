<script setup lang="ts">
import { useNodeObserver } from './useNodeObserver';
import type { NodeWrapperProps } from './types';

const props = defineProps<NodeWrapperProps>();
const { nodeRef, resizeHandleRef } = useNodeObserver(props);
</script>

<template>
  <div ref="nodeRef" class="vue-flow__node-wrapper">
    <div class="vue-flow__node-content">
      <slot />
    </div>
    <div
      v-if="props.resizable"
      ref="resizeHandleRef"
      class="vue-flow__resize-handle"
      @mousedown.prevent="handleResizeStart"
    />
  </div>
</template>
