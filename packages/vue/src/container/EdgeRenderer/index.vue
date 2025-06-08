<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useStore } from '../../hooks/useStore';
import { useVisibleEdgeIds } from '../../hooks/useVisibleEdgeIds';
import MarkerDefinitions from './MarkerDefinitions.vue';
import { default as EdgeWrapper } from '../../components/EdgeWrapper/index.vue';
import type { Edge, ReactFlowState, Node } from '../../types';

interface Props<EdgeType extends Edge = Edge> {
  defaultMarkerColor?: string;
  onlyRenderVisibleElements?: boolean;
  rfId?: string;
  edgeTypes?: Record<string, unknown>;
  noPanClassName?: string;
  onReconnect?: (event: Event) => void;
  onEdgeContextMenu?: (event: Event) => void;
  onEdgeMouseEnter?: (event: Event) => void;
  onEdgeMouseMove?: (event: Event) => void;
  onEdgeMouseLeave?: (event: Event) => void;
  onEdgeClick?: (event: Event) => void;
  reconnectRadius?: number;
  onEdgeDoubleClick?: (event: Event) => void;
  onReconnectStart?: (event: Event) => void;
  onReconnectEnd?: (event: Event) => void;
  disableKeyboardA11y?: boolean;
}

const props = defineProps<Props>();

const selector = (s: ReactFlowState) => ({
  edgesFocusable: s.edgesFocusable,
  edgesReconnectable: s.edgesReconnectable,
  elementsSelectable: s.elementsSelectable,
  connectionMode: s.connectionMode,
  onError: s.onError,
});

const { edgesFocusable, edgesReconnectable, elementsSelectable, onError } = useStore(selector).value;
const edgeIds = ref(useVisibleEdgeIds(props.onlyRenderVisibleElements));
const edges = useStore((state) => state.edges);
watch(
  () => edges.value,
  (newEdges) => (edgeIds.value = newEdges.map((edge) => edge.id)),
  { immediate: false }
);
</script>

<template>
  <div class="vue-flow__edges">
    <MarkerDefinitions :defaultColor="props.defaultMarkerColor" :rfId="props.rfId" />

    <EdgeWrapper
      v-for="id in edgeIds"
      :key="id"
      :id="id"
      :edgesFocusable="edgesFocusable"
      :edgesReconnectable="edgesReconnectable"
      :elementsSelectable="elementsSelectable"
      :noPanClassName="props.noPanClassName"
      :onReconnect="props.onReconnect"
      :onContextMenu="props.onEdgeContextMenu"
      :onMouseEnter="props.onEdgeMouseEnter"
      :onMouseMove="props.onEdgeMouseMove"
      :onMouseLeave="props.onEdgeMouseLeave"
      :onClick="props.onEdgeClick"
      :reconnectRadius="props.reconnectRadius"
      :onDoubleClick="props.onEdgeDoubleClick"
      :onReconnectStart="props.onReconnectStart"
      :onReconnectEnd="props.onReconnectEnd"
      :rfId="props.rfId"
      :onError="onError"
      :edgeTypes="props.edgeTypes"
      :disableKeyboardA11y="props.disableKeyboardA11y"
    />
  </div>
</template>
