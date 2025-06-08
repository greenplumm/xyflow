<template>
  <Panel
    v-if="!proOptions?.hideAttribution"
    :position="position"
    class="react-flow__attribution"
    data-message="Please only hide this attribution when you are subscribed to React Flow Pro: https://pro.reactflow.dev"
  >
    <a href="https://reactflow.dev" target="_blank" rel="noopener noreferrer" aria-label="React Flow attribution">
      React Flow
    </a>
  </Panel>
</template>

<script setup lang="ts">
import type { PanelPosition, ProOptions } from '@xyflow/system';
import { default as Panel } from '../Panel/index.vue';

defineProps<{
  proOptions?: ProOptions;
  position?: PanelPosition;
}>();
</script>
