<template>
  <g>
    <circle
      v-if="isReconnectable"
      :cx="sourceX"
      :cy="sourceY"
      :r="reconnectRadius"
      class="vue-flow__edgeupdater"
      @mouseenter="onSourceMouseEnter"
      @mouseleave="onSourceMouseLeave"
      @mousedown="onSourceMouseDown"
    />
    <circle
      v-if="isReconnectable"
      :cx="targetX"
      :cy="targetY"
      :r="reconnectRadius"
      class="vue-flow__edgeupdater"
      @mouseenter="onTargetMouseEnter"
      @mouseleave="onTargetMouseLeave"
      @mousedown="onTargetMouseDown"
    />
  </g>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Edge } from '../../types';

const props = defineProps<{
  edge: Edge;
  isReconnectable: boolean;
  reconnectRadius: number;
  onReconnect?: (connection: { source: string; target: string; sourceHandle?: string; targetHandle?: string }) => void;
  onReconnectStart?: (event: MouseEvent, edge: Edge) => void;
  onReconnectEnd?: (event: MouseEvent) => void;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: string;
  targetPosition: string;
  setUpdateHover: (val: boolean) => void;
  setReconnecting: (val: boolean) => void;
}>();

const onSourceMouseEnter = () => {
  props.setUpdateHover(true);
};

const onSourceMouseLeave = () => {
  props.setUpdateHover(false);
};

const onTargetMouseEnter = () => {
  props.setUpdateHover(true);
};

const onTargetMouseLeave = () => {
  props.setUpdateHover(false);
};

const onSourceMouseDown = (event: MouseEvent) => {
  if (!props.isReconnectable) {
    return;
  }

  props.setReconnecting(true);
  props.onReconnectStart?.(event, props.edge);

  const onMouseUp = (event: MouseEvent) => {
    props.onReconnectEnd?.(event);
    props.setReconnecting(false);
    window.removeEventListener('mouseup', onMouseUp);
  };

  window.addEventListener('mouseup', onMouseUp);
};

const onTargetMouseDown = (event: MouseEvent) => {
  if (!props.isReconnectable) {
    return;
  }

  props.setReconnecting(true);
  props.onReconnectStart?.(event, props.edge);

  const onMouseUp = (event: MouseEvent) => {
    props.onReconnectEnd?.(event);
    props.setReconnecting(false);
    window.removeEventListener('mouseup', onMouseUp);
  };

  window.addEventListener('mouseup', onMouseUp);
};
</script>
