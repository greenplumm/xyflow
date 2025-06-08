<template>
  <div class="vue-flow__nodes" :style="containerStyle">
    <NodeWrapper
      v-for="nodeId in nodeIds"
      :key="nodeId"
      :id="nodeId"
      :node-types="props.nodeTypes"
      :node-extent="props.nodeExtent"
      :on-click="props.onNodeClick"
      :on-mouse-enter="props.onNodeMouseEnter"
      :on-mouse-move="props.onNodeMouseMove"
      :on-mouse-leave="props.onNodeMouseLeave"
      :on-context-menu="props.onNodeContextMenu"
      :on-double-click="props.onNodeDoubleClick"
      :no-drag-class-name="props.noDragClassName"
      :no-pan-class-name="props.noPanClassName"
      :rf-id="props.rfId"
      :disable-keyboard-a11y="props.disableKeyboardA11y"
      :resize-observer="resizeObserver"
      :nodes-draggable="nodesDraggable"
      :nodes-connectable="nodesConnectable"
      :nodes-focusable="nodesFocusable"
      :elements-selectable="elementsSelectable"
      :node-click-distance="props.nodeClickDistance"
      :on-error="onError"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useVisibleNodeIds } from '../../hooks/useVisibleNodeIds';
import { useStoreApi } from '../../hooks/useStore';
import { containerStyle } from '../../styles/utils';
import { useResizeObserver } from './useResizeObserver';
import { default as NodeWrapper } from '../../components/NodeWrapper/index.vue';
import type { Node } from '../../types';

export interface NodeRendererProps<NodeType extends Node> {
  onNodeClick?: (event: MouseEvent, node: NodeType) => void;
  onNodeDoubleClick?: (event: MouseEvent, node: NodeType) => void;
  onNodeMouseEnter?: (event: MouseEvent, node: NodeType) => void;
  onNodeMouseMove?: (event: MouseEvent, node: NodeType) => void;
  onNodeMouseLeave?: (event: MouseEvent, node: NodeType) => void;
  onNodeContextMenu?: (event: MouseEvent, node: NodeType) => void;
  onlyRenderVisibleElements?: boolean;
  noPanClassName?: string;
  noDragClassName?: string;
  rfId?: string;
  disableKeyboardA11y?: boolean;
  nodeExtent?: [number, number, number, number];
  nodeTypes: Record<string, unknown>;
  nodeClickDistance?: number;
}

const props = defineProps<NodeRendererProps<Node>>();

const store = useStoreApi();

const slice = computed(() => {
  const state = store.getState();
  return {
    nodesDraggable: state.nodesDraggable,
    nodesConnectable: state.nodesConnectable,
    nodesFocusable: state.nodesFocusable,
    elementsSelectable: state.elementsSelectable,
    onError: state.onError,
  };
});
const nodesDraggable = computed(() => slice.value.nodesDraggable);
const nodesConnectable = computed(() => slice.value.nodesConnectable);
const nodesFocusable = computed(() => slice.value.nodesFocusable);
const elementsSelectable = computed(() => slice.value.elementsSelectable);
const onError = computed(() => slice.value.onError);

const nodeIds = useVisibleNodeIds(props.onlyRenderVisibleElements);
const resizeObserver = useResizeObserver();
</script>
