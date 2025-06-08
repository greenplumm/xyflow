<template>
  <div
    v-if="isSelecting"
    class="react-flow__selection"
    :style="{
      width: selectionWidth + 'px',
      height: selectionHeight + 'px',
      transform: `translate(${selectionX}px, ${selectionY}px)`,
    }"
  />
</template>

<script setup lang="ts">
import { watchEffect, ref } from 'vue';
import { useStoreApi } from '../../hooks/useStore';
import type { ReactFlowStore } from '../../types';

const { getState } = useStoreApi();
const selectionRect = ref(getState().userSelectionRect);

const isSelecting = ref(false);
const selectionX = ref(0);
const selectionY = ref(0);
const selectionWidth = ref(0);
const selectionHeight = ref(0);

watchEffect(() => {
  const { userSelectionRect } = getState();

  isSelecting.value = userSelectionRect !== null;

  if (userSelectionRect) {
    selectionX.value = userSelectionRect.x;
    selectionY.value = userSelectionRect.y;
    selectionWidth.value = userSelectionRect.width;
    selectionHeight.value = userSelectionRect.height;
  }
});
</script>
