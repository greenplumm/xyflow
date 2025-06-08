<script setup lang="ts">
import { default as FlowRenderer } from '../FlowRenderer/index.vue';
import { default as NodeRenderer } from '../NodeRenderer/index.vue';
import { default as EdgeRenderer } from '../EdgeRenderer/index.vue';
import { default as Viewport } from '../Viewport/index.vue';
import { useOnInitHandler } from '../../hooks/useOnInitHandler';
import { useViewportSync } from '../../hooks/useViewportSync';
import { default as ConnectionLineWrapper } from '../../components/ConnectionLine/index.vue';
import { useNodeOrEdgeTypesWarning } from './useNodeOrEdgeTypesWarning';
import useStylesLoadedWarning from './useStylesLoadedWarning';
import type { Edge, Node, VueFlowProps } from '../../types';

const props = defineProps<{
  nodeTypes?: VueFlowProps['nodeTypes'];
  edgeTypes?: VueFlowProps['edgeTypes'];
  onInit?: VueFlowProps['onInit'];
  onNodeClick?: VueFlowProps['onNodeClick'];
  onEdgeClick?: VueFlowProps['onEdgeClick'];
  onNodeDoubleClick?: VueFlowProps['onNodeDoubleClick'];
  onEdgeDoubleClick?: VueFlowProps['onEdgeDoubleClick'];
  onNodeMouseEnter?: VueFlowProps['onNodeMouseEnter'];
  onNodeMouseMove?: VueFlowProps['onNodeMouseMove'];
  onNodeMouseLeave?: VueFlowProps['onNodeMouseLeave'];
  onNodeContextMenu?: VueFlowProps['onNodeContextMenu'];
  onSelectionContextMenu?: VueFlowProps['onSelectionContextMenu'];
  onSelectionStart?: VueFlowProps['onSelectionStart'];
  onSelectionEnd?: VueFlowProps['onSelectionEnd'];
  connectionLineType?: VueFlowProps['connectionLineType'];
  connectionLineStyle?: VueFlowProps['connectionLineStyle'];
  connectionLineComponent?: VueFlowProps['connectionLineComponent'];
  connectionLineContainerStyle?: VueFlowProps['connectionLineContainerStyle'];
  selectionKeyCode?: VueFlowProps['selectionKeyCode'];
  selectionOnDrag?: VueFlowProps['selectionOnDrag'];
  selectionMode?: VueFlowProps['selectionMode'];
  multiSelectionKeyCode?: VueFlowProps['multiSelectionKeyCode'];
  panActivationKeyCode?: VueFlowProps['panActivationKeyCode'];
  zoomActivationKeyCode?: VueFlowProps['zoomActivationKeyCode'];
  deleteKeyCode?: VueFlowProps['deleteKeyCode'];
  onlyRenderVisibleElements?: VueFlowProps['onlyRenderVisibleElements'];
  elementsSelectable?: VueFlowProps['elementsSelectable'];
  defaultViewport?: VueFlowProps['defaultViewport'];
  translateExtent?: VueFlowProps['translateExtent'];
  minZoom?: VueFlowProps['minZoom'];
  maxZoom?: VueFlowProps['maxZoom'];
  preventScrolling?: VueFlowProps['preventScrolling'];
  defaultMarkerColor?: VueFlowProps['defaultMarkerColor'];
  zoomOnScroll?: VueFlowProps['zoomOnScroll'];
  zoomOnPinch?: VueFlowProps['zoomOnPinch'];
  panOnScroll?: VueFlowProps['panOnScroll'];
  panOnScrollSpeed?: VueFlowProps['panOnScrollSpeed'];
  panOnScrollMode?: VueFlowProps['panOnScrollMode'];
  zoomOnDoubleClick?: VueFlowProps['zoomOnDoubleClick'];
  panOnDrag?: VueFlowProps['panOnDrag'];
  onPaneClick?: VueFlowProps['onPaneClick'];
  onPaneMouseEnter?: VueFlowProps['onPaneMouseEnter'];
  onPaneMouseMove?: VueFlowProps['onPaneMouseMove'];
  onPaneMouseLeave?: VueFlowProps['onPaneMouseLeave'];
  onPaneScroll?: VueFlowProps['onPaneScroll'];
  onPaneContextMenu?: VueFlowProps['onPaneContextMenu'];
  paneClickDistance?: VueFlowProps['paneClickDistance'];
  nodeClickDistance?: VueFlowProps['nodeClickDistance'];
  onEdgeContextMenu?: VueFlowProps['onEdgeContextMenu'];
  onEdgeMouseEnter?: VueFlowProps['onEdgeMouseEnter'];
  onEdgeMouseMove?: VueFlowProps['onEdgeMouseMove'];
  onEdgeMouseLeave?: VueFlowProps['onEdgeMouseLeave'];
  reconnectRadius?: VueFlowProps['reconnectRadius'];
  onReconnect?: VueFlowProps['onReconnect'];
  onReconnectStart?: VueFlowProps['onReconnectStart'];
  onReconnectEnd?: VueFlowProps['onReconnectEnd'];
  noDragClassName?: VueFlowProps['noDragClassName'];
  noWheelClassName?: VueFlowProps['noWheelClassName'];
  noPanClassName?: VueFlowProps['noPanClassName'];
  disableKeyboardA11y?: VueFlowProps['disableKeyboardA11y'];
  nodeExtent?: VueFlowProps['nodeExtent'];
  rfId: string;
  viewport?: VueFlowProps['viewport'];
  onViewportChange?: VueFlowProps['onViewportChange'];
}>();

