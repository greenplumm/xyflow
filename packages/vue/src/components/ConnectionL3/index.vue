<script setup lang="ts" name="ConnectionLine">
import { computed } from 'vue';
import {
  ConnectionLineType,
  getBezierPath,
  getSmoothStepPath,
  getConnectionStatus,
  getStraightPath,
} from '@xyflow/system';
import { getSimpleBezierPath } from '../../utils/edges';
import { useStore } from '../../hooks/useStore';
import { useConnection } from '../../hooks/useConnection';
import type { ConnectionLineComponent, Node, VueFlowState } from '../../types';

const props = defineProps<{
  type: ConnectionLineType;
  component?: ConnectionLineComponent<Node>;
  containerStyle?: CSSProperties;
  style?: CSSProperties;
  CustomComponent?: ConnectionLineComponent<Node>;
  isValid?: boolean | null;
}>();

const selector = (s: VueFlowState) => ({
  nodesConnectable: s.nodesConnectable,
  isValid: s.connection.isValid,
  inProgress: s.connection.inProgress,
  width: s.width,
  height: s.height,
});

const { nodesConnectable, width, height, isValid, inProgress } = useStore(selector);
const renderConnection = computed(() => !!(width.value && nodesConnectable.value && inProgress.value));

// const { from, fromNode, fromHandle, fromPosition, to, toNode, toHandle, toPosition } =
const sliced = useConnection<Node>();
const from = sliced.value.from;
const fromNode = sliced.value.fromNode;
const fromHandle = sliced.value.fromHandle;
const fromPosition = sliced.value.fromPosition;
const to = sliced.value.to;
const toNode = sliced.value.toNode;
const toHandle = sliced.value.toHandle;
const toPosition = sliced.value.toPosition;

const pathParams = computed(() => ({
  sourceX: from.value.x,
  sourceY: from.value.y,
  sourcePosition: fromPosition.value,
  targetX: to.value.x,
  targetY: to.value.y,
  targetPosition: toPosition.value,
}));

const path = computed(() => {
  if (!inProgress.value) return '';

  switch (props.type) {
    case ConnectionLineType.Bezier:
      return getBezierPath(pathParams.value)[0];
    case ConnectionLineType.SimpleBezier:
      return getSimpleBezierPath(pathParams.value)[0];
    case ConnectionLineType.Step:
      return getSmoothStepPath({
        ...pathParams.value,
        borderRadius: 0,
      })[0];
    case ConnectionLineType.SmoothStep:
      return getSmoothStepPath(pathParams.value)[0];
    default:
      return getStraightPath(pathParams.value)[0];
  }
});
</script>

<template>
  <template v-if="inProgress">
    <component
      v-if="CustomComponent"
      :is="CustomComponent"
      :connectionLineType="type"
      :connectionLineStyle="style"
      :fromNode="fromNode"
      :fromHandle="fromHandle"
      :fromX="from.x"
      :fromY="from.y"
      :toX="to.x"
      :toY="to.y"
      :fromPosition="fromPosition"
      :toPosition="toPosition"
      :connectionStatus="getConnectionStatus(isValid)"
      :toNode="toNode"
      :toHandle="toHandle"
    />
    <path v-else :d="path" fill="none" class="vue-flow__connection-path" :style="style" />
  </template>
</template>

<style>
.vue-flow__connectionline {
  position: absolute;
  top: 0;
  left: 0;
}

.vue-flow__connection {
  fill: none;
  stroke: #b1b1b7;
  stroke-width: 1;
}

.vue-flow__connection-path {
  stroke: #b1b1b7;
  stroke-width: 1;
  fill: none;
}
</style>
