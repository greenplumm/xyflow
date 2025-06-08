<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import cc from 'classcat';
import { useStore, useStoreApi } from '../../hooks/useStore';
import {
  getMarkerId,
  elementSelectionKeys,
  getEdgePosition,
  errorMessages,
  getElevatedEdgeZIndex,
} from '@xyflow/system';
import { ARIA_EDGE_DESC_KEY } from '../A11yDescriptions/constants';
import { builtinEdgeTypes, nullPosition } from './utils';
import EdgeUpdateAnchors from './EdgeUpdateAnchors.vue';
import type { Edge, EdgeWrapperProps } from '../../types';

// Props 定义
const props = defineProps<EdgeWrapperProps>();
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

// 取得原始 edge 和默认配置
// const { edge: rawEdge, defaultEdgeOptions } = useStore((s) => ({
//   edge: s.edgeLookup.get(id) as Edge,
//   defaultEdgeOptions: s.defaultEdgeOptions,
// }));

// 合并默认配置
// const edge = computed(() =>
//   defaultEdgeOptions?.value ? { ...defaultEdgeOptions.value, ...rawEdge.value } : rawEdge.value
// );
const edgeLookup = useStore((s) => s.edgeLookup);
const defaultEdgeOptions = useStore((s) => s.defaultEdgeOptions);

let edge = computed(() => {
  const e = edgeLookup.value?.get(props.id) as Edge;
  return defaultEdgeOptions.value ? { ...defaultEdgeOptions, ...e } : e;
});
// 边类型
const edgeType = computed(() => edge.value.type || 'default');
let EdgeComponent = computed(() => {
  const Comp = edgeTypes?.[edgeType.value] || builtinEdgeTypes[edgeType.value];
  if (!Comp) {
    onError?.('011', errorMessages['error011'](edgeType.value));
    return builtinEdgeTypes.default;
  }
  return Comp;
});

// 可聚焦、可重连、可选中
const isFocusable = computed(() => !!(edge.value.focusable ?? edgesFocusable));
const isReconnectable = computed(() => onReconnect !== undefined && (edge.value.reconnectable ?? edgesReconnectable));
const isSelectable = computed(() => !!(edge.value.selectable ?? elementsSelectable));

// SVG 元素引用与本地状态
const edgeRef = ref<SVGGElement | null>(null);
const updateHover = ref(false);
const reconnecting = ref(false);
const storeApi = useStoreApi<Edge>();

// 位置计算
const positionData = useStore((s) => {
  const src = s.nodeLookup.get(edge.value.source);
  const tgt = s.nodeLookup.get(edge.value.target);
  if (!src || !tgt) {
    return { zIndex: edge.value.zIndex, ...nullPosition };
  }
  const pos = getEdgePosition({
    id,
    sourceNode: src,
    targetNode: tgt,
    sourceHandle: edge.value.sourceHandle || null,
    targetHandle: edge.value.targetHandle || null,
    connectionMode: s.connectionMode,
    onError,
  });
  const z = getElevatedEdgeZIndex({
    selected: edge.value.selected,
    zIndex: edge.value.zIndex,
    sourceNode: src,
    targetNode: tgt,
    elevateOnSelect: s.elevateEdgesOnSelect,
  });
  return { zIndex: z, ...(pos || nullPosition) };
});

// 构造 marker URLs
const markerStartUrl = computed(() =>
  edge.value.markerStart ? `url('#${getMarkerId(edge.value.markerStart, rfId)}')` : undefined
);
const markerEndUrl = computed(() =>
  edge.value.markerEnd ? `url('#${getMarkerId(edge.value.markerEnd, rfId)}')` : undefined
);

