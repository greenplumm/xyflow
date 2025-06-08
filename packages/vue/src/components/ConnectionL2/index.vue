<template>
  <svg
    v-if="renderConnection"
    :style="containerStyle"
    :width="width"
    :height="height"
    class="vue-flow__connectionline vue-flow__container"
  >
    <g :class="connectionClasses">
      <ConnectionLine :style="style" :type="type" :is-valid="isValid" :custom-component="component" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  ConnectionLineType,
  getConnectionStatus,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
} from '@xyflow/system';
import { useStore } from '../../hooks/useStore';
import { useConnection } from '../../hooks/useConnection';
import { getSimpleBezierPath } from '../../utils/Edges';
import type { ConnectionLineComponent, Node, VueFlowState } from '../../types';

const props = defineProps<{
  type: ConnectionLineType;
  component?: ConnectionLineComponent;
  containerStyle?: CSSProperties;
  style?: CSSProperties;
}>();

const selector = (s: VueFlowState) => ({
  nodesConnectable: s.nodesConnectable,
  isValid: s.connection.isValid,
  inProgress: s.connection.inProgress,
  width: s.width,
  height: s.height,
});

const storeState = useStore(selector);
const renderConnection = computed(() => !!(storeState.width && storeState.nodesConnectable && storeState.inProgress));

const connectionClasses = computed(() => ['vue-flow__connection', getConnectionStatus(isValid.value)]);
</script>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'ConnectionLineWrapper',
  components: {
    ConnectionLine: defineComponent({
      props: {
        type: { type: String as PropType<ConnectionLineType>, default: ConnectionLineType.Bezier },
        isValid: { type: Boolean, default: null },
        customComponent: { type: [Function, Object] as PropType<ConnectionLineComponent>, default: null },
        style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
      },
      setup(props) {
        const connection = useConnection();

        const path = computed(() => {
          if (!connection.inProgress) return '';

          const pathParams = {
            sourceX: connection.from.x,
            sourceY: connection.from.y,
            sourcePosition: connection.fromPosition,
            targetX: connection.to.x,
            targetY: connection.to.y,
            targetPosition: connection.toPosition,
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

        return {
          template: `
    <component
      v-if="props.customComponent"
      :is="props.customComponent"
      :connection-line-type="props.type"
      :connection-line-style="props.style"
      :from-node="connection.fromNode"
      :from-handle="connection.fromHandle"
      :from-x="connection.from.x"
      :from-y="connection.from.y"
      :to-x="connection.to.x"
      :to-y="connection.to.y"
      :from-position="connection.fromPosition"
      :to-position="connection.toPosition"
      :connection-status="getConnectionStatus(props.isValid)"
      :to-node="connection.toNode"
      :to-handle="connection.toHandle"
    />
    <path
      v-else
      :d="path"
      fill="none"
      class="vue-flow__connection-path"
      :style="props.style"
    />
  `,
          computed: {
            path() {
              return path.value;
            },
          },
        };
      },
    }),
  },
});
</script>

<style>
.vue-flow__connectionline {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  overflow: visible;
}

.vue-flow__connection-path {
  stroke: #555;
  stroke-width: 1;
}
</style>
