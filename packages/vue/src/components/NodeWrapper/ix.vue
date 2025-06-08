<template>
  <div
    ref="nodeRef"
    :class="nodeClasses"
    :style="nodeStyles"
    :data-id="id"
    :data-testid="`rf__node-${id}`"
    @mouseenter="onMouseEnterHandler"
    @mousemove="onMouseMoveHandler"
    @mouseleave="onMouseLeaveHandler"
    @contextmenu="onContextMenuHandler"
    @click="onSelectNodeHandler"
    @dblclick="onDoubleClickHandler"
    @keydown="isFocusable ? onKeyDown : undefined"
    :tabindex="isFocusable ? 0 : undefined"
    :role="isFocusable ? 'button' : undefined"
    :aria-describedby="disableKeyboardA11y ? undefined : `${ARIA_NODE_DESC_KEY}-${rfId}`"
    :aria-label="node.ariaLabel"
  >
    <component
      :is="NodeComponent"
      :id="id"
      :data="node.data"
      :type="nodeType"
      :positionAbsoluteX="internals.positionAbsolute.x"
      :positionAbsoluteY="internals.positionAbsolute.y"
      :selected="node.selected ?? false"
      :selectable="isSelectable"
      :draggable="isDraggable"
      :deletable="node.deletable ?? true"
      :isConnectable="isConnectable"
      :sourcePosition="node.sourcePosition"
      :targetPosition="node.targetPosition"
      :dragging="dragging"
      :dragHandle="node.dragHandle"
      :zIndex="internals.z"
      :parentId="node.parentId"
      v-bind="nodeDimensions"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore, useStoreApi } from '../../hooks/useStore';
import { provideNodeId as NodeIdProvider } from '../../contexts/NodeIdContext';
import { getNodeDimensions, nodeHasDimensions } from '@xyflow/system';
import { ARIA_NODE_DESC_KEY } from '../A11yDescriptions/constants';
import { useDrag } from '../../hooks/useDrag';
import { useMoveSelectedNodes } from '../../hooks/useMoveSelectedNodes';
import { handleNodeClick } from '../Nodes/utils';
import { arrowKeyDiffs, builtinNodeTypes, getNodeInlineStyleDimensions } from './utils';
import { useNodeObserver } from './useNodeObserver';
import type { NodeWrapperProps } from './utils';
import type { InternalNode, Node } from '../../types';

const props = defineProps<NodeWrapperProps>();

const { node, internals, isParent } = useStore((s) => {
  const node = s.nodeLookup.get(props.id)! as InternalNode;
  const isParent = s.parentLookup.has(props.id);

  return {
    node,
    internals: node?.internals,
    isParent,
  };
});

let nodeType = node?.type || 'default';
let NodeComponent = props.nodeTypes?.[nodeType] || builtinNodeTypes[nodeType];

if (NodeComponent === undefined) {
  props.onError?.('003', errorMessages['error003'](nodeType));
  nodeType = 'default';
  NodeComponent = builtinNodeTypes.default;
}

const isDraggable = !!(node.draggable || (props.nodesDraggable && typeof node.draggable === 'undefined'));
const isSelectable = !!(node.selectable || (props.elementsSelectable && typeof node.selectable === 'undefined'));
const isConnectable = !!(node.connectable || (props.nodesConnectable && typeof node.connectable === 'undefined'));
const isFocusable = !!(node.focusable || (props.nodesFocusable && typeof node.focusable === 'undefined'));
const nodeRef = ref<HTMLElement | null>(null);
const store = useStoreApi();
const hasDimensions = nodeHasDimensions(node);
useNodeObserver({ nodeRef, node, nodeType, hasDimensions, resizeObserver: props.resizeObserver });
const { dragging } = useDrag({
  nodeRef,
  disabled: node.hidden || !isDraggable,
  noDragClassName: props.noDragClassName,
  handleSelector: node.dragHandle,
  nodeId: props.id,
  isSelectable,
  nodeClickDistance: props.nodeClickDistance,
});
const { moveSelectedNodes } = useMoveSelectedNodes();

const nodeDimensions = computed(() => getNodeDimensions(node));
const inlineDimensions = computed(() => getNodeInlineStyleDimensions(node));

const hasPointerEvents = computed(
  () => isSelectable || isDraggable || props.onClick || props.onMouseEnter || props.onMouseMove || props.onMouseLeave
);

const nodeClasses = computed(() => [
  'vue-flow__node',
  `vue-flow__node-${nodeType}`,
  {
    [props.noPanClassName]: isDraggable,
  },
  node.className,
  {
    selected: node.selected,
    selectable: isSelectable,
    parent: isParent,
    draggable: isDraggable,
    dragging: dragging,
  },
]);

const nodeStyles = computed(() => ({
  zIndex: internals.z,
  transform: `translate(${internals.positionAbsolute?.x}px,${internals.positionAbsolute?.y}px)`,
  pointerEvents: hasPointerEvents.value ? 'all' : 'none',
  // visibility: hasDimensions ? 'visible' : 'hidden',
  ...node.style,
  ...inlineDimensions.value,
}));

const onMouseEnterHandler = (event: MouseEvent) => {
  if (props.onMouseEnter) {
    props.onMouseEnter(event, { ...internals.userNode });
  }
};

const onMouseMoveHandler = (event: MouseEvent) => {
  if (props.onMouseMove) {
    props.onMouseMove(event, { ...internals.userNode });
  }
};

const onMouseLeaveHandler = (event: MouseEvent) => {
  if (props.onMouseLeave) {
    props.onMouseLeave(event, { ...internals.userNode });
  }
};

const onContextMenuHandler = (event: MouseEvent) => {
  if (props.onContextMenu) {
    props.onContextMenu(event, { ...internals.userNode });
  }
};

const onDoubleClickHandler = (event: MouseEvent) => {
  if (props.onDoubleClick) {
    props.onDoubleClick(event, { ...internals.userNode });
  }
};

const onSelectNodeHandler = (event: MouseEvent) => {
  const { selectNodesOnDrag, nodeDragThreshold } = store.getState();

  if (isSelectable && (!selectNodesOnDrag || !isDraggable || nodeDragThreshold > 0)) {
    handleNodeClick({
      id: props.id,
      store,
      nodeRef,
    });
  }

  if (props.onClick) {
    props.onClick(event, { ...internals.userNode });
  }
};

const onKeyDown = (event: KeyboardEvent) => {
  if (isInputDOMNode(event) || props.disableKeyboardA11y) {
    return;
  }

  if (elementSelectionKeys.includes(event.key) && isSelectable) {
    const unselect = event.key === 'Escape';

    handleNodeClick({
      id: props.id,
      store,
      unselect,
      nodeRef,
    });
  } else if (isDraggable && node.selected && Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
    event.preventDefault();

    store.setState({
      ariaLiveMessage: `Moved selected node ${event.key
        .replace('Arrow', '')
        .toLowerCase()}. New position, x: ${~~internals.positionAbsolute.x}, y: ${~~internals.positionAbsolute.y}`,
    });

    moveSelectedNodes({
      direction: arrowKeyDiffs[event.key],
      factor: event.shiftKey ? 4 : 1,
    });
  }
};
</script>