useNodeOrEdgeTypesWarning(props.nodeTypes);
useNodeOrEdgeTypesWarning(props.edgeTypes);
useStylesLoadedWarning();

useOnInitHandler(props.onInit);
useViewportSync(props.viewport);
</script>

<template>
  <FlowRenderer
    :on-pane-click="props.onPaneClick"
    :on-pane-mouse-enter="props.onPaneMouseEnter"
    :on-pane-mouse-move="props.onPaneMouseMove"
    :on-pane-mouse-leave="props.onPaneMouseLeave"
    :on-pane-context-menu="props.onPaneContextMenu"
    :on-pane-scroll="props.onPaneScroll"
    :pane-click-distance="props.paneClickDistance"
    :delete-key-code="props.deleteKeyCode"
    :selection-key-code="props.selectionKeyCode"
    :selection-on-drag="props.selectionOnDrag"
    :selection-mode="props.selectionMode"
    :on-selection-start="props.onSelectionStart"
    :on-selection-end="props.onSelectionEnd"
    :multi-selection-key-code="props.multiSelectionKeyCode"
    :pan-activation-key-code="props.panActivationKeyCode"
    :zoom-activation-key-code="props.zoomActivationKeyCode"
    :elements-selectable="props.elementsSelectable"
    :zoom-on-scroll="props.zoomOnScroll"
    :zoom-on-pinch="props.zoomOnPinch"
    :zoom-on-double-click="props.zoomOnDoubleClick"
    :pan-on-scroll="props.panOnScroll"
    :pan-on-scroll-speed="props.panOnScrollSpeed"
    :pan-on-scroll-mode="props.panOnScrollMode"
    :pan-on-drag="props.panOnDrag"
    :default-viewport="props.defaultViewport"
    :translate-extent="props.translateExtent"
    :min-zoom="props.minZoom"
    :max-zoom="props.maxZoom"
    :on-selection-context-menu="props.onSelectionContextMenu"
    :prevent-scrolling="props.preventScrolling"
    :no-drag-class-name="props.noDragClassName"
    :no-wheel-class-name="props.noWheelClassName"
    :no-pan-class-name="props.noPanClassName"
    :disable-keyboard-a11y="props.disableKeyboardA11y"
    :on-viewport-change="props.onViewportChange"
    :is-controlled-viewport="!!props.viewport"
  >
    <Viewport>
      <EdgeRenderer
        :edge-types="props.edgeTypes"
        :on-edge-click="props.onEdgeClick"
        :on-edge-double-click="props.onEdgeDoubleClick"
        :on-reconnect="props.onReconnect"
        :on-reconnect-start="props.onReconnectStart"
        :on-reconnect-end="props.onReconnectEnd"
        :only-render-visible-elements="props.onlyRenderVisibleElements"
        :on-edge-context-menu="props.onEdgeContextMenu"
        :on-edge-mouse-enter="props.onEdgeMouseEnter"
        :on-edge-mouse-move="props.onEdgeMouseMove"
        :on-edge-mouse-leave="props.onEdgeMouseLeave"
        :reconnect-radius="props.reconnectRadius"
        :default-marker-color="props.defaultMarkerColor"
        :no-pan-class-name="props.noPanClassName"
        :disable-keyboard-a11y="props.disableKeyboardA11y"
        :rf-id="props.rfId"
      />
      <ConnectionLineWrapper
        :style="props.connectionLineStyle"
        :type="props.connectionLineType"
        :component="props.connectionLineComponent"
        :container-style="props.connectionLineContainerStyle"
      />
      <div class="vue-flow__edgelabel-renderer" />
      <NodeRenderer
        :node-types="props.nodeTypes"
        :on-node-click="props.onNodeClick"
        :on-node-double-click="props.onNodeDoubleClick"
        :on-node-mouse-enter="props.onNodeMouseEnter"
        :on-node-mouse-move="props.onNodeMouseMove"
        :on-node-mouse-leave="props.onNodeMouseLeave"
        :on-node-context-menu="props.onNodeContextMenu"
        :node-click-distance="props.nodeClickDistance"
        :only-render-visible-elements="props.onlyRenderVisibleElements"
        :no-pan-class-name="props.noPanClassName"
        :no-drag-class-name="props.noDragClassName"
        :disable-keyboard-a11y="props.disableKeyboardA11y"
        :node-extent="props.nodeExtent"
        :rf-id="props.rfId"
      />
      <div class="vue-flow__viewport-portal" />
    </Viewport>
  </FlowRenderer>
</template>

<style>
.vue-flow__edgelabel-renderer,
.vue-flow__viewport-portal {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
</style>
