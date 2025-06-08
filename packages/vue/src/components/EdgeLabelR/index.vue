<script setup lang="ts">
import type { CSSProperties } from 'vue';

defineProps<{
  x: number;
  y: number;
  required?: boolean;
  position?: 'top' | 'bottom';
  class?: string;
  style?: CSSProperties;
}>();
</script>

<template>
  <svg
    :class="['vue-flow__edge-labelrenderer', position, $attrs.class]"
    :style="{
      transform: `translate(${x}px, ${y}px)`,
      pointerEvents: 'all',
      ...style,
    }"
  >
    <foreignObject width="1" height="1" required="required" class="vue-flow__edge-label">
      <div class="label">
        <slot />
      </div>
    </foreignObject>
  </svg>
</template>

<style>
.vue-flow__edge-labelrenderer {
  position: absolute;
  pointer-events: none;
  z-index: 5;

  &.top {
    transform: translateY(-100%) !important;
  }

  &.bottom {
    transform: translateY(100%) !important;
  }
}

.label {
  position: relative;
  transform: translate(-50%, -50%);
  background: transparent;
  text-align: center;
}
</style>
