<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue';
import type { Node, SelectionRect } from '@xyflow/system';
import { getNodesInside } from '@xyflow/system';

defineProps<{
  rect?: SelectionRect;
  onStart?: (pos: { x: number; y: number }) => void;
  onEnd?: (rect: SelectionRect) => void;
}>();

const startPos = ref<{ x: number; y: number } | null>(null);
const isDragging = ref(false);
const container = ref<HTMLElement>();

const nodes = computed(() => {
  if (!props.rect) return [];

  return getNodesInside<NodeType>({
    nodes: props.nodes,
    rect: props.rect,
    nodeOrigin: props.nodeOrigin,
    snapToGrid: props.snapToGrid,
    snapGrid: props.snapGrid,
  });
});

watchEffect(() => {
  if (props.onChange && props.rect) {
    props.onChange(nodes.value);
  }
});

const handleMouseDown = (e: MouseEvent) => {
  startPos.value = { x: e.clientX, y: e.clientY };
  isDragging.value = true;
  props.onStart?.(startPos.value);
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !startPos.value) return;

  const { clientX, clientY } = e;
  const bounds = e.currentTarget?.getBoundingClientRect();

  if (!bounds) return;

  const xOffset = clientX - bounds.left;
  const yOffset = clientY - bounds.top;

  const rect = {
    x: Math.min(startPos.value.x, xOffset),
    y: Math.min(startPos.value.y, yOffset),
    width: Math.abs(xOffset - startPos.value.x),
    height: Math.abs(yOffset - startPos.value.y),
  };

  props.onEnd?.(rect);
};

const handleMouseUp = () => {
  if (isDragging.value && startPos.value) {
    props.onEnd?.({
      x: startPos.value.x,
      y: startPos.value.y,
      width: 0,
      height: 0,
    });
  }
  isDragging.value = false;
  startPos.value = null;
};
</script>

<template>
  <div
    class="xy-flow__nodesselection"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
  >
    <div
      v-if="isDragging"
      class="xy-flow__nodesselection-rect"
      :style="{
        transform: `translate(${rect?.x}px, ${rect?.y}px)`,
        width: `${rect?.width}px`,
        height: `${rect?.height}px`,
      }"
    />
  </div>
</template>

<style>
.xy-flow__nodesselection {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}

.xy-flow__nodesselection-rect {
  position: absolute;
  background: rgba(0, 122, 255, 0.1);
  border: 1px solid rgba(0, 122, 255, 0.8);
  pointer-events: none;
}
</style>
