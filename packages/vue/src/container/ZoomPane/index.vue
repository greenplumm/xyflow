<script setup lang="ts">
import { ref, watchEffect, computed, onMounted } from 'vue';
import { XYPanZoom, PanOnScrollMode, type Transform, type PanZoomInstance } from '@xyflow/system';
import { useKeyPress } from '../../hooks/useKeyPress';
import { useResizeHandler } from '../../hooks/useResizeHandler';
import { useStore, useStoreApi } from '../../hooks/useStore';
import { containerStyle } from '../../styles/utils';
import type { FlowRendererProps } from '../FlowRenderer';
import type { VueFlowState, CoordinateExtent } from '../../types';

interface ZoomPaneProps
  extends /* @vue-ignore */ Omit<
    FlowRendererProps,
    | 'deleteKeyCode'
    | 'selectionKeyCode'
    | 'multiSelectionKeyCode'
    | 'noDragClassName'
    | 'disableKeyboardA11y'
    | 'selectionOnDrag'
  > {
  isControlledViewport: boolean;
  translateExtent: CoordinateExtent;
  defaultViewport;
  paneClickDistance;
  onPaneContextMenu;
  zoomOnScroll;
  zoomOnPinch;
  panOnScroll;
  panOnScrollSpeed;
  panOnScrollMode;
  zoomOnDoubleClick;
  panOnDrag;
  preventScrolling;
  noPanClassName;
  noWheelClassName;
}

const props = defineProps<ZoomPaneProps>();

const selector = (s: VueFlowState) => ({
  userSelectionActive: s.userSelectionActive,
  lib: s.lib,
});

const store = useStoreApi();
const zoomPane = ref<HTMLDivElement>();
const slice = useStore(selector);
const userSelectionActive = computed(() => slice.value.node);
const lib = computed(() => slice.value.internals);

const zoomActivationKeyPressed = useKeyPress(props.zoomActivationKeyCode);
const panZoom = ref<PanZoomInstance>();

onMounted(() => {
  useResizeHandler({ element: zoomPane.value });
});

const onTransformChange = (transform: Transform) => {
  props.onViewportChange?.({ x: transform[0], y: transform[1], zoom: transform[2] });

  if (!props.isControlledViewport) {
    store.setState({ transform });
  }
};

watchEffect(() => {
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

    return () => {
      panZoom.value?.destroy();
    };
  }
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
    zoomActivationKeyPressed: zoomActivationKeyPressed.value,
    preventScrolling: props.preventScrolling,
    noPanClassName: props.noPanClassName,
    userSelectionActive: userSelectionActive.value,
    noWheelClassName: props.noWheelClassName,
    lib: lib.value,
    onTransformChange,
  });
});
</script>

<template>
  <div class="vue-flow__renderer" ref="zoomPane" :style="containerStyle">
    <slot />
  </div>
</template>
