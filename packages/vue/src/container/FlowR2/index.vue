<template>
  <ZoomPane
    :elements-selectable="elementsSelectable"
    :zoom-on-scroll="zoomOnScroll"
    :zoom-on-pinch="zoomOnPinch"
    :pan-on-scroll="panOnScroll"
    :pan-on-scroll-speed="panOnScrollSpeed"
    :pan-on-scroll-mode="panOnScrollMode"
    :zoom-on-double-click="zoomOnDoubleClick"
    :pan-on-drag="panOnDrag"
    :default-viewport="defaultViewport"
    :translate-extent="translateExtent"
    :min-zoom="minZoom"
    :max-zoom="maxZoom"
    :zoom-activation-key-code="zoomActivationKeyCode"
    :prevent-scrolling="preventScrolling"
    :no-wheel-class-name="noWheelClassName"
    :no-pan-class-name="noPanClassName"
    :on-viewport-change="onViewportChange"
    :is-controlled-viewport="isControlledViewport"
    :pane-click-distance="paneClickDistance"
  >
    <Pane
      :on-selection-start="onSelectionStart"
      :on-selection-end="onSelectionEnd"
      :on-pane-click="onPaneClick"
      :on-pane-mouse-enter="onPaneMouseEnter"
      :on-pane-mouse-move="onPaneMouseMove"
      :on-pane-mouse-leave="onPaneMouseLeave"
      :on-pane-context-menu="onPaneContextMenu"
      :on-pane-scroll="onPaneScroll"
      :pan-on-drag="panOnDrag"
      :is-selecting="isSelecting"
      :selection-mode="selectionMode"
      :selection-key-pressed="selectionKeyPressed"
      :selection-on-drag="selectionOnDrag"
    >
      <slot />
      <NodesSelection
        v-if="nodesSelectionActive"
        :on-selection-context-menu="onSelectionContextMenu"
        :no-pan-class-name="noPanClassName"
        :disable-keyboard-a11y="disableKeyboardA11y"
      />
    </Pane>
  </ZoomPane>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../../hooks/useStore';
import { useGlobalKeyHandler } from '../../hooks/useGlobalKeyHandler';
import { useKeyPress } from '../../hooks/useKeyPress';
import { default as ZoomPane } from '../ZoomPane/index.vue';
import { default as Pane } from '../Pane/index.vue';
import { default as NodesSelection } from '../../components/NodesSelection/index.vue';
import type { Node } from '../../types';

const props = defineProps<{
  onPaneClick?: (event: MouseEvent) => void;
  onPaneMouseEnter?: (event: MouseEvent) => void;
  onPaneMouseMove?: (event: MouseEvent) => void;
  onPaneMouseLeave?: (event: MouseEvent) => void;
  onPaneContextMenu?: (event: MouseEvent) => void;
  onPaneScroll?: (event: WheelEvent) => void;
  paneClickDistance: number;
  deleteKeyCode: string | null;
  selectionKeyCode: string | null;
  selectionOnDrag: boolean;
  selectionMode: 'partial' | 'full';
  onSelectionStart?: (event: MouseEvent) => void;
  onSelectionEnd?: (event: MouseEvent) => void;
  multiSelectionKeyCode: string | null;
  panActivationKeyCode: string | null;
  zoomActivationKeyCode: string | null;
  elementsSelectable: boolean;
  zoomOnScroll: boolean;
  zoomOnPinch: boolean;
  panOnScroll: boolean;
  panOnScrollSpeed: number;
  panOnScrollMode: 'free' | 'horizontal' | 'vertical';
  zoomOnDoubleClick: boolean;
  panOnDrag: boolean;
  defaultViewport: { x: number; y: number; zoom: number };
  translateExtent: [[number, number], [number, number]];
  minZoom: number;
  maxZoom: number;
  preventScrolling: boolean;
  onSelectionContextMenu?: (event: MouseEvent) => void;
  noWheelClassName: string;
  noPanClassName: string;
  disableKeyboardA11y: boolean;
  onViewportChange?: (viewport: { x: number; y: number; zoom: number }) => void;
  isControlledViewport: boolean;
}>();

const store = useStore();
const { nodesSelectionActive, userSelectionActive } = store;
const selectionKeyPressed = useKeyPress(props.selectionKeyCode);
const panActivationKeyPressed = useKeyPress(props.panActivationKeyCode);

const panOnDrag = computed(() => panActivationKeyPressed.value || props.panOnDrag);
const panOnScroll = computed(() => panActivationKeyPressed.value || props.panOnScroll);
const selectionOnDrag = computed(() => props.selectionOnDrag && panOnDrag.value !== true);
const isSelecting = computed(
  () => (selectionKeyPressed?.value ?? false) || (userSelectionActive?.value ?? false) || selectionOnDrag.value
);

useGlobalKeyHandler({
  deleteKeyCode: props.deleteKeyCode,
  multiSelectionKeyCode: props.multiSelectionKeyCode,
});
</script>
