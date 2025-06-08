<script setup lang="ts">
import { watchEffect, ref, onMounted, onUnmounted } from 'vue';
import { useVueFlow } from '../../hooks/useVueFlow';
import { useStore, useStoreApi } from '../../hooks/useStore';

import type { Node, Edge, Viewport, VueFlowStore, VueFlowProps } from '../../types';

const vueFlowFieldsToTrack = [
  'nodes',
  'edges',
  'defaultNodes',
  'defaultEdges',

  'onConnect',
  'onConnectStart',
  'onConnectEnd',
  'onClickConnectStart',
  'onClickConnectEnd',
  'nodesDraggable',
  'nodesConnectable',
  'nodesFocusable',
  'edgesFocusable',
  'edgesReconnectable',
  'elevateNodesOnSelect',
  'elevateEdgesOnSelect',
  'minZoom',
  'maxZoom',
  'nodeExtent',
  'onNodesChange',
  'onEdgesChange',
  'elementsSelectable',
  'connectionMode',
  'snapGrid',
  'snapToGrid',
  'translateExtent',
  'connectOnClick',
  'defaultEdgeOptions',
  'fitView',
  'fitViewOptions',
  'onNodesDelete',
  'onEdgesDelete',
  'onDelete',
  'onNodeDrag',
  'onNodeDragStart',
  'onNodeDragStop',
  'onSelectionDrag',
  'onSelectionDragStart',
  'onSelectionDragStop',
  'onMoveStart',
  'onMove',
  'onMoveEnd',
  'noPanClassName',
  'nodeOrigin',
  'autoPanOnConnect',
  'autoPanOnNodeDrag',
  'onError',
  'connectionRadius',
  'isValidConnection',
  'selectNodesOnDrag',
  'nodeDragThreshold',
  'onBeforeDelete',
  'debug',
  'autoPanSpeed',
  'paneClickDistance',
] as const;

type StoreUpdaterProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  nodes?: NodeType[];
  edges?: EdgeType[];
  defaultNodes?: NodeType[];
  defaultEdges?: EdgeType[];
  onConnect?: VueFlowProps['onConnect'];
  onConnectStart?: VueFlowProps['onConnectStart'];
  onConnectEnd?: VueFlowProps['onConnectEnd'];
  onClickConnectStart?: VueFlowProps['onClickConnectStart'];
  onClickConnectEnd?: VueFlowProps['onClickConnectEnd'];
  nodesDraggable?: boolean;
  nodesConnectable?: boolean;
  nodesFocusable?: boolean;
  edgesFocusable?: boolean;
  edgesReconnectable?: boolean;
  elevateNodesOnSelect?: boolean;
  elevateEdgesOnSelect?: boolean;
  minZoom?: number;
  maxZoom?: number;
  nodeExtent?: [[number, number], [number, number]];
  onNodesChange?: VueFlowProps['onNodesChange'];
  onEdgesChange?: VueFlowProps['onEdgesChange'];
  elementsSelectable?: boolean;
  connectionMode?: VueFlowProps['connectionMode'];
  snapGrid?: [number, number];
  snapToGrid?: boolean;
  translateExtent?: [[number, number], [number, number]];
  connectOnClick?: boolean;
  defaultEdgeOptions?: VueFlowProps['defaultEdgeOptions'];
  fitView?: boolean;
  fitViewOptions?: VueFlowProps['fitViewOptions'];
  onNodesDelete?: VueFlowProps['onNodesDelete'];
  onEdgesDelete?: VueFlowProps['onEdgesDelete'];
  onDelete?: VueFlowProps['onDelete'];
  onNodeDrag?: VueFlowProps['onNodeDrag'];
  onNodeDragStart?: VueFlowProps['onNodeDragStart'];
  onNodeDragStop?: VueFlowProps['onNodeDragStop'];
  onSelectionDrag?: VueFlowProps['onSelectionDrag'];
  onSelectionDragStart?: VueFlowProps['onSelectionDragStart'];
  onSelectionDragStop?: VueFlowProps['onSelectionDragStop'];
  onMoveStart?: VueFlowProps['onMoveStart'];
  onMove?: VueFlowProps['onMove'];
  onMoveEnd?: VueFlowProps['onMoveEnd'];
  noPanClassName?: string;
  nodeOrigin?: VueFlowProps['nodeOrigin'];
  autoPanOnConnect?: boolean;
  autoPanOnNodeDrag?: boolean;
  onError?: VueFlowProps['onError'];
  connectionRadius?: number;
  isValidConnection?: VueFlowProps['isValidConnection'];
  selectNodesOnDrag?: boolean;
  nodeDragThreshold?: number;
  onBeforeDelete?: VueFlowProps['onBeforeDelete'];
  debug?: boolean;
  autoPanSpeed?: number;
  paneClickDistance?: number;
  rfId: string;
};

// rfId不在VueFlowProps中但需要跟踪
const fieldsToTrack = [...vueFlowFieldsToTrack, 'rfId'] as const;

const props = defineProps<StoreUpdaterProps>();
const selector = (s: VueFlowState) => ({
  setNodes: s.setNodes,
  setEdges: s.setEdges,
  setMinZoom: s.setMinZoom,
  setMaxZoom: s.setMaxZoom,
  setTranslateExtent: s.setTranslateExtent,
  setNodeExtent: s.setNodeExtent,
  reset: s.reset,
  setDefaultNodesAndEdges: s.setDefaultNodesAndEdges,
  setPaneClickDistance: s.setPaneClickDistance,
});
const store = useStore<NodeType, EdgeType>(selector);
const previousFields = ref<Partial<StoreUpdaterProps>>({});
const { setState } = useStoreApi();
watchEffect(() => {
  const currentProps = Object.fromEntries(
    vueFlowFieldsToTrack.map((field) => [field, props[field] as any])
  ) as StoreUpdaterProps;

  // 遍历所有跟踪字段更新状态
  for (const field of fieldsToTrack) {
    const currentValue = currentProps[field];
    const previousValue = previousFields.value[field];

    if (currentValue === previousValue || currentValue === undefined) continue;

    // 专用setter处理
    switch (field) {
      case 'nodes':
        store.setNodes(currentValue as Node[]);
        break;
      case 'edges':
        store.setEdges(currentValue as Edge[]);
        break;
      case 'minZoom':
        store.setMinZoom(currentValue as number);
        break;
      case 'maxZoom':
        store.setMaxZoom(currentValue as number);
        break;
      case 'translateExtent':
        store.setTranslateExtent(currentValue as [[number, number], [number, number]]);
        break;
      case 'nodeExtent':
        store.setNodeExtent(currentValue as [[number, number], [number, number]]);
        break;
      case 'paneClickDistance':
        setState({ paneClickDistance: currentValue as number });
        break;
      case 'fitView':
        setState({ fitViewOnInit: currentValue as boolean });
        break;
      case 'fitViewOptions':
        setState({ fitViewOnInitOptions: currentValue });
        break;
      default:
        setState({ [field]: currentValue });
    }
  }

  previousFields.value = currentProps;
});

// 初始化默认值
onMounted(() => {
  // store.setDefaultNodesAndEdges(props.defaultNodes, props.defaultEdges);
});

// 卸载时重置状态
onUnmounted(() => {
  store.reset();
});
</script>

<template>
  <slot />
</template>
