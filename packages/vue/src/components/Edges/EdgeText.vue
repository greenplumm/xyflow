<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import type { Rect } from '@xyflow/system';
import type { EdgeTextProps } from '../../types';

const props = defineProps<EdgeTextProps>();

const edgeTextBbox = ref<Rect>({ x: 1, y: 0, width: 0, height: 0 });
const edgeTextRef = ref<SVGTextElement | null>(null);

watchEffect(() => {
  if (edgeTextRef.value && props.label) {
    const textBbox = edgeTextRef.value.getBBox();
    edgeTextBbox.value = {
      x: textBbox.x,
      y: textBbox.y,
      width: textBbox.width,
      height: textBbox.height,
    };
  }
});
</script>

<template>
  <g
    v-if="props.label"
    :transform="`translate(${props.x - edgeTextBbox.width / 2} ${props.y - edgeTextBbox.height / 2})`"
    :class="['vue-flow__edge-textwrapper', props.className]"
    :visibility="edgeTextBbox.width ? 'visible' : 'hidden'"
    v-bind="$attrs"
  >
    <rect
      v-if="props.labelShowBg"
      :width="edgeTextBbox.width + 2 * props.labelBgPadding[0]"
      :x="-props.labelBgPadding[0]"
      :y="-props.labelBgPadding[1]"
      :height="edgeTextBbox.height + 2 * props.labelBgPadding[1]"
      class="vue-flow__edge-textbg"
      :style="props.labelBgStyle"
      :rx="props.labelBgBorderRadius"
      :ry="props.labelBgBorderRadius"
    />
    <text
      class="vue-flow__edge-text"
      :y="edgeTextBbox.height / 2"
      dy="0.3em"
      ref="edgeTextRef"
      :style="props.labelStyle"
    >
      {{ props.label }}
    </text>
    <slot />
  </g>
</template>

<style>
.vue-flow__edge-textwrapper {
  user-select: none;
  pointer-events: none;
}

.vue-flow__edge-textbg {
  fill: white;
}

.vue-flow__edge-text {
  font-size: 12px;
  fill: #333;
}
</style>
