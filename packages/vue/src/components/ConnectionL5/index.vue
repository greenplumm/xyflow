<template>
  <svg :style="containerStyle" :width="width" :height="height" class="vue-flow__connectionline vue-flow__container">
    <g :class="['vue-flow__connection', connectionStatus]">
      <ConnectionLine :style="style" :type="type" :CustomComponent="component" :isValid="isValid" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { shallowRef, computed } from 'vue';
import { useStore } from '../../hooks/useStore';
import ConnectionLine from './ConnectionLine.vue';
import {
  ConnectionLineType,
  getBezierPath,
  getSmoothStepPath,
  getConnectionStatus,
  getStraightPath,
} from '@xyflow/system';
// 定义Props类型
interface ConnectionLineWrapperProps {
  type: ConnectionLineType;
  component?: any;
  containerStyle?: Record<string, any>;
  style?: Record<string, any>;
}

const props = defineProps<ConnectionLineWrapperProps>();

// 从Store获取状态（需根据实际Store实现调整）
const sliced = useStore((state) => ({
  nodesConnectable: state.nodesConnectable,
  isValid: state.connection.isValid,
  inProgress: state.connection.inProgress,
  width: state.width,
  height: state.height,
}));
// const { nodesConnectable, width, height, isValid, inProgress }
const nodesConnectable = sliced.value.nodesConnectable;
const width = sliced.value.width;
const height = sliced.value.height;
const isValid = sliced.value.isValid;
const inProgress = sliced.value.inProgress;
// 是否渲染连接线
const renderConnection = computed(() => !!(width && nodesConnectable && inProgress));

// 连接状态类名
const connectionStatus = computed(() => getConnectionStatus(isValid));
</script>
