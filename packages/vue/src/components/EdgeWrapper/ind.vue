<template>
  <svg
    v-if="
      !edge.hidden &&
      storeData.sourceX !== null &&
      storeData.sourceY !== null &&
      storeData.targetX !== null &&
      storeData.targetY !== null
    "
    :style="{ zIndex }"
  >
    <g
      :class="[
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
      ]"
      @click="onEdgeClick"
      @dblclick="onEdgeDoubleClick"
      @contextmenu="onEdgeContextMenu"
      @mouseenter="onEdgeMouseEnter"
      @mousemove="onEdgeMouseMove"
      @mouseleave="onEdgeMouseLeave"
      @keydown="isFocusable ? onKeyDown : undefined"
      :tabindex="isFocusable ? 0 : undefined"
      :role="isFocusable ? 'button' : 'img'"
      :data-id="id"
      :data-testid="`vf__edge-${id}`"
      :aria-label="edge.ariaLabel === null ? undefined : edge.ariaLabel || `Edge from ${edge.source} to ${edge.target}`"
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
        :labelStyle="edge.labelStyle"
        :labelShowBg="edge.labelShowBg"
        :labelBgStyle="edge.labelBgStyle"
        :labelBgPadding="edge.labelBgPadding"
        :labelBgBorderRadius="edge.labelBgBorderRadius"
        :sourceX="sourceX"
        :sourceY="sourceY"
        :targetX="targetX"
        :targetY="targetY"
        :sourcePosition="sourcePosition"
        :targetPosition="targetPosition"
        :data="edge.data"
        :style="edge.style"
        :sourceHandleId="edge.sourceHandle"
        :targetHandleId="edge.targetHandle"
        :markerStart="markerStartUrl"
        :markerEnd="markerEndUrl"
        :pathOptions="'pathOptions' in edge ? edge.pathOptions : undefined"
        :interactionWidth="edge.interactionWidth"
      />
      <EdgeUpdateAnchors
        v-if="isReconnectable"
        :edge="edge"
        :isReconnectable="isReconnectable"
        :reconnectRadius="reconnectRadius"
        :onReconnect="onReconnect"
        :onReconnectStart="onReconnectStart"
        :onReconnectEnd="onReconnectEnd"
        :sourceX="sourceX"
        :sourceY="sourceY"
        :targetX="targetX"
        :targetY="targetY"
        :sourcePosition="sourcePosition"
        :targetPosition="targetPosition"
        :setUpdateHover="setUpdateHover"
        :setReconnecting="setReconnecting"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { ref, computed, watch, watchEffect } from 'vue';
import { useStore, useStoreApi } from '../../hooks/useStore';
import { ARIA_EDGE_DESC_KEY } from '../A11yDescriptions/constants';
import { builtinEdgeTypes, nullPosition } from './utils';
import { default as EdgeUpdateAnchors } from './EdgeUpdateAnchors.vue';
import type { Edge, EdgeWrapperProps } from '../../types';
import {
  getMarkerId,
  elementSelectionKeys,
  getEdgePosition,
  errorMessages,
  getElevatedEdgeZIndex,
} from '@xyflow/system';

const props = defineProps<EdgeWrapperProps>();

const edgeRef = ref<SVGGElement | null>(null);
const updateHover = ref(false);
const reconnecting = ref(false);

const store = useStoreApi();
const edgeLookup = useStore((s) => s.edgeLookup);
const defaultEdgeOptions = useStore((s) => s.defaultEdgeOptions);

let edge = computed(() => {
  const e = edgeLookup.get(props.id) as Edge;
  return defaultEdgeOptions ? { ...defaultEdgeOptions, ...e } : e;
});

let edgeType = computed(() => edge.value.type || 'default');
let EdgeComponent = computed(() => props.edgeTypes?.[edgeType.value] || builtinEdgeTypes[edgeType.value]);

if (!EdgeComponent.value) {
  props.onError?.('011', errorMessages['error011'](edgeType.value));
  edgeType.value = 'default';
  EdgeComponent.value = builtinEdgeTypes.default;
}

