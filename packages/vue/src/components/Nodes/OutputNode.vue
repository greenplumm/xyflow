<template>
  <div>
    <Handle :id="id" type="target" :position="targetPosition" :is-connectable="isConnectable" />
    {{ data?.label }}
  </div>
</template>

<script lang="ts">
import { Position } from '@xyflow/system';
import { default as Handle } from '../Handle/index.vue';

import type { BuiltInNode, NodeProps } from '../../types/nodes';

export default {
  name: 'OutputNode',
  components: { Handle },
  props: {
    id: {
      type: String,
    },
    data: {
      type: Object as () => BuiltInNode,
      required: true,
    },
    isConnectable: {
      type: Boolean,
      default: true,
    },
    targetPosition: {
      type: String as () => Position,
      default: Position.Top,
    },
  },
};
</script>
