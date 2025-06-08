<template>
  <div>
    {{ data?.label }}
    <Handle :id="id" type="source" :position="sourcePosition" :is-connectable="isConnectable" />
  </div>
</template>

<script lang="ts">
import { Position } from '@xyflow/system';
import { default as Handle } from '../Handle/index.vue';

export default {
  name: 'InputNode',
  components: { Handle },
  props: {
    id: {
      type: String,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    isConnectable: {
      type: Boolean,
      default: true,
    },
    sourcePosition: {
      type: String,
      default: Position.Bottom,
    },
  },
};
</script>

<style scoped>
/* Add any necessary styles here */
</style>
