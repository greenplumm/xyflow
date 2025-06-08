<!-- filepath: /Users/miller/myprojects/xyflow/packages/vue/src/container/ReactFlow/index.vue -->
<template>
  <div
    data-testid="rf__wrapper"
    :id="id"
    :class="['react-flow', className, colorModeClassName]"
    :style="{ ...wrapperStyle, ...style }"
    ref="wrapperRef"
    @scroll="wrapperOnScroll"
    v-bind="restAttrs"
  >
    <Wrapper
      :nodes="nodes"
      :edges="edges"
      :width="width"
      :height="height"
      :fitView="fitView"
      :nodeOrigin="nodeOrigin"
      :nodeExtent="nodeExtent"
    >
      <GraphView
        :onInit="onInit"
        :onNodeClick="onNodeClick"
        :onEdgeClick="onEdgeClick"
        :onNodeMouseEnter="onNodeMouseEnter"
        :onNodeMouseMove="onNodeMouseMove"
        :onNodeMouseLeave="onNodeMouseLeave"
        :onNodeContextMenu="onNodeContextMenu"
        :onNodeDoubleClick="onNodeDoubleClick"
        :nodeTypes="nodeTypes"
        :edgeTypes="edgeTypes"
        :connectionLineType="connectionLineType"
        :connectionLineStyle="connectionLineStyle"
        :connectionLineComponent="connectionLineComponent"
        :connectionLineContainerStyle="connectionLineContainerStyle"
        :selectionKeyCode="selectionKeyCode"
        :selectionOnDrag="selectionOnDrag"
        :selectionMode="selectionMode"
        :deleteKeyCode="deleteKeyCode"
        :multiSelectionKeyCode="multiSelectionKeyCode"
        :panActivationKeyCode="panActivationKeyCode"
        :zoomActivationKeyCode="zoomActivationKeyCode"
        :onlyRenderVisibleElements="onlyRenderVisibleElements"
        :defaultViewport="defaultViewport"
        :translateExtent="translateExtent"
        :minZoom="minZoom"
        :maxZoom="maxZoom"
        :preventScrolling="preventScrolling"
        :zoomOnScroll="zoomOnScroll"
        :zoomOnPinch="zoomOnPinch"
        :zoomOnDoubleClick="zoomOnDoubleClick"
        :panOnScroll="panOnScroll"
        :panOnScrollSpeed="panOnScrollSpeed"
        :panOnScrollMode="panOnScrollMode"
        :panOnDrag="panOnDrag"
        :onPaneClick="onPaneClick"
        :onPaneMouseEnter="onPaneMouseEnter"
        :onPaneMouseMove="onPaneMouseMove"
        :onPaneMouseLeave="onPaneMouseLeave"
        :onPaneScroll="onPaneScroll"
        :onPaneContextMenu="onPaneContextMenu"
        :paneClickDistance="paneClickDistance"
        :nodeClickDistance="nodeClickDistance"
        :onSelectionContextMenu="onSelectionContextMenu"
        :onSelectionStart="onSelectionStart"
        :onSelectionEnd="onSelectionEnd"
        :onReconnect="onReconnect"
        :onReconnectStart="onReconnectStart"
        :onReconnectEnd="onReconnectEnd"
        :onEdgeContextMenu="onEdgeContextMenu"
        :onEdgeDoubleClick="onEdgeDoubleClick"
        :onEdgeMouseEnter="onEdgeMouseEnter"
        :onEdgeMouseMove="onEdgeMouseMove"
        :onEdgeMouseLeave="onEdgeMouseLeave"
        :reconnectRadius="reconnectRadius"
        :defaultMarkerColor="defaultMarkerColor"
        :noDragClassName="noDragClassName"
        :noWheelClassName="noWheelClassName"
        :noPanClassName="noPanClassName"
        :rfId="rfId"
        :disableKeyboardA11y="disableKeyboardA11y"
        :nodeExtent="nodeExtent"
        :viewport="viewport"
        :onViewportChange="onViewportChange"
      />
      <StoreUpdater
        :nodes="nodes"
        :edges="edges"
        :defaultNodes="defaultNodes"
        :defaultEdges="defaultEdges"
        :onConnect="onConnect"
        :onConnectStart="onConnectStart"
        :onConnectEnd="onConnectEnd"
        :onClickConnectStart="onClickConnectStart"
        :onClickConnectEnd="onClickConnectEnd"
        :nodesDraggable="nodesDraggable"
        :nodesConnectable="nodesConnectable"
        :nodesFocusable="nodesFocusable"
        :edgesFocusable="edgesFocusable"
        :edgesReconnectable="edgesReconnectable"
        :elementsSelectable="elementsSelectable"
        :elevateNodesOnSelect="elevateNodesOnSelect"
        :elevateEdgesOnSelect="elevateEdgesOnSelect"
        :minZoom="minZoom"
        :maxZoom="maxZoom"
        :nodeExtent="nodeExtent"
        :onNodesChange="onNodesChange"
        :onEdgesChange="onEdgesChange"
        :snapToGrid="snapToGrid"
        :snapGrid="snapGrid"
        :connectionMode="connectionMode"
        :translateExtent="translateExtent"
        :connectOnClick="connectOnClick"
        :defaultEdgeOptions="defaultEdgeOptions"
        :fitView="fitView"
        :fitViewOptions="fitViewOptions"
        :onNodesDelete="onNodesDelete"
        :onEdgesDelete="onEdgesDelete"
        :onDelete="onDelete"
        :onNodeDragStart="onNodeDragStart"
        :onNodeDrag="onNodeDrag"
        :onNodeDragStop="onNodeDragStop"
        :onSelectionDrag="onSelectionDrag"
        :onSelectionDragStart="onSelectionDragStart"
        :onSelectionDragStop="onSelectionDragStop"
        :onMove="onMove"
        :onMoveStart="onMoveStart"
        :onMoveEnd="onMoveEnd"
        :noPanClassName="noPanClassName"
        :nodeOrigin="nodeOrigin"
        :rfId="rfId"
        :autoPanOnConnect="autoPanOnConnect"
        :autoPanOnNodeDrag="autoPanOnNodeDrag"
        :autoPanSpeed="autoPanSpeed"
        :onError="onError"
        :connectionRadius="connectionRadius"
        :isValidConnection="isValidConnection"
        :selectNodesOnDrag="selectNodesOnDrag"
        :nodeDragThreshold="nodeDragThreshold"
        :onBeforeDelete="onBeforeDelete"
        :paneClickDistance="paneClickDistance"
        :debug="debug"
      />
      <SelectionListener :onSelectionChange="onSelectionChange" />
      <slot />
      <Attribution :proOptions="proOptions" :position="attributionPosition" />
      <A11yDescriptions :rfId="rfId" :disableKeyboardA11y="disableKeyboardA11y" />
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue';
import cc from 'classcat';
import { useColorModeClass } from '../../hooks/useColorModeClass';
import { default as Wrapper } from './Wrapper.vue';
import { default as GraphView } from '../GraphView/index.vue';
import { default as StoreUpdater } from '../../components/StoreUpdater/index.vue';
import { default as SelectionListener } from '../../components/SelectionListener/index.vue';
import { default as Attribution } from '../../components/Attribution/index.vue';
import { default as A11yDescriptions } from '../../components/A11yDescriptions/index.vue';
import { defaultViewport as initViewport, defaultNodeOrigin } from './init-values';

