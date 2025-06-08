<script setup lang="ts">
import { computed } from 'vue';
import type { MiniMapNodeProps } from './types';

const props = defineProps<MiniMapNodeProps>();

const nodeStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  transform: `translate(${props.x}px, ${props.y}px)`,
  borderRadius: props.borderRadius,
}));
</script>

<template>
  <div
    class="vue-flow__minimap-node"
    :style="nodeStyle"
    :data-id="id"
    :data-selected="selected"
    :data-dragging="dragging"
  >
    <slot :node="props">
      <div class="vue-flow__minimap-node-inner" />
    </slot>
  </div>
</template>
