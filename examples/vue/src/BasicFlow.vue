<script setup lang="ts">
import { VueFlow, Background, BackgroundVariant } from '@xyflow/vue';
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
    className: 'light',
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    className: 'light',
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 400, y: 100 },
    className: 'light',
  },
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 400, y: 200 },
    className: 'light',
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];
</script>

<template>
  <div class="flow-container">
    <VueFlow :defaultNodes="initialNodes" :defaultEdges="initialEdges" fit-view>
      <Background :variant="BackgroundVariant.Dots" />
    </VueFlow>
  </div>
</template>

<style>
.flow-container {
  width: 100vw;
  height: 100vh;
}
</style>
