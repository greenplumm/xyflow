<script setup lang="ts">
import { computed } from 'vue';
import type { HandleProps } from './types';
import { useHandle } from './useHandle';

const props = defineProps<HandleProps>();

const { handleId, handlePointerDown } = useHandle(props);

const style = computed(() => ({
  position: 'absolute',
  width: '10px',
  height: '10px',
  borderRadius: '100%',
  transform: `translate(-50%, -50%)`,
  left: `${props.position[0] * 100}%`,
  top: `${props.position[1] * 100}%`,
}));
</script>

<template>
  <div
    class="vue-flow__handle"
    :data-handleid="handleId"
    :data-nodeid="props.nodeId"
    :style="style"
    @mousedown="handlePointerDown"
    @touchstart="handlePointerDown"
  />
</template>
