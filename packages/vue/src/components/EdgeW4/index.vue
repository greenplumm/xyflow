<template>
  <svg :style="{ zIndex }">
    <g
      :class="
        cc([
          'vue-flow__edge',
          `vue-flow__edge-${edgeType}`,
          edge.className,
          noPanClassName,
          {
            selected: edge.selected,
            animated: edge.animated,
            inactive: !isSelectable && !onClick,
            updating: updateHover,
            selectable: isSelectable,
          },
        ])
      "
      @click="onEdgeClick"
      @dblclick="onEdgeDoubleClick"
      @contextmenu="onEdgeContextMenu"
      @mouseenter="onEdgeMouseEnter"
      @mousemove="onEdgeMouseMove"
      @mouseleave="onEdgeMouseLeave"
      :tabindex="isFocusable ? 0 : undefined"
      :role="isFocusable ? 'button' : 'img'"
      :data-id="id"
      :data-testid="`rf__edge-${id}`"
      :aria-label="edge.ariaLabel === null ? undefined : edge.ariaLabel || `Edge from ${edge.source} to ${edge.target}`"
      :aria-describedby="isFocusable ? `${ARIA_EDGE_DESC_KEY}-${rfId}` : undefined"
      ref="edgeRef"
    >
      <template v-if="!reconnecting">
        <component
          :is="EdgeComponent"
          :id="id"
          :source="edge.source"
          :target="edge.target"
          :type="edge.type"
          :selected="edge.selected"
          :animated="edge.animated"
          :selectable="isSelectable"
          :deletable="edge.deletable ?? true"
          :label="edge.label"
          :label-style="edge.labelStyle"
          :label-show-bg="edge.labelShowBg"
          :label-bg-style="edge.labelBgStyle"
          :label-bg-padding="edge.labelBgPadding"
          :label-bg-border-radius="edge.labelBgBorderRadius"
          :source-x="sourceX"
          :source-y="sourceY"
          :target-x="targetX"
          :target-y="targetY"
          :source-position="sourcePosition"
          :target-position="targetPosition"
          :data="edge.data"
          :style="edge.style"
          :source-handle-id="edge.sourceHandle"
          :target-handle-id="edge.targetHandle"
          :marker-start="markerStartUrl"
          :marker-end="markerEndUrl"
          :path-options="'pathOptions' in edge ? edge.pathOptions : undefined"
          :interaction-width="edge.interactionWidth"
        />
      </template>
      <template v-if="isReconnectable">
        <EdgeUpdateAnchors
          :edge="edge"
          :is-reconnectable="isReconnectable"
          :reconnect-radius="reconnectRadius"
          :on-reconnect="onReconnect"
          :on-reconnect-start="onReconnectStart"
          :on-reconnect-end="onReconnectEnd"
          :source-x="sourceX"
          :source-y="sourceY"
          :target-x="targetX"
          :target-y="targetY"
          :source-position="sourcePosition"
          :target-position="targetPosition"
          :set-update-hover="setUpdateHover"
          :set-reconnecting="setReconnecting"
        />
      </template>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import cc from 'classcat';
import {
  getMarkerId,
  elementSelectionKeys,
  getEdgePosition,
  errorMessages,
  getElevatedEdgeZIndex,
} from '@xyflow/system';
import { useStore, useStoreApi } from '../../hooks/useStore';
import { ARIA_EDGE_DESC_KEY } from '../A11yDescriptions/constants';
import { builtinEdgeTypes, nullPosition } from './utils';
import EdgeUpdateAnchors from './EdgeUpdateAnchors.vue';
import type { Edge, EdgeWrapperProps } from '../../types';

const props = defineProps<EdgeWrapperProps<Edge>>();
const {
  id,
  edgesFocusable,
  edgesReconnectable,
  elementsSelectable,
  onClick,
  onDoubleClick,
  onContextMenu,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  reconnectRadius,
  onReconnect,
  onReconnectStart,
  onReconnectEnd,
  rfId,
  edgeTypes,
  noPanClassName,
  onError,
  disableKeyboardA11y,
} = props;

const store = useStoreApi();
const edgeLookup = useStore((s) => s.edgeLookup);
let edge = edgeLookup.get(id) as Edge;
const defaultEdgeOptions = store.defaultEdgeOptions;
edge = defaultEdgeOptions ? { ...defaultEdgeOptions, ...edge } : edge;

