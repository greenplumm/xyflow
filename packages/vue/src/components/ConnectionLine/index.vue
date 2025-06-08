<template>
  <svg
    :style="containerStyle"
    :width="sliced.width"
    :height="sliced.height"
    class="vue-flow__connectionline vue-flow__container"
  >
    <g :class="connectionClasses">
      <connection-line :style="style" :type="type" :custom-component="component" :is-valid="sliced.isValid" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed, defineExpose, CSSProperties } from 'vue';

import { storeToRefs } from 'pinia';
import cc from 'classcat';
import {
  ConnectionLineType,
  getBezierPath,
  getSmoothStepPath,
  getConnectionStatus,
  getStraightPath,
} from '@xyflow/system';
import { useStore } from '../../hooks/useStore';
import { useConnection } from '../../hooks/useConnection';
import ConnectionLine from './ConnectionLine.vue';

interface ConnectionLineWrapperProps {
  type: ConnectionLineType;
  component?: any;
  containerStyle?: CSSProperties;
  style?: CSSProperties;
}

const props = defineProps<ConnectionLineWrapperProps>();
const sliced = useStore((state) => ({
  nodesConnectable: state.nodesConnectable,
  isValid: state.connection.isValid,
  inProgress: state.connection.inProgress,
  width: state.width,
  height: state.height,
}));
// const { nodesConnectable, width, height, isValid, inProgress } = storeToRefs(sliced);
const nodesConnectable = sliced.value.nodesConnectable;
const width = sliced.value.width;
const height = sliced.value.height;
const isValid = sliced.value.isValid;
const inProgress = sliced.value.inProgress;
// const { sourceX, sourceY, targetX, targetY } = useConnection();

const renderConnection = computed(() => !!(width && nodesConnectable && inProgress));
const connectionClasses = computed(() => ['vue-flow__connection', getConnectionStatus(sliced.value.isValid)]);

// if (!renderConnection.value) {
//   defineExpose({});
// }
</script>

<style scoped>
.vue-flow__connectionline {
  pointer-events: none;
}
</style>
