<template>
  <component v-if="CustomComponent && inProgress" :is="CustomComponent" v-bind="componentProps" />
  <path v-else-if="inProgress" :d="path" fill="none" class="vue-flow__connection-path" :style="style" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  ConnectionLineType,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  getConnectionStatus,
} from '@xyflow/system';
import { useConnection } from '../../hooks/useConnection';
import { getSimpleBezierPath } from '../../utils/edges';

interface ConnectionLineProps {
  type: ConnectionLineType;
  style?: Record<string, any>;
  customComponent?: any;
  isValid: boolean | null;
}

const props = defineProps<ConnectionLineProps>();

const { inProgress, from, fromNode, fromHandle, fromPosition, to, toNode, toHandle, toPosition } = useConnection();

const componentProps = computed(() => ({
  connectionLineType: props.type,
  connectionLineStyle: props.style,
  fromNode,
  fromHandle,
  fromX: from.value.x,
  fromY: from.value.y,
  toX: to.value.x,
  toY: to.value.y,
  fromPosition,
  toPosition,
  connectionStatus: getConnectionStatus(props.isValid),
  toNode,
  toHandle,
}));

const path = computed(() => {
  const params = {
    sourceX: from.value.x,
    sourceY: from.value.y,
    sourcePosition: fromPosition,
    targetX: to.value.x,
    targetY: to.value.y,
    targetPosition: toPosition,
  };

  switch (props.type) {
    case ConnectionLineType.Bezier:
      return getBezierPath(params)[0];
    case ConnectionLineType.SimpleBezier:
      return getSimpleBezierPath(params)[0];
    case ConnectionLineType.Step:
      return getSmoothStepPath({ ...params, borderRadius: 0 })[0];
    case ConnectionLineType.SmoothStep:
      return getSmoothStepPath(params)[0];
    default:
      return getStraightPath(params)[0];
  }
});
</script>
