<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  getMarkerId,
  elementSelectionKeys,
  getEdgePosition,
  errorMessages,
  getElevatedEdgeZIndex,
} from '@xyflow/system';
import { useStoreApi, useStore } from '../../hooks/useStore';
import { ARIA_EDGE_DESC_KEY } from '../A11yDescriptions/constants';
import { builtinEdgeTypes, nullPosition } from './utils';
import EdgeUpdateAnchors from './EdgeUpdateAnchors.vue';
import type { Edge, EdgeWrapperProps } from '../../types/edges';

const props = defineProps<EdgeWrapperProps>();

const store = useStoreApi();
const edgeRef = ref<SVGGElement>();
const updateHover = ref(false);
const reconnecting = ref(false);

const edge = computed(() => {
  let e = useStore((s) => s.edgeLookup.get(props.id)!) as Edge;
  const defaultEdgeOptions = useStore((s) => s.defaultEdgeOptions);
  return defaultEdgeOptions ? { ...defaultEdgeOptions, ...e } : e;
});

const edgeType = computed(() => {
  const type = edge.value.type || 'default';
  const EdgeComponent = props.edgeTypes?.[type] || builtinEdgeTypes[type];

  if (EdgeComponent === undefined) {
    props.onError?.('011', errorMessages['error011'](type));
    return 'default';
  }
  return type;
});

const EdgeComponent = computed(() => props.edgeTypes?.[edgeType.value] || builtinEdgeTypes[edgeType.value]);

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

const { zIndex, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = useStore(
  (store) => {
    const sourceNode = store.nodeLookup.get(edge.value?.source);
    const targetNode = store.nodeLookup.get(edge.value?.target);

    if (!sourceNode || !targetNode) {
      return {
        zIndex: edge.value?.zIndex || 1,
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
  },
  { deep: true }
);

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

  props.onClick?.(event, edge.value);
};

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
</script>

<template>
  <svg
    v-if="!edge.hidden && sourceX !== null && sourceY !== null && targetX !== null && targetY !== null"
    :style="{ zIndex }"
  >
    <g
      :class="[
        'vue-flow__edge',
        `vue-flow__edge-${edgeType}`,
        edge.className,
        props.noPanClassName,
        {
          selected: edge.selected,
          animated: edge.animated,
          inactive: !isSelectable && !props.onClick,
          updating: updateHover,
          selectable: isSelectable,
        },
      ]"
      @click="onEdgeClick"
      @dblclick="props.onDoubleClick ? (e) => props.onDoubleClick(e, edge) : undefined"
      @contextmenu="props.onContextMenu ? (e) => props.onContextMenu(e, edge) : undefined"
      @mouseenter="props.onMouseEnter ? (e) => props.onMouseEnter(e, edge) : undefined"
      @mousemove="props.onMouseMove ? (e) => props.onMouseMove(e, edge) : undefined"
      @mouseleave="props.onMouseLeave ? (e) => props.onMouseLeave(e, edge) : undefined"
      @keydown="isFocusable ? onKeyDown : undefined"
      :tabindex="isFocusable ? 0 : undefined"
      :role="isFocusable ? 'button' : 'img'"
      :data-id="props.id"
      :data-testid="`rf__edge-${props.id}`"
      :aria-label="edge.ariaLabel === null ? undefined : edge.ariaLabel || `Edge from ${edge.source} to ${edge.target}`"
      :aria-describedby="isFocusable ? `${ARIA_EDGE_DESC_KEY}-${props.rfId}` : undefined"
      ref="edgeRef"
    >
      <component
        v-if="!reconnecting"
        :is="EdgeComponent"
        :id="props.id"
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
      <EdgeUpdateAnchors
        v-if="isReconnectable"
        :edge="edge"
        :is-reconnectable="isReconnectable"
        :reconnect-radius="props.reconnectRadius"
        :on-reconnect="props.onReconnect"
        :on-reconnect-start="props.onReconnectStart"
        :on-reconnect-end="props.onReconnectEnd"
        :source-x="sourceX"
        :source-y="sourceY"
        :target-x="targetX"
        :target-y="targetY"
        :source-position="sourcePosition"
        :target-position="targetPosition"
        :set-update-hover="(hover) => (updateHover = hover)"
        :set-reconnecting="(updating) => (reconnecting = updating)"
      />
    </g>
  </svg>
</template>
