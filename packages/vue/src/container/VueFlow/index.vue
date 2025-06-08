<template>
  <div
    data-testid="vf__wrapper"
    :style="wrapperStyle"
    @scroll="handleScroll"
    :class="cc(['vue-flow', className, colorModeClass])"
    :id="id"
  >
    <Wrapper
      :nodes="nodes"
      :edges="edges"
      :defaultNodes="defaultNodes"
      :defaultEdges="defaultEdges"
      :width="width"
      :height="height"
      :fitView="fitView"
      :nodeOrigin="nodeOrigin"
      :nodeExtent="nodeExtent"
    >
      <GraphView
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
        :translateExtent="props.translateExtent"
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
        :paneClickDistance="paneClickDistance"
        :nodeClickDistance="nodeClickDistance"
        :reconnectRadius="reconnectRadius"
        :defaultMarkerColor="defaultMarkerColor"
        :noDragClassName="noDragClassName"
        :noWheelClassName="noWheelClassName"
        :noPanClassName="noPanClassName"
        :rfId="rfId"
        :disableKeyboardA11y="disableKeyboardA11y"
        :nodeExtent="nodeExtent"
        :viewport="viewport"
        @init="onInit"
        @nodeClick="onNodeClick"
        @edgeClick="onEdgeClick"
        @nodeMouseEnter="onNodeMouseEnter"
        @nodeMouseMove="onNodeMouseMove"
        @nodeMouseLeave="onNodeMouseLeave"
        @nodeContextMenu="onNodeContextMenu"
        @nodeDoubleClick="onNodeDoubleClick"
        @selectionContextMenu="onSelectionContextMenu"
        @selectionStart="onSelectionStart"
        @selectionEnd="onSelectionEnd"
        @reconnect="onReconnect"
        @reconnectStart="onReconnectStart"
        @reconnectEnd="onReconnectEnd"
        @edgeContextMenu="onEdgeContextMenu"
        @edgeDoubleClick="onEdgeDoubleClick"
        @edgeMouseEnter="onEdgeMouseEnter"
        @edgeMouseMove="onEdgeMouseMove"
        @edgeMouseLeave="onEdgeMouseLeave"
        @paneClick="onPaneClick"
        @paneMouseEnter="onPaneMouseEnter"
        @paneMouseMove="onPaneMouseMove"
        @paneMouseLeave="onPaneMouseLeave"
        @paneScroll="onPaneScroll"
        @paneContextMenu="onPaneContextMenu"
        @viewportChange="onViewportChange"
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
        :translateExtent="props.translateExtent"
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
      <A11yDescriptions :rfId="rfId" :disableKeyboardA11y="disableKeyboardA11y" />
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import cc from 'classcat';
import { ConnectionLineType, PanOnScrollMode, SelectionMode, infiniteExtent, isMacOs } from '@xyflow/system';
import { default as A11yDescriptions } from '../../components/A11yDescriptions/index.vue';
import { default as Attribution } from '../../components/Attribution/index.vue';
import { default as SelectionListener } from '../../components/SelectionListener/index.vue';
import StoreUpdater from '../../components/StoreUpdater/index.vue';
import { useColorModeClass } from '../../hooks/useColorModeClass';
import { default as GraphView } from '../GraphView/index.vue';
import { default as Wrapper } from './Wrapper.vue';
import type { Edge, Node, VueFlowProps } from '../../types';
import { defaultViewport as initViewport, defaultNodeOrigin } from './init-values';

const props = withDefaults(defineProps<VueFlowProps>(), {
  connectionLineType: ConnectionLineType.Bezier,
  deleteKeyCode: 'Backspace',
  selectionKeyCode: 'Shift',
  selectionOnDrag: false,
  selectionMode: SelectionMode.Full,
  panActivationKeyCode: 'Space',
  multiSelectionKeyCode: isMacOs() ? 'Meta' : 'Control',
  zoomActivationKeyCode: isMacOs() ? 'Meta' : 'Control',
  onlyRenderVisibleElements: false,
  selectNodesOnDrag: true,
  nodesDraggable: true,
  nodesConnectable: true,
  width: 0,
  height: 0,
  nodesFocusable: true,
  nodeOrigin: defaultNodeOrigin,
  edgesFocusable: true,
  edgesReconnectable: true,
  elementsSelectable: true,
  defaultViewport: initViewport,
  minZoom: 0.5,
  maxZoom: 2,
  translateExtent: infiniteExtent,
  preventScrolling: true,
  defaultMarkerColor: '#b1b1b7',
  zoomOnScroll: true,
  zoomOnPinch: true,
  panOnScroll: false,
  panOnScrollSpeed: 0.5,
  panOnScrollMode: PanOnScrollMode.Free,
  zoomOnDoubleClick: true,
  panOnDrag: true,
  paneClickDistance: 0,
  nodeClickDistance: 0,
  reconnectRadius: 10,
  noDragClassName: 'nodrag',
  noWheelClassName: 'nowheel',
  noPanClassName: 'nopan',
  connectOnClick: false,
  elevateNodesOnSelect: true,
  elevateEdgesOnSelect: true,
  disableKeyboardA11y: false,
  autoPanOnConnect: false,
  autoPanOnNodeDrag: false,
  autoPanSpeed: 1,
  connectionRadius: 20,
  nodeDragThreshold: 0,
  colorMode: 'light',
  debug: false,
});

const rfId = props.id || '1';
const colorModeClass = useColorModeClass(props.colorMode);

const wrapperStyle = computed(() => ({
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  zIndex: 0,
  ...props.style,
}));

const handleScroll = (e: UIEvent) => {
  const target = e.target as HTMLDivElement;
  target.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  props.onScroll?.(e);
};
</script>
