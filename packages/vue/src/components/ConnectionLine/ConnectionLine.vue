<template>
  <component
    :is="CustomComponent"
    v-if="CustomComponent"
    :connection-line-type="type"
    :connection-line-style="style"
    :from-node="fromNode"
    :from-handle="fromHandle"
    :from-x="fromX"
    :from-y="fromY"
    :to-x="toX"
    :to-y="toY"
    :from-position="fromPosition"
    :to-position="toPosition"
    :connection-status="connectionStatus"
    :to-node="toNode"
    :to-handle="toHandle"
  />
  <path v-else :d="path" fill="none" class="vue-flow__connection-path" :style="style" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CSSProperties } from 'vue';
import { ConnectionLineType, getBezierPath, getSmoothStepPath, getStraightPath } from '@xyflow/system';
// import { storeToRefs } from 'pinia';
import { getSimpleBezierPath } from '../../utils/edges';
import { useConnection } from '../../hooks/useConnection';
import { getConnectionStatus } from '@xyflow/system';

interface ConnectionLineProps {
  type?: ConnectionLineType;
  style?: CSSProperties;
  CustomComponent?: any;
  isValid?: boolean | null;
}

const props = defineProps<ConnectionLineProps>();
const connection = useConnection();
const connectionStatus = computed(() => getConnectionStatus(props.isValid));

const path = computed(() => {
  if (!connection.value.inProgress) return '';

  const pathParams = {
    sourceX: connection.value.from?.x,
    sourceY: connection.value.from?.y,
    sourcePosition: connection.value.fromPosition,
    targetX: connection.value.to?.x,
    targetY: connection.value.to?.y,
    targetPosition: connection.value.toPosition,
  };

  switch (props.type) {
    case ConnectionLineType.Bezier:
      return getBezierPath(pathParams)[0];
    case ConnectionLineType.SimpleBezier:
      return getSimpleBezierPath(pathParams)[0];
    case ConnectionLineType.Step:
      return getSmoothStepPath({ ...pathParams, borderRadius: 0 })[0];
    case ConnectionLineType.SmoothStep:
      return getSmoothStepPath(pathParams)[0];
    default:
      return getStraightPath(pathParams)[0];
  }
});
</script>