let edgeType = edge.type || 'default';
let EdgeComponent = edgeTypes?.[edgeType] || builtinEdgeTypes[edgeType];

if (!EdgeComponent) {
  onError?.('011', errorMessages['error011'](edgeType));
  edgeType = 'default';
  EdgeComponent = builtinEdgeTypes.default;
}

const isFocusable = !!(edge.focusable || (edgesFocusable && typeof edge.focusable === 'undefined'));
const isReconnectable =
  typeof onReconnect !== 'undefined' &&
  (edge.reconnectable || (edgesReconnectable && typeof edge.reconnectable === 'undefined'));
const isSelectable = !!(edge.selectable || (elementsSelectable && typeof edge.selectable === 'undefined'));

const edgeRef = ref<SVGGElement>(null);
const updateHover = ref(false);
const reconnecting = ref(false);
const setUpdateHover = (value: boolean) => (updateHover.value = value);
const setReconnecting = (value: boolean) => (reconnecting.value = value);

const { zIndex, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = useStore((store) => {
  // 显式声明依赖属性，确保响应式系统能正确追踪变化
  const source = edge.source;
  const target = edge.target;
  const sourceHandle = edge.sourceHandle;
  const targetHandle = edge.targetHandle;
  const selected = edge.selected;
  const zIndexVal = edge.zIndex;

  const sourceNode = store.nodeLookup.get(source);
  const targetNode = store.nodeLookup.get(target);

  if (!sourceNode || !targetNode) {
    return { zIndex: edge.zIndex, ...nullPosition };
  }

  const edgePosition = getEdgePosition({
    id,
    sourceNode,
    targetNode,
    sourceHandle: edge.sourceHandle || null,
    targetHandle: edge.targetHandle || null,
    connectionMode: store.connectionMode,
    onError,
  });
  const zIndex = getElevatedEdgeZIndex({
    selected: edge.selected,
    zIndex: edge.zIndex,
    sourceNode,
    targetNode,
    elevateOnSelect: store.elevateEdgesOnSelect,
  });

  return { zIndex, ...(edgePosition || nullPosition) };
});

const markerStartUrl = computed(() =>
  edge.markerStart ? `url('#${getMarkerId(edge.markerStart, rfId)}')` : undefined
);
const markerEndUrl = computed(() => (edge.markerEnd ? `url('#${getMarkerId(edge.markerEnd, rfId)}')` : undefined));

const onEdgeClick = (event: MouseEvent) => {
  const { addSelectedEdges, unselectNodesAndEdges, multiSelectionActive } = store;

  if (isSelectable) {
    store.nodesSelectionActive = false;

    if (edge.selected && multiSelectionActive) {
      unselectNodesAndEdges({ nodes: [], edges: [edge] });
      edgeRef.value?.blur();
    } else {
      addSelectedEdges([id]);
    }
  }

  onClick?.(event, edge);
};

const onEdgeDoubleClick = onDoubleClick ? (event: MouseEvent) => onDoubleClick(event, { ...edge }) : undefined;
const onEdgeContextMenu = onContextMenu ? (event: MouseEvent) => onContextMenu(event, { ...edge }) : undefined;
const onEdgeMouseEnter = onMouseEnter ? (event: MouseEvent) => onMouseEnter(event, { ...edge }) : undefined;
const onEdgeMouseMove = onMouseMove ? (event: MouseEvent) => onMouseMove(event, { ...edge }) : undefined;
const onEdgeMouseLeave = onMouseLeave ? (event: MouseEvent) => onMouseLeave(event, { ...edge }) : undefined;

const onKeyDown = (event: KeyboardEvent) => {
  if (!disableKeyboardA11y && elementSelectionKeys.includes(event.key) && isSelectable) {
    const { unselectNodesAndEdges, addSelectedEdges } = store;
    const unselect = event.key === 'Escape';

    if (unselect) {
      edgeRef.value?.blur();
      unselectNodesAndEdges({ edges: [edge] });
    } else {
      addSelectedEdges([id]);
    }
  }
};

onMounted(() => {
  if (isFocusable) {
    edgeRef.value?.addEventListener('keydown', onKeyDown);
  }
  if (edge.hidden || sourceX === null || sourceY === null || targetX === null || targetY === null) {
    return null;
  }
});

onUnmounted(() => {
  if (isFocusable) {
    edgeRef.value?.removeEventListener('keydown', onKeyDown);
  }
});
</script>
