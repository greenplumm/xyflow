<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../../hooks/useStore';
import { useKeyPress } from '../../hooks/useKeyPress';
import { useGlobalKeyHandler } from '../../hooks/useGlobalKeyHandler';
import { default as ZoomPane } from '../ZoomPane/index.vue';
import { default as Pane } from '../Pane/index.vue';
import { default as NodesSelection } from '../../components/NodesSelection/index.vue';
import type { Node, VueFlowState, CoordinateExtent, Viewport } from '../../types';

const props = defineProps<{
  isControlledViewport: boolean;
  onPaneClick?: (e: MouseEvent) => void;
  onPaneMouseEnter?: (e: MouseEvent) => void;
  onPaneMouseMove?: (e: MouseEvent) => void;
  onPaneMouseLeave?: (e: MouseEvent) => void;
  onPaneContextMenu?: (e: MouseEvent) => void;
  onPaneScroll?: (e: WheelEvent) => void;
  paneClickDistance?: number;
  deleteKeyCode?: string | null;
  selectionKeyCode?: string | null;
  selectionOnDrag?: boolean;
  selectionMode?: number;
  onSelectionStart?: (e: PointerEvent) => void;
  onSelectionEnd?: (e: PointerEvent) => void;
  multiSelectionKeyCode?: string | null;
  panActivationKeyCode?: string | null;
  zoomActivationKeyCode?: string | null;
  elementsSelectable?: boolean;
  zoomOnScroll?: boolean;
  zoomOnPinch?: boolean;
  panOnScroll?: boolean;
  panOnScrollSpeed?: number;
  panOnScrollMode?: number;
  zoomOnDoubleClick?: boolean;
  panOnDrag?: boolean | number[];
  defaultViewport?: Viewport;
  translateExtent?: CoordinateExtent;
  minZoom?: number;
  maxZoom?: number;
  preventScrolling?: boolean;
  onSelectionContextMenu?: (e: MouseEvent) => void;
  noWheelClassName?: string;
  noPanClassName?: string;
  disableKeyboardA11y?: boolean;
  onViewportChange?: (viewport: Viewport) => void;
}>();

const selector = (s: VueFlowState) => {
  return { nodesSelectionActive: s.nodesSelectionActive, userSelectionActive: s.userSelectionActive };
};
const { nodesSelectionActive, userSelectionActive } = useStore(selector);

const selectionKeyPressed = useKeyPress(props.selectionKeyCode);
const panActivationKeyPressed = useKeyPress(props.panActivationKeyCode);

const panOnDrag = computed(() => panActivationKeyPressed.value || props.panOnDrag);
const panOnScroll = computed(() => panActivationKeyPressed.value || props.panOnScroll);
const selectionOnDrag = computed(() => props.selectionOnDrag && panOnDrag.value !== true);
const isSelecting = computed(() => selectionKeyPressed?.value || userSelectionActive?.value || selectionOnDrag?.value);

useGlobalKeyHandler({
  deleteKeyCode: props.deleteKeyCode,
  multiSelectionKeyCode: props.multiSelectionKeyCode,
});
</script>

<template>
  <ZoomPane
    :on-pane-context-menu="props.onPaneContextMenu"
    :elements-selectable="props.elementsSelectable"
    :zoom-on-scroll="props.zoomOnScroll"
    :zoom-on-pinch="props.zoomOnPinch"
    :pan-on-scroll="panOnScroll"
    :pan-on-scroll-speed="props.panOnScrollSpeed"
    :pan-on-scroll-mode="props.panOnScrollMode"
    :zoom-on-double-click="props.zoomOnDoubleClick"
    :pan-on-drag="!selectionKeyPressed && panOnDrag"
    :default-viewport="props.defaultViewport"
    :translate-extent="props.translateExtent"
    :min-zoom="props.minZoom"
    :max-zoom="props.maxZoom"
    :zoom-activation-key-code="props.zoomActivationKeyCode"
    :prevent-scrolling="props.preventScrolling"
    :no-wheel-class-name="props.noWheelClassName"
    :no-pan-class-name="props.noPanClassName"
    :on-viewport-change="props.onViewportChange"
    :is-controlled-viewport="props.isControlledViewport"
    :pane-click-distance="props.paneClickDistance"
  >
    <Pane
      :on-selection-start="props.onSelectionStart"
      :on-selection-end="props.onSelectionEnd"
      :on-pane-click="props.onPaneClick"
      :on-pane-mouse-enter="props.onPaneMouseEnter"
      :on-pane-mouse-move="props.onPaneMouseMove"
      :on-pane-mouse-leave="props.onPaneMouseLeave"
      :on-pane-context-menu="props.onPaneContextMenu"
      :on-pane-scroll="props.onPaneScroll"
      :pan-on-drag="panOnDrag"
      :is-selecting="!!isSelecting"
      :selection-mode="props.selectionMode"
      :selection-key-pressed="selectionKeyPressed"
      :selection-on-drag="selectionOnDrag"
    >
      <slot />
      <NodesSelection
        v-if="nodesSelectionActive"
        :on-selection-context-menu="props.onSelectionContextMenu"
        :no-pan-class-name="props.noPanClassName"
        :disable-keyboard-a11y="props.disableKeyboardA11y"
      />
    </Pane>
  </ZoomPane>
</template>
