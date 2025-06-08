<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useVueFlow } from '../../hooks/useVueFlow';
import MiniMapNode from './MiniMapNode.vue';
import type { MiniMapProps } from './types';

const props = defineProps<MiniMapProps>();

const { viewport, nodes, getNodes } = useVueFlow();

const viewportScale = computed(() => ({
  translateX: -viewport.value.x * props.scale,
  translateY: -viewport.value.y * props.scale,
  scaleX: props.scale,
  scaleY: props.scale,
}));

const scaledWidth = computed(() => viewport.value.width * props.scale);
const scaledHeight = computed(() => viewport.value.height * props.scale);
</script>

<template>
  <div class="vue-flow__minimap">
    <svg :width="scaledWidth" :height="scaledHeight" :viewBox="`0 0 ${viewport.width} ${viewport.height}`">
      <g
        :transform="`translate(${viewportScale.translateX} ${viewportScale.translateY}) scale(${viewportScale.scaleX} ${viewportScale.scaleY})`"
      >
        <MiniMapNode
          v-for="node in getNodes"
          :key="node.id"
          :x="node.position.x"
          :y="node.position.y"
          :width="node.dimensions.width"
          :height="node.dimensions.height"
          :color="node.style?.background || '#fff'"
        />
      </g>
    </svg>
  </div>
</template>
