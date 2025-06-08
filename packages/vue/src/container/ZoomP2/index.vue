<!-- filepath: /Users/miller/myprojects/xyflow/packages/vue/src/container/ZoomPane/index.vue -->
<template>
  <div class="react-flow__renderer" ref="zoomPane" :style="containerStyle" @contextmenu="onPaneContextMenu">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { XYPanZoom, PanOnScrollMode, type Transform, type PanZoomInstance } from '@xyflow/system';
import { useKeyPress } from '../../hooks/useKeyPress';
import { useResizeHandler } from '../../hooks/useResizeHandler';
import { useStore, useStoreApi } from '../../hooks/useStore';
import { containerStyle as baseContainerStyle } from '../../styles/utils';

const props = defineProps({
  onPaneContextMenu: Function,
  zoomOnScroll: { type: Boolean, default: true },
  zoomOnPinch: { type: Boolean, default: true },
  panOnScroll: { type: Boolean, default: false },
  panOnScrollSpeed: { type: Number, default: 0.5 },
  panOnScrollMode: { type: String, default: PanOnScrollMode.Free },
  zoomOnDoubleClick: { type: Boolean, default: true },
  panOnDrag: { type: Boolean, default: true },
  defaultViewport: Object,
  translateExtent: {
    type: Array,
    required: false,
    default: () => [
      [-Infinity, -Infinity],
      [Infinity, Infinity],
    ],
  },
  minZoom: Number,
  maxZoom: Number,
  zoomActivationKeyCode: String,
  preventScrolling: { type: Boolean, default: true },
  noWheelClassName: String,
  noPanClassName: String,
  onViewportChange: Function,
  isControlledViewport: { type: Boolean, default: false },
  paneClickDistance: Number,
});

const store = useStoreApi();
const zoomPane = ref<HTMLElement | null>(null);
const panZoom = ref<PanZoomInstance | null>(null);

const selector = (s: any) => ({
  userSelectionActive: s.userSelectionActive,
  lib: s.lib,
});
const { userSelectionActive, lib } = useStore(selector).value;

const zoomActivationKeyPressed = useKeyPress(props.zoomActivationKeyCode);
useResizeHandler(zoomPane);

const containerStyle = computed(() => ({
  ...baseContainerStyle,
}));

function onTransformChange(transform: Transform) {
  props.onViewportChange?.({ x: transform[0], y: transform[1], zoom: transform[2] });
  if (!props.isControlledViewport) {
    store.setState({ transform });
  }
}

onMounted(() => {
  nextTick(() => {
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
        domNode: zoomPane.value.closest('.vue-flow'),
      });
    }
  });
});

onUnmounted(() => {
  panZoom.value?.destroy();
});

watch(
  () => [
    props.onPaneContextMenu,
    props.zoomOnScroll,
    props.zoomOnPinch,
    props.panOnScroll,
    props.panOnScrollSpeed,
    props.panOnScrollMode,
    props.zoomOnDoubleClick,
    props.panOnDrag,
    zoomActivationKeyPressed.value,
    props.preventScrolling,
    props.noPanClassName,
    userSelectionActive,
    props.noWheelClassName,
    lib,
    onTransformChange,
  ],
  () => {
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
      userSelectionActive,
      noWheelClassName: props.noWheelClassName,
      lib,
      onTransformChange,
    });
  }
);
</script>

<style scoped>
.react-flow__renderer {
  /* 可自定义样式 */
}
</style>
