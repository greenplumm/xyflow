<script setup lang="ts">
import { ref, computed, onBeforeUnmount, provide } from 'vue';
import cc from 'classcat';
import { useStoreApi, useStore } from '../../hooks/useStore';
import { useDrag } from '../../hooks/useDrag';
import { handleNodeClick } from '../Nodes/utils';
import { useMoveSelectedNodes } from '../../hooks/useMoveSelectedNodes';
import { useNodeObserver } from './useNodeObserver';
import { arrowKeyDiffs, builtinNodeTypes, getNodeInlineStyleDimensions } from './utils';

import {
  elementSelectionKeys,
  errorMessages,
  getNodeDimensions,
  isInputDOMNode,
  nodeHasDimensions,
} from '@xyflow/system';
import { ARIA_NODE_DESC_KEY } from '../A11yDescriptions/constants';
import type { InternalNode, NodeWrapperProps } from '../../types';
import { provideNodeId as NodeIdProvider } from '../../contexts/NodeIdContext';

const props = defineProps<NodeWrapperProps>();
const {
  id,
  onClick,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  onContextMenu,
  onDoubleClick,
  nodesDraggable,
  elementsSelectable,
  nodesConnectable,
  nodesFocusable,
  resizeObserver,
  noDragClassName,
  noPanClassName,
  disableKeyboardA11y,
  rfId,
  nodeTypes,
  nodeClickDistance,
  onError,
} = props;
// provide node id for descendant components
provide('nodeId', id);
NodeIdProvider(id);
const store = useStoreApi();

const node = useStore((s) => s.nodeLookup.get(id)!);
const internals = useStore((s) => s.nodeLookup.get(id)!.internals);
const isParent = useStore((s) => s.parentLookup.has(id));

const nodeRef = ref(null);
let nodeType = computed(() => node.value.type || 'default');
let NodeComponent = computed(() => {
  const type = nodeType.value;
  const Comp = nodeTypes?.[type] || builtinNodeTypes[type];
  if (!Comp) {
    onError?.('003', errorMessages['error003'](type));
    return builtinNodeTypes.default;
  }
  return Comp;
});

const isDraggable = computed(() => !!(node.value.draggable ?? nodesDraggable));
const isSelectable = computed(() => !!(node.value.selectable ?? elementsSelectable));
const isConnectable = computed(() => !!(node.value.connectable ?? nodesConnectable));
const isFocusable = computed(() => !!(node.value.focusable ?? nodesFocusable));

const hasDimensions = computed(() => nodeHasDimensions(node.value));
useNodeObserver({
  nodeRef,
  node: node.value,
  nodeType,
  hasDimensions,
  resizeObserver,
});
const dragging = useDrag({
  nodeRef,
  disabled: node.value.hidden || !isDraggable,
  noDragClassName,
  handleSelector: node.value.dragHandle,
  nodeId: id,
  isSelectable: isSelectable.value,
  nodeClickDistance,
});
const moveSelectedNodes = useMoveSelectedNodes();

const onMouseEnterHandler = onMouseEnter ? (e: MouseEvent) => onMouseEnter(e, { ...internals.userNode }) : undefined;
const onMouseMoveHandler = onMouseMove ? (e: MouseEvent) => onMouseMove(e, { ...internals.userNode }) : undefined;
const onMouseLeaveHandler = onMouseLeave ? (e: MouseEvent) => onMouseLeave(e, { ...internals.userNode }) : undefined;
const onContextMenuHandler = onContextMenu ? (e: MouseEvent) => onContextMenu(e, { ...internals.userNode }) : undefined;
const onDoubleClickHandler = onDoubleClick ? (e: MouseEvent) => onDoubleClick(e, { ...internals.userNode }) : undefined;

function onSelectNodeHandler(e: MouseEvent) {
  const { selectNodesOnDrag, nodeDragThreshold } = store.getState();
  if (isSelectable.value && (!selectNodesOnDrag || !isDraggable.value || nodeDragThreshold > 0)) {
    handleNodeClick({
      id,
      store,
      nodeRef: nodeRef.value,
    });
  }
  onClick?.(e, { ...internals.userNode });
}

function onKeyDown(e: KeyboardEvent) {
  if (isInputDOMNode(e as any) || disableKeyboardA11y) return;
  const key = (e as any).key;
  if (elementSelectionKeys.includes(key) && isSelectable.value) {
    handleNodeClick({ id, store, unselect: key === 'Escape', nodeRef });
  } else if (isDraggable.value && node.selected && Object.prototype.hasOwnProperty.call(arrowKeyDiffs, key)) {
    e.preventDefault();
    store.setState({
      ariaLiveMessage: `Moved selected node ${key.replace('Arrow', '').toLowerCase()}. New position, x: ${~~internals
        .positionAbsolute.x}, y: ${~~internals.positionAbsolute.y}`,
    });
    moveSelectedNodes({
      direction: arrowKeyDiffs[key],
      factor: e.shiftKey ? 4 : 1,
    });
  }
}
</script>

<template>
  <div
    ref="nodeRef"
    :class="
      cc([
        'vue-flow__node',
        `vue-flow__node-${nodeType}`,
        { [noPanClassName]: isDraggable.value },
        node.className,
        {
          selected: node.selected,
          selectable: isSelectable.value,
          parent: isParent,
          draggable: isDraggable.value,
          dragging,
        },
      ])
    "
    :style="{
      zIndex: internals.z,
      transform: `translate(${internals.positionAbsolute.x}px,${internals.positionAbsolute.y}px)`,
      pointerEvents: hasDimensions ? 'all' : 'none',
      visibility: hasDimensions ? 'visible' : 'hidden',
      ...node.style,
      ...getNodeInlineStyleDimensions(node),
    }"
    :data-id="id"
    :data-testid="`rf__node-${id}`"
    @mouseenter="onMouseEnterHandler"
    @mousemove="onMouseMoveHandler"
    @mouseleave="onMouseLeaveHandler"
    @contextmenu.prevent="onContextMenuHandler"
    @click="onSelectNodeHandler"
    @dblclick="onDoubleClickHandler"
    @keydown="isFocusable.value ? onKeyDown : null"
    :tabindex="isFocusable.value ? 0 : undefined"
    :role="isFocusable.value ? 'button' : undefined"
    :aria-describedby="disableKeyboardA11y ? undefined : `${ARIA_NODE_DESC_KEY}-${rfId}`"
    :aria-label="node.ariaLabel"
  >
    <component
      :is="NodeComponent"
      v-bind="{
        id,
        data: node.data,
        type: nodeType,
        positionAbsoluteX: internals.positionAbsolute.x,
        positionAbsoluteY: internals.positionAbsolute.y,
        selected: node.selected,
        selectable: isSelectable.value,
        draggable: isDraggable.value,
        deletable: node.deletable ?? true,
        isConnectable: isConnectable.value,
        sourcePosition: node.sourcePosition,
        targetPosition: node.targetPosition,
        dragging,
        dragHandle: node.dragHandle,
        zIndex: internals.z,
        parentId: node.parentId,
        ...getNodeDimensions(node),
      }"
    />
  </div>
</template>
