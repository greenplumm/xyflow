<script setup lang="ts">
import { watch } from 'vue';
import { useVueFlow } from '../../hooks/useVueFlow';
import type { Node, Edge, Viewport, VueFlowStore } from '../../types';

defineProps<{
  nodes?: Node[];
  edges?: Edge[];
  viewport?: Viewport;
  maxZoom?: number;
  minZoom?: number;
  translateExtent?: [[number, number], [number, number]];
  nodeExtent?: [[number, number], [number, number]];
  onNodesChange?: (changes: any[]) => void;
  onEdgesChange?: (changes: any[]) => void;
  onConnect?: (connection: any) => void;
  onConnectStart?: (event: MouseEvent) => void;
  onConnectEnd?: (event: MouseEvent) => void;
}>();

const store = useVueFlow();

watch(
  () => store.nodes,
  (nodes) => {
    if (nodes) store.setNodes(nodes);
  },
  { immediate: true }
);

watch(
  () => store.edges,
  (edges) => {
    if (edges) store.setEdges(edges);
  },
  { immediate: true }
);

watch(
  () => store.viewport,
  (viewport) => {
    if (viewport) store.setViewport(viewport);
  },
  { immediate: true }
);

watch(
  () => store.minZoom,
  (minZoom) => {
    if (typeof minZoom === 'number') store.setMinZoom(minZoom);
  },
  { immediate: true }
);

watch(
  () => store.maxZoom,
  (maxZoom) => {
    if (typeof maxZoom === 'number') store.setMaxZoom(maxZoom);
  },
  { immediate: true }
);

watch(
  () => store.translateExtent,
  (translateExtent) => {
    if (translateExtent) store.setTranslateExtent(translateExtent);
  },
  { immediate: true }
);

watch(
  () => store.nodeExtent,
  (nodeExtent) => {
    if (nodeExtent) store.setNodeExtent(nodeExtent);
  },
  { immediate: true }
);

watch(
  () => store.onNodesChange,
  (onNodesChange) => {
    store.onNodesChange = onNodesChange;
  },
  { immediate: true }
);

watch(
  () => store.onEdgesChange,
  (onEdgesChange) => {
    store.onEdgesChange = onEdgesChange;
  },
  { immediate: true }
);

watch(
  () => store.onConnect,
  (onConnect) => {
    store.onConnect = onConnect;
  },
  { immediate: true }
);

watch(
  () => store.onConnectStart,
  (onConnectStart) => {
    store.onConnectStart = onConnectStart;
  },
  { immediate: true }
);

watch(
  () => store.onConnectEnd,
  (onConnectEnd) => {
    store.onConnectEnd = onConnectEnd;
  },
  { immediate: true }
);
</script>

<template>
  <div />
</template>
