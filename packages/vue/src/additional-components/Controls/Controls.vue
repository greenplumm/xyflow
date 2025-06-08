<script setup lang="ts">
import { computed } from 'vue';
import ControlButton from './ControlButton.vue';
import type { ControlProps } from './types';

const props = defineProps<ControlProps>();

const positionClass = computed(() => `bottom-${props.position?.y || 2} right-${props.position?.x || 2}`);
</script>

<template>
  <div
    :class="['absolute flex gap-2 p-2 bg-white rounded-md shadow-md', positionClass]"
    data-testid="vue-flow__controls"
  >
    <slot>
      <ControlButton v-if="props.showZoom" icon="plus" @click="props.onZoomIn" />
      <ControlButton v-if="props.showZoom" icon="minus" @click="props.onZoomOut" />
      <ControlButton v-if="props.showFitView" icon="fit-view" @click="props.onFitView" />
      <ControlButton v-if="props.showLock" :icon="props.isLocked ? 'lock' : 'unlock'" @click="props.onLockToggle" />
    </slot>
  </div>
</template>
