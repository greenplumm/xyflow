<script setup lang="ts">
import { computed } from 'vue';
import { type MarkerProps, createMarkerIds } from '@xyflow/system';
import { useStore } from '../../hooks/useStore';
import { useMarkerSymbol } from './MarkerSymbols';

interface MarkerDefinitionsProps {
  defaultColor: string;
  rfId?: string;
}

const props = defineProps<MarkerDefinitionsProps>();

const edges = useStore((s) => s.edges);
const defaultEdgeOptions = useStore((s) => s.defaultEdgeOptions);

const markers = computed(() => {
  return createMarkerIds(edges.value || [], {
    id: props.rfId,
    defaultColor: props.defaultColor,
    defaultMarkerStart: defaultEdgeOptions?.markerStart,
    defaultMarkerEnd: defaultEdgeOptions?.markerEnd,
  });
});
</script>

<template>
  <svg v-if="markers.length" class="react-flow__marker">
    <defs>
      <marker
        v-for="marker in markers"
        :key="marker.id"
        class="react-flow__arrowhead"
        :id="marker.id"
        :markerWidth="marker.width"
        :markerHeight="marker.height"
        viewBox="-10 -10 20 20"
        :markerUnits="marker.markerUnits"
        :orient="marker.orient"
        refX="0"
        refY="0"
      >
        <use :href="`#vue-flow__${marker.type}`" :stroke="marker.color" :stroke-width="marker.strokeWidth" />
      </marker>
    </defs>
  </svg>
</template>
