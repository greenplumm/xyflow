<script setup lang="ts">
import { ref, provide, toRaw } from 'vue';
import { storeContext } from '../../contexts/StoreContext';

import { createStore } from '../../store';
import type { Node, Edge } from '../../types';
import { CoordinateExtent, NodeOrigin } from '@xyflow/system';
import { BatchProvider } from '../BatchProvider/index';
import { createPinia, setActivePinia } from 'pinia';

export interface VueFlowProviderProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  defaultNodes?: Node[];
  defaultEdges?: Edge[];
  initialWidth?: number;
  initialHeight?: number;
  fitView?: boolean;
  nodeOrigin?: NodeOrigin;
  nodeExtent?: CoordinateExtent;
}

const props = defineProps<VueFlowProviderProps>();
// const pinia = createPinia();
// setActivePinia(pinia); // ← 全局激活这个 pinia

const store = createStore({
  nodes: props.initialNodes,
  edges: props.initialEdges,
  defaultNodes: props.defaultNodes,
  defaultEdges: props.defaultEdges,
  width: props.initialWidth,
  height: props.initialHeight,
  fitView: props.fitView,
  nodeOrigin: props.nodeOrigin,
  // nodeExtent: props.nodeExtent,
  // ...props,
});

// provide('store', store);
store.setDefaultNodesAndEdges(props.defaultNodes, props.defaultEdges);
store.$patch({ fitViewOnInit: props.fitView });

storeContext.Provider(store);
</script>

<template>
  <!-- <BatchProvider> -->
  <slot />
  <!-- </BatchProvider> -->
</template>
