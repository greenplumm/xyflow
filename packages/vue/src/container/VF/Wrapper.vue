<script setup lang="ts">
import { inject, ref } from 'vue';
import { StoreContextKey } from '../../contexts/StoreContext';
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
  nodeTypes?: Record<string, any>;
}>();

const slots = defineSlots<{
  default: () => any;
}>();

const isWrapped = inject(StoreContextKey, ref(null));
</script>

<template>
  <template v-if="isWrapped">
    <slot v-bind="$props" />
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
      :node-types="nodeTypes"
    >
      <slot v-bind="$props" />
    </VueFlowProvider>
  </template>
</template>
