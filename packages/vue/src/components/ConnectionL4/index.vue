<template>
  <svg
    v-if="renderConnection"
    :style="containerStyle"
    :width="width"
    :height="height"
    class="vue-flow__connectionline vue-flow__container"
  >
    <g :class="['vue-flow__connection', getConnectionStatus(isValid)]">
      <ConnectionLine :style="style" :type="type" :custom-component="component" :is-valid="isValid" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { ConnectionLineType, getConnectionStatus } from '@xyflow/system';
import { useStoreApi } from '../../hooks/useStore';
import ConnectionLine from './connectionLine.vue';

interface ConnectionLineWrapperProps {
  type: ConnectionLineType;
  component?: any;
  containerStyle?: Record<string, any>;
  style?: Record<string, any>;
}

const props = defineProps<ConnectionLineWrapperProps>();

const store = useStoreApi();
const { nodesConnectable, width, height, isValid, inProgress } = storeToRefs(store.getState());

const renderConnection = computed(() => width.value && nodesConnectable.value && inProgress.value);
</script>