// 点击与键盘事件处理
function onEdgeClick(event: MouseEvent) {
  const state = storeApi.getState();
  const { addSelectedEdges, unselectNodesAndEdges, multiSelectionActive } = state;
  if (isSelectable.value) {
    storeApi.setState({ nodesSelectionActive: false });
    if (edge.value.selected && multiSelectionActive) {
      unselectNodesAndEdges({ nodes: [], edges: [edge.value] });
      edgeRef.value?.blur();
    } else {
      addSelectedEdges([id]);
    }
  }
  onClick?.(event as any, edge.value);
}
const onEdgeDoubleClick = onDoubleClick ? (e: MouseEvent) => onDoubleClick(e as any, { ...edge.value }) : undefined;
const onEdgeContextMenu = onContextMenu ? (e: MouseEvent) => onContextMenu(e as any, { ...edge.value }) : undefined;
const onEdgeMouseEnter = onMouseEnter ? (e: MouseEvent) => onMouseEnter(e as any, { ...edge.value }) : undefined;
const onEdgeMouseMove = onMouseMove ? (e: MouseEvent) => onMouseMove(e as any, { ...edge.value }) : undefined;
const onEdgeMouseLeave = onMouseLeave ? (e: MouseEvent) => onMouseLeave(e as any, { ...edge.value }) : undefined;

function onKeyDown(event: KeyboardEvent) {
  if (!disableKeyboardA11y && elementSelectionKeys.includes(event.key) && isSelectable.value) {
    const { unselectNodesAndEdges, addSelectedEdges } = storeApi.getState();
    if (event.key === 'Escape') {
      edgeRef.value?.blur();
      unselectNodesAndEdges({ edges: [edge.value] });
    } else {
      addSelectedEdges([id]);
    }
  }
}
</script>

<template>
  <svg :style="{ zIndex: positionData.zIndex }">
    <g
      v-if="!edge.hidden && positionData.sourceX !== null"
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
      @contextmenu.prevent="onEdgeContextMenu"
      @mouseenter="onEdgeMouseEnter"
      @mousemove="onEdgeMouseMove"
      @mouseleave="onEdgeMouseLeave"
      @keydown="isFocusable ? onKeyDown : undefined"
      :tabindex="isFocusable ? 0 : undefined"
      :role="isFocusable ? 'button' : 'img'"
      :data-id="id"
      :data-testid="`rf__edge-${id}`"
      :aria-label="edge.ariaLabel ?? `Edge from ${edge.source} to ${edge.target}`"
      :aria-describedby="isFocusable ? `${ARIA_EDGE_DESC_KEY}-${rfId}` : undefined"
      ref="edgeRef"
    >
      <component
        v-if="!reconnecting"
        :is="EdgeComponent"
        v-bind="{
          id,
          source: edge.source,
          target: edge.target,
          type: edge.type,
          selected: edge.selected,
          animated: edge.animated,
          selectable: isSelectable,
          deletable: edge.deletable ?? true,
          label: edge.label,
          labelStyle: edge.labelStyle,
          labelShowBg: edge.labelShowBg,
          labelBgStyle: edge.labelBgStyle,
          labelBgPadding: edge.labelBgPadding,
          labelBgBorderRadius: edge.labelBgBorderRadius,
          sourceX: positionData.sourceX,
          sourceY: positionData.sourceY,
          targetX: positionData.targetX,
          targetY: positionData.targetY,
          sourcePosition: positionData.sourcePosition,
          targetPosition: positionData.targetPosition,
          data: edge.data,
          style: edge.style,
          sourceHandleId: edge.sourceHandle,
          targetHandleId: edge.targetHandle,
          markerStart: markerStartUrl,
          markerEnd: markerEndUrl,
          pathOptions: 'pathOptions' in edge ? edge.pathOptions : undefined,
          interactionWidth: edge.interactionWidth,
        }"
      />
      <EdgeUpdateAnchors
        v-if="isReconnectable"
        :edge="edge"
        :isReconnectable="isReconnectable"
        :reconnectRadius="reconnectRadius"
        :onReconnect="onReconnect"
        :onReconnectStart="onReconnectStart"
        :onReconnectEnd="onReconnectEnd"
        :sourceX="positionData.sourceX"
        :sourceY="positionData.sourceY"
        :targetX="positionData.targetX"
        :targetY="positionData.targetY"
        :sourcePosition="positionData.sourcePosition"
        :targetPosition="positionData.targetPosition"
        :setUpdateHover="(v) => (updateHover = v)"
        :setReconnecting="(v) => (reconnecting = v)"
      />
    </g>
  </svg>
</template>
