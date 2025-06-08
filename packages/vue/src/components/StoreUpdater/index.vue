<script setup lang="ts">
import { defineProps, watch, onMounted, onBeforeUnmount, ref } from 'vue';
import { useStore, useStoreApi } from '../../hooks/useStore';
import { infiniteExtent, type CoordinateExtent } from '@xyflow/system';
import { defaultNodeOrigin } from '../../container/VueFlow/init-values';

import type { Node, Edge, VueFlowState, FitViewOptions } from '@/types';
import type { StoreUpdaterProps } from './storeUpdaterProps';

// 需要跟踪的全局字段
const reactFlowFieldsToTrack = [
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

// rfId 也是要跟踪的字段
const fieldsToTrack = [...reactFlowFieldsToTrack, 'rfId'] as const;

// 组件接收的 props
const props = defineProps<StoreUpdaterProps>();

// 从 store 中取所需 setter 和 reset 函数
const slice = useStore((s: VueFlowState) => ({
  setNodes: s.setNodes,
  setEdges: s.setEdges,
  setMinZoom: s.setMinZoom,
  setMaxZoom: s.setMaxZoom,
  setTranslateExtent: s.setTranslateExtent,
  setNodeExtent: s.setNodeExtent,
  reset: s.reset,
  setDefaultNodesAndEdges: s.setDefaultNodesAndEdges,
  setPaneClickDistance: s.setPaneClickDistance,
}));
const {
  setNodes,
  setEdges,
  setMinZoom,
  setMaxZoom,
  setTranslateExtent,
  setNodeExtent,
  reset,
  setDefaultNodesAndEdges,
  setPaneClickDistance,
} = slice.value;
const storeApi = useStoreApi<NT, ET>();

// 初始化时的前置值
const initPrevValues: Partial<StoreUpdaterProps> = {
  translateExtent: infiniteExtent,
  nodeOrigin: defaultNodeOrigin,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: true,
  noPanClassName: 'nopan',
  rfId: '1',
  paneClickDistance: 0,
};
const previousFields = ref<Partial<StoreUpdaterProps>>(initPrevValues);

// 初次挂载：设置默认 nodes & edges
onMounted(() => {
  // setDefaultNodesAndEdges(props.defaultNodes, props.defaultEdges);
});

// 卸载时：重置 store 与前置值
onBeforeUnmount(() => {
  previousFields.value = initPrevValues;
  reset();
});

// 监听所有待跟踪字段
watch(
  () => fieldsToTrack.map((f) => props[f as keyof typeof props]),
  () => {
    for (const field of fieldsToTrack) {
      const value = props[field as keyof typeof props];
      const prev = previousFields.value[field as keyof typeof previousFields.value];
      if (value === prev) continue;
      if (value === undefined) continue;

      // 专用 setter
      switch (field) {
        case 'nodes':
          setNodes(value as Node[]);
          break;
        case 'edges':
          setEdges(value as Edge[]);
          break;
        case 'minZoom':
          setMinZoom(value as number);
          break;
        case 'maxZoom':
          setMaxZoom(value as number);
          break;
        case 'translateExtent':
          setTranslateExtent(value as CoordinateExtent);
          break;
        case 'nodeExtent':
          setNodeExtent(value as CoordinateExtent);
          break;
        case 'paneClickDistance':
          setPaneClickDistance(value as number);
          break;
        case 'fitView':
          storeApi.setState({ fitViewOnInit: value as boolean });
          break;
        case 'fitViewOptions':
          storeApi.setState({ fitViewOnInitOptions: value as FitViewOptions });
          break;
        default:
          storeApi.setState({ [field]: value });
      }
    }
    // 更新前置值
    previousFields.value = { ...props };
  }
  // { immediate: true }
);
</script>
