<script setup lang="ts">
import { ref, watch } from 'vue';
import cc from 'classcat';
import type { Rect } from '@xyflow/system';
import type { EdgeTextProps } from '../../types';

const props = defineProps<EdgeTextProps>();

const edgeTextBbox = ref<Rect>({ x: 1, y: 0, width: 0, height: 0 });
const edgeTextRef = ref<SVGTextElement | null>(null);
const edgeTextClasses = computed(() => cc(['react-flow__edge-textwrapper', props.className]));

watch(
  () => props.label,
  () => {
    if (edgeTextRef.value) {
      const textBbox = edgeTextRef.value.getBBox();
      edgeTextBbox.value = {
        x: textBbox.x,
        y: textBbox.y,
        width: textBbox.width,
        height: textBbox.height,
      };
    }
  },
  { immediate: true }
);
</script>

<template>
  <g
    v-if="props.label"
    :transform="`translate(${props.x - edgeTextBbox.width / 2} ${props.y - edgeTextBbox.height / 2})`"
    :class="edgeTextClasses"
    :visibility="edgeTextBbox.width ? 'visible' : 'hidden'"
  >
    <rect
      v-if="props.labelShowBg"
      :width="edgeTextBbox.width + 2 * props.labelBgPadding[0]"
      :x="-props.labelBgPadding[0]"
      :y="-props.labelBgPadding[1]"
      :height="edgeTextBbox.height + 2 * props.labelBgPadding[1]"
      class="react-flow__edge-textbg"
      :style="props.labelBgStyle"
      :rx="props.labelBgBorderRadius"
      :ry="props.labelBgBorderRadius"
    />
    <text
      ref="edgeTextRef"
      class="react-flow__edge-text"
      :style="props.labelStyle"
      text-anchor="middle"
      dominant-baseline="middle"
    >
      {{ props.label }}
    </text>
  </g>
</template>
