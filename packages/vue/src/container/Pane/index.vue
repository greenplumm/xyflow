<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';

import { useStore, useStoreApi } from '../../hooks/useStore';
import { getNodesInside, getEventPosition, areSetsEqual } from '@xyflow/system';
import { getSelectionChanges } from '../../utils/selection';
import UserSelection from '../../components/UserSelection';

const props = defineProps<{
  isSelecting: boolean;
  selectionKeyPressed: boolean;
  selectionMode?: number;
  panOnDrag?: boolean | number[];
  selectionOnDrag?: boolean;
  onSelectionStart?: (e: PointerEvent) => void;
  onSelectionEnd?: (e: PointerEvent) => void;
}>();

const store = useStoreApi();
const container = ref<HTMLElement>();
const containerBounds = ref<DOMRect>();
const selectedNodeIds = ref<Set<string>>(new Set());
const selectedEdgeIds = ref<Set<string>>(new Set());
const selectionInProgress = ref(false);
const selectionStarted = ref(false);

const slice = useStore((s) => ({
  userSelectionActive: s.userSelectionActive,
  elementsSelectable: s.elementsSelectable,
  dragging: s.paneDragging,
}));
// const { userSelectionActive, elementsSelectable, dragging }
const userSelectionActive = computed(() => slice.value.userSelectionActive);
const elementsSelectable = computed(() => slice.value.elementsSelectable);
const dragging = computed(() => slice.value.dragging);
const isSelecting = computed(() => props.isSelecting && props.selectionKeyPressed);

const hasActiveSelection = elementsSelectable && (isSelecting || userSelectionActive);

const handlePointerDown = (e: PointerEvent) => {
  if (!container.value) return;

  containerBounds.value = container.value.getBoundingClientRect();

  if (!elementsSelectable.value || !props.isSelecting || (e.target as Element) !== container.value) return;

  selectionStarted.value = true;
  selectionInProgress.value = false;

  const { x, y } = getEventPosition(e, containerBounds.value);
  store.getState().resetSelectedElements();

  store.setState({
    userSelectionRect: {
      width: 0,
      height: 0,
      startX: x,
      startY: y,
      x,
      y,
    },
  });

  props.onSelectionStart?.(e);
};

const handlePointerMove = (e: PointerEvent) => {
  if (!containerBounds.value || !store.getState().userSelectionRect) return;

  selectionInProgress.value = true;
  const { nodeLookup, edgeLookup, connectionLookup, defaultEdgeOptions } = store.getState();
  const { x: mouseX, y: mouseY } = getEventPosition(e, containerBounds.value);
  const { startX, startY } = store.getState().userSelectionRect!;

  const nextRect = {
    startX,
    startY,
    x: Math.min(mouseX, startX),
    y: Math.min(mouseY, startY),
    width: Math.abs(mouseX - startX),
    height: Math.abs(mouseY - startY),
  };

  const newNodes = new Set(
    getNodesInside(nodeLookup, nextRect, store.getState().transform, props.selectionMode === 1).map((n) => n.id)
  );

  const newEdges = new Set<string>();
  const edgesSelectable = defaultEdgeOptions?.selectable ?? true;

  newNodes.forEach((nodeId) => {
    connectionLookup.get(nodeId)?.forEach(({ edgeId }) => {
      const edge = edgeLookup.get(edgeId);
      if (edge?.selectable ?? edgesSelectable) newEdges.add(edgeId);
    });
  });

  if (!areSetsEqual(selectedNodeIds.value, newNodes)) {
    const changes = getSelectionChanges(nodeLookup, newNodes, true);
    store.getState().triggerNodeChanges(changes as NodeChange[]);
  }

  if (!areSetsEqual(selectedEdgeIds.value, newEdges)) {
    const changes = getSelectionChanges(edgeLookup, newEdges);
    store.getState().triggerEdgeChanges(changes as EdgeChange[]);
  }

  selectedNodeIds.value = newNodes;
  selectedEdgeIds.value = newEdges;

  store.setState({
    userSelectionRect: nextRect,
    userSelectionActive: true,
    nodesSelectionActive: false,
  });
};

const wrapHandler = (handler?: (e: Event) => void) => (e: Event) => {
  if (e.target !== container.value) return;
  handler?.(e);
};

const onClick = (e: MouseEvent) => {
  if (selectionInProgress.value) {
    selectionInProgress.value = false;
    return;
  }
  wrapHandler(props.onPaneClick)(e);
  store.getState().resetSelectedElements();
  store.setState({ nodesSelectionActive: false });
};

const onContextMenu = (e: MouseEvent) => {
  if (Array.isArray(props.panOnDrag) && props.panOnDrag?.includes(2)) {
    e.preventDefault();
    return;
  }
  wrapHandler(props.onPaneContextMenu)(e);
};

const handlePointerUp = (e: PointerEvent) => {
  if (!selectionStarted.value) return;

  if (!userSelectionActive.value && store.getState().userSelectionRect) {
    onClick(e as unknown as MouseEvent);
  }

  selectionStarted.value = false;
  store.setState({
    userSelectionActive: false,
    userSelectionRect: null,
    nodesSelectionActive: selectedNodeIds.value.size > 0,
  });

  props.onSelectionEnd?.(e);
  if (props.selectionKeyPressed || props.selectionOnDrag) {
    selectionInProgress.value = false;
  }
};
</script>

<template>
  <div
    ref="container"
    class="react-flow__pane"
    :class="[
      'vue-flow__pane',
      {
        draggable: panOnDrag === true || (Array.isArray(panOnDrag) && panOnDrag.includes(0)),
        dragging,
        selection: isSelecting,
      },
    ]"
    @click="hasActiveSelection ? undefined : onClick"
    @contextmenu="wrapHandler(onContextMenu)"
    @wheel="wrapHandler(props.onPaneScroll)"
    @pointerenter="hasActiveSelection ? undefined : props.onPaneMouseEnter"
    @pointerdown="hasActiveSelection ? handlePointerDown : props.onPaneMouseMove"
    @pointermove="hasActiveSelection ? handlePointerMove : props.onPaneMouseMove"
    @pointerup="hasActiveSelection ? handlePointerUp : undefined"
    @pointerleave="props.onPaneMouseLeave"
  >
    <slot />
    <UserSelection />
  </div>
</template>