const props = defineProps({
  nodes: Array,
  edges: Array,
  defaultNodes: Array,
  defaultEdges: Array,
  className: String,
  nodeTypes: Object,
  edgeTypes: Object,
  onNodeClick: Function,
  onEdgeClick: Function,
  onInit: Function,
  onMove: Function,
  onMoveStart: Function,
  onMoveEnd: Function,
  onConnect: Function,
  onConnectStart: Function,
  onConnectEnd: Function,
  onClickConnectStart: Function,
  onClickConnectEnd: Function,
  onNodeMouseEnter: Function,
  onNodeMouseMove: Function,
  onNodeMouseLeave: Function,
  onNodeContextMenu: Function,
  onNodeDoubleClick: Function,
  onNodeDragStart: Function,
  onNodeDrag: Function,
  onNodeDragStop: Function,
  onNodesDelete: Function,
  onEdgesDelete: Function,
  onDelete: Function,
  onSelectionChange: Function,
  onSelectionDragStart: Function,
  onSelectionDrag: Function,
  onSelectionDragStop: Function,
  onSelectionContextMenu: Function,
  onSelectionStart: Function,
  onSelectionEnd: Function,
  onBeforeDelete: Function,
  connectionMode: String,
  connectionLineType: String,
  connectionLineStyle: Object,
  connectionLineComponent: [Object, Function],
  connectionLineContainerStyle: Object,
  deleteKeyCode: String,
  selectionKeyCode: String,
  selectionOnDrag: Boolean,
  selectionMode: String,
  panActivationKeyCode: String,
  multiSelectionKeyCode: String,
  zoomActivationKeyCode: String,
  snapToGrid: Boolean,
  snapGrid: Array,
  onlyRenderVisibleElements: Boolean,
  selectNodesOnDrag: Boolean,
  nodesDraggable: Boolean,
  nodesConnectable: Boolean,
  nodesFocusable: Boolean,
  nodeOrigin: {
    type: Array,
    default: () => defaultNodeOrigin,
  },
  edgesFocusable: Boolean,
  edgesReconnectable: Boolean,
  elementsSelectable: Boolean,
  defaultViewport: {
    type: Object,
    default: () => initViewport,
  },
  minZoom: Number,
  maxZoom: Number,
  translateExtent: Array,
  preventScrolling: Boolean,
  nodeExtent: Array,
  defaultMarkerColor: String,
  zoomOnScroll: Boolean,
  zoomOnPinch: Boolean,
  panOnScroll: Boolean,
  panOnScrollSpeed: Number,
  panOnScrollMode: String,
  zoomOnDoubleClick: Boolean,
  panOnDrag: Boolean,
  onPaneClick: Function,
  onPaneMouseEnter: Function,
  onPaneMouseMove: Function,
  onPaneMouseLeave: Function,
  onPaneScroll: Function,
  onPaneContextMenu: Function,
  paneClickDistance: Number,
  nodeClickDistance: Number,
  onReconnect: Function,
  onReconnectStart: Function,
  onReconnectEnd: Function,
  onEdgeContextMenu: Function,
  onEdgeDoubleClick: Function,
  onEdgeMouseEnter: Function,
  onEdgeMouseMove: Function,
  onEdgeMouseLeave: Function,
  reconnectRadius: Number,
  onNodesChange: Function,
  onEdgesChange: Function,
  noDragClassName: String,
  noWheelClassName: String,
  noPanClassName: String,
  fitView: Boolean,
  fitViewOptions: Object,
  connectOnClick: Boolean,
  attributionPosition: String,
  proOptions: Object,
  defaultEdgeOptions: Object,
  elevateNodesOnSelect: Boolean,
  elevateEdgesOnSelect: Boolean,
  disableKeyboardA11y: Boolean,
  autoPanOnConnect: Boolean,
  autoPanOnNodeDrag: Boolean,
  autoPanSpeed: Number,
  connectionRadius: Number,
  isValidConnection: Function,
  onError: Function,
  style: Object,
  id: String,
  nodeDragThreshold: Number,
  viewport: Object,
  onViewportChange: Function,
  width: Number,
  height: Number,
  colorMode: { type: String, default: 'light' },
  debug: Boolean,
  onScroll: Function,
});

const restAttrs = useAttrs();
const wrapperRef = ref<HTMLDivElement | null>(null);
const rfId = computed(() => props.id || '1');
const colorModeClassName = useColorModeClass(props.colorMode);

const wrapperStyle = {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  zIndex: 0,
};

function wrapperOnScroll(e: Event) {
  const target = e.target as HTMLDivElement;
  target.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  props.onScroll?.(e);
}
</script>

<style scoped>
.react-flow {
  /* 可自定义样式 */
}
</style>
