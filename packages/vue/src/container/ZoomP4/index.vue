<script setup lang="ts">
import { ref, watchEffect, onMounted, onUnmounted } from 'vue';
import { XYPanZoom, PanOnScrollMode, type Transform, type PanZoomInstance } from '@xyflow/system';
import { useKeyPress } from '../../hooks/useKeyPress';
import { useResizeHandler } from '../../hooks/useResizeHandler';
import { useStore, useStoreApi } from '../../hooks/useStore';
import { containerStyle } from '../../styles/utils';
import type { FlowRendererProps } from '../FlowRenderer/types';
import type { VueFlowState } from '../../types';

interface ZoomPaneProps
  extends Omit<
    FlowRendererProps,
    | 'deleteKeyCode'
    | 'selectionKeyCode'
    | 'multiSelectionKeyCode'
    | 'noDragClassName'
    | 'disableKeyboardA11y'
    | 'selectionOnDrag'
  > {
  isControlledViewport: boolean;
}

const props = defineProps<ZoomPaneProps>();
const store = useStoreApi();
const zoomPane = ref<HTMLDivElement>(null);
const { userSelectionActive, lib } = useStore((s: VueFlowState) => ({
  userSelectionActive: s.userSelectionActive,
  lib: s.lib,
}));
const zoomActivationKeyPressed = useKeyPress(props.zoomActivationKeyCode);
const panZoom = ref<PanZoomInstance>();

useResizeHandler(zoomPane);

const onTransformChange = (transform: Transform) => {
  props.onViewportChange?.({ x: transform[0], y: transform[1], zoom: transform[2] });
  if (!props.isControlledViewport) {
    store.setState({ transform });
  }
};

onMounted(() => {
  if (zoomPane.value) {
    panZoom.value = XYPanZoom({
      domNode: zoomPane.value,
      minZoom: props.minZoom,
      maxZoom: props.maxZoom,
      translateExtent: props.translateExtent,
      viewport: props.defaultViewport,
      paneClickDistance: props.paneClickDistance,
      onDraggingChange: (paneDragging: boolean) => store.setState({ paneDragging }),
      onPanZoomStart: (event, vp) => {
        const { onViewportChangeStart, onMoveStart } = store.getState();
        onMoveStart?.(event, vp);
        onViewportChangeStart?.(vp);
      },
      onPanZoom: (event, vp) => {
        const { onViewportChange, onMove } = store.getState();
        onMove?.(event, vp);
        onViewportChange?.(vp);
      },
      onPanZoomEnd: (event, vp) => {
        const { onViewportChangeEnd, onMoveEnd } = store.getState();
        onMoveEnd?.(event, vp);
        onViewportChangeEnd?.(vp);
      },
    });

    const { x, y, zoom } = panZoom.value.getViewport();
    store.setState({
      panZoom: panZoom.value,
      transform: [x, y, zoom],
      domNode: zoomPane.value.closest('.vue-flow') as HTMLDivElement,
    });
  }
});

onUnmounted(() => {
  panZoom.value?.destroy();
});

watchEffect(() => {
  panZoom.value?.update({
    onPaneContextMenu: props.onPaneContextMenu,
    zoomOnScroll: props.zoomOnScroll,
    zoomOnPinch: props.zoomOnPinch,
    panOnScroll: props.panOnScroll,
    panOnScrollSpeed: props.panOnScrollSpeed,
    panOnScrollMode: props.panOnScrollMode,
    zoomOnDoubleClick: props.zoomOnDoubleClick,
    panOnDrag: props.panOnDrag,
    zoomActivationKeyPressed,
    preventScrolling: props.preventScrolling,
    noPanClassName: props.noPanClassName,
    userSelectionActive,
    noWheelClassName: props.noWheelClassName,
    lib,
    onTransformChange,
  });
});
</script>

<template>
  <div class="vue-flow__renderer" ref="zoomPane" :style="containerStyle">
    <slot />
  </div>
</template>
