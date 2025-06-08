<template>
  <svg :style="{ zIndex }">
    <g
      :class="
        cc([
          'react-flow__edge',
          `react-flow__edge-${edgeType}`,
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
      :aria-label="edge.ariaLabel || `Edge from ${edge.source} to ${edge.target}`"
      :aria-describedby="isFocusable ? `${ARIA_EDGE_DESC_KEY}-${rfId}` : undefined"
      ref="edgeRef"
    >
      <EdgeComponent
        v-if="!reconnecting"
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
        :path-options="edge.pathOptions"
        :interaction-width="edge.interactionWidth"
      />
      <EdgeUpdateAnchors
        v-if="isReconnectable"
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
    </g>
  </svg>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import cc from 'classcat';
import { shallow } from 'zustand/shallow';
import {
  getMarkerId,
  elementSelectionKeys,
  getEdgePosition,
  errorMessages,
  getElevatedEdgeZIndex,
} from '@xyflow/system';
import { useStoreApi, useStore } from '../../hooks/useStore';
import { ARIA_EDGE_DESC_KEY } from '../A11yDescriptions';
import { builtinEdgeTypes, nullPosition } from './utils';
import { EdgeUpdateAnchors } from './EdgeUpdateAnchors';
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

let edge = useStore((s) => s.edgeLookup.get(id)!) as Edge;
const defaultEdgeOptions = useStore((s) => s.defaultEdgeOptions);
edge = defaultEdgeOptions ? { ...defaultEdgeOptions, ...edge } : edge;

let edgeType = edge.type || 'default';
let EdgeComponent = edgeTypes?.[edgeType] || builtinEdgeTypes[edgeType];

if (!EdgeComponent) {
  onError?.('011', errorMessages['error011'](edgeType));
  edgeType = 'default';
  EdgeComponent = builtinEdgeTypes.default;
}

const isFocusable = computed(() => !!(edge.focusable || (edgesFocusable && typeof edge.focusable === 'undefined')));
const isReconnectable = computed(
  () =>
    typeof onReconnect !== 'undefined' &&
    (edge.reconnectable || (edgesReconnectable && typeof edge.reconnectable === 'undefined'))
);
const isSelectable = computed(
  () => !!(edge.selectable || (elementsSelectable && typeof edge.selectable === 'undefined'))
);

const edgeRef = ref<SVGGElement>(null);
const updateHover = ref(false);
const setUpdateHover = (value: boolean) => {
  updateHover.value = value;
};
const reconnecting = ref(false);
const setReconnecting = (value: boolean) => {
  reconnecting.value = value;
};
const store = useStoreApi();

const { zIndex, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = useStore((store) => {
  const sourceNode = store.nodeLookup.get(edge.source);
  const targetNode = store.nodeLookup.get(edge.target);

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
}, shallow);

const markerStartUrl = computed(() =>
  edge.markerStart ? `url('#${getMarkerId(edge.markerStart, rfId)}')` : undefined
);
const markerEndUrl = computed(() => (edge.markerEnd ? `url('#${getMarkerId(edge.markerEnd, rfId)}')` : undefined));

const onEdgeClick = (event: MouseEvent) => {
  const { addSelectedEdges, unselectNodesAndEdges, multiSelectionActive } = store.getState();

  if (isSelectable.value) {
    store.setState({ nodesSelectionActive: false });

    if (edge.selected && multiSelectionActive) {
      unselectNodesAndEdges({ nodes: [], edges: [edge] });
      edgeRef.value?.blur();
    } else {
      addSelectedEdges([id]);
    }
  }

  if (onClick) {
    onClick(event, edge);
  }
};

const onEdgeDoubleClick = (event: MouseEvent) => {
  onDoubleClick?.(event, { ...edge });
};

const onEdgeContextMenu = (event: MouseEvent) => {
  onContextMenu?.(event, { ...edge });
};

const onEdgeMouseEnter = (event: MouseEvent) => {
  onMouseEnter?.(event, { ...edge });
};

const onEdgeMouseMove = (event: MouseEvent) => {
  onMouseMove?.(event, { ...edge });
};

const onEdgeMouseLeave = (event: MouseEvent) => {
  onMouseLeave?.(event, { ...edge });
};

const onKeyDown = (event: KeyboardEvent) => {
  if (!disableKeyboardA11y && elementSelectionKeys.includes(event.key) && isSelectable.value) {
    const { unselectNodesAndEdges, addSelectedEdges } = store.getState();
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
  if (edge.hidden || sourceX === null || sourceY === null || targetX === null || targetY === null) {
    return null;
  }
});
</script>

<style scoped>
.react-flow__edge {
  cursor: pointer;
}
</style>