const isFocusable = computed(
  () => !!(edge.value.focusable || (props.edgesFocusable && typeof edge.value.focusable === 'undefined'))
);
const isReconnectable = computed(
  () =>
    typeof props.onReconnect !== 'undefined' &&
    (edge.value.reconnectable || (props.edgesReconnectable && typeof edge.value.reconnectable === 'undefined'))
);
const isSelectable = computed(
  () => !!(edge.value.selectable || (props.elementsSelectable && typeof edge.value.selectable === 'undefined'))
);

const storeData = useStore((store) => {
  const sourceNode = store.nodeLookup.get(edge.value.source);
  const targetNode = store.nodeLookup.get(edge.value.target);

  if (!sourceNode || !targetNode) {
    return {
      zIndex: edge.value.zIndex,
      ...nullPosition,
    };
  }

  const edgePosition = getEdgePosition({
    id: props.id,
    sourceNode,
    targetNode,
    sourceHandle: edge.value.sourceHandle || null,
    targetHandle: edge.value.targetHandle || null,
    connectionMode: store.connectionMode,
    onError: props.onError,
  });

  const zIndex = getElevatedEdgeZIndex({
    selected: edge.value.selected,
    zIndex: edge.value.zIndex,
    sourceNode,
    targetNode,
    elevateOnSelect: store.elevateEdgesOnSelect,
  });

  return {
    zIndex,
    ...(edgePosition || nullPosition),
  };
});
watch([storeData], (newVal) => {
  debugerr;
  const zIndex = newVal.zIndex;
  const sourceX = newVal.sourceX;
  const sourceY = newVal.sourceY;
  const targetX = newVal.targetX;
  const targetY = newVal.targetY;
  const sourcePosition = newVal.sourcePosition;
  const targetPosition = newVal.targetPosition;
});

const markerStartUrl = computed(() =>
  edge.value.markerStart ? `url('#${getMarkerId(edge.value.markerStart, props.rfId)}')` : undefined
);

const markerEndUrl = computed(() =>
  edge.value.markerEnd ? `url('#${getMarkerId(edge.value.markerEnd, props.rfId)}')` : undefined
);

const onEdgeClick = (event: MouseEvent) => {
  const { addSelectedEdges, unselectNodesAndEdges, multiSelectionActive } = store.getState();

  if (isSelectable.value) {
    store.setState({ nodesSelectionActive: false });

    if (edge.value.selected && multiSelectionActive) {
      unselectNodesAndEdges({ nodes: [], edges: [edge.value] });
      edgeRef.value?.blur();
    } else {
      addSelectedEdges([props.id]);
    }
  }

  if (props.onClick) {
    props.onClick(event, edge.value);
  }
};

const onEdgeDoubleClick = props.onDoubleClick
  ? (event: MouseEvent) => {
      props.onDoubleClick?.(event, { ...edge.value });
    }
  : undefined;

const onEdgeContextMenu = props.onContextMenu
  ? (event: MouseEvent) => {
      props.onContextMenu?.(event, { ...edge.value });
    }
  : undefined;

const onEdgeMouseEnter = props.onMouseEnter
  ? (event: MouseEvent) => {
      props.onMouseEnter?.(event, { ...edge.value });
    }
  : undefined;

const onEdgeMouseMove = props.onMouseMove
  ? (event: MouseEvent) => {
      props.onMouseMove?.(event, { ...edge.value });
    }
  : undefined;

const onEdgeMouseLeave = props.onMouseLeave
  ? (event: MouseEvent) => {
      props.onMouseLeave?.(event, { ...edge.value });
    }
  : undefined;

const onKeyDown = (event: KeyboardEvent) => {
  if (!props.disableKeyboardA11y && elementSelectionKeys.includes(event.key) && isSelectable.value) {
    const { unselectNodesAndEdges, addSelectedEdges } = store.getState();
    const unselect = event.key === 'Escape';

    if (unselect) {
      edgeRef.value?.blur();
      unselectNodesAndEdges({ edges: [edge.value] });
    } else {
      addSelectedEdges([props.id]);
    }
  }
};

const setUpdateHover = (val: boolean) => {
  updateHover.value = val;
};

const setReconnecting = (val: boolean) => {
  reconnecting.value = val;
};
</script>
