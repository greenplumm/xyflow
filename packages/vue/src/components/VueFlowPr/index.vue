<script setup lang="ts">
import { ref, provide, onMounted } from 'vue';
import { useVueFlowStore } from '../../store';
import { StoreContextKey } from '../../contexts/StoreContext';
import type { Node, Edge } from '../../types';
import { CoordinateExtent, NodeOrigin } from '@xyflow/system';
import { createPinia } from 'pinia';

const pinia = createPinia();

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

const store = ref<VueFlowStore | null>(null);

onMounted(() => {
  store.value = useVueFlowStore({
    nodes: props.initialNodes,
    edges: props.initialEdges,
    defaultNodes: props.defaultNodes,
    defaultEdges: props.defaultEdges,
    width: props.initialWidth,
    height: props.initialHeight,
    fitView: props.fitView,
    nodeOrigin: props.nodeOrigin,
    nodeExtent: props.nodeExtent,
  });
});

provide(StoreContextKey, store);
</script>

<template>
  <slot />
</template>
