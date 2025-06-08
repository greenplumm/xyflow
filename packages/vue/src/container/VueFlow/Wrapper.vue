<script setup lang="ts">
import { inject, ref } from 'vue';
import { storeContext } from '../../contexts/StoreContext';
import VueFlowProvider from '../../components/VueFlowProvider/index.vue';
import type { Node, Edge } from '../../types';
import { CoordinateExtent, NodeOrigin } from '@xyflow/system';

defineProps<{
  nodes?: Node[];
  edges?: Edge[];
  defaultNodes?: Node[];
  defaultEdges?: Edge[];
  width?: number;
  height?: number;
  fitView?: boolean;
  nodeOrigin?: NodeOrigin;
  nodeExtent?: CoordinateExtent;
}>();

const isWrapped = storeContext.Inject();
</script>

<template>
  <template v-if="isWrapped">
    <slot />
  </template>
  <template v-else>
    <VueFlowProvider
      :initial-nodes="nodes"
      :initial-edges="edges"
      :default-nodes="defaultNodes"
      :default-edges="defaultEdges"
      :initial-width="width"
      :initial-height="height"
      :fit-view="fitView"
      :node-origin="nodeOrigin"
      :node-extent="nodeExtent"
    >
      <slot />
    </VueFlowProvider>
  </template>
</template>
