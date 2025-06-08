<script setup lang="ts">
import { computed, watchEffect, ref } from 'vue';
import type { CSSProperties } from 'vue';

defineProps<{
  x: number;
  y: number;
  label?: string;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  className?: string;
}>();

const textRef = ref<SVGTextElement>();
const bgRect = ref<SVGRectElement>();
const bgWidth = ref(0);
const bgHeight = ref(0);

watchEffect(() => {
  if (textRef.value && bgRect.value) {
    const textBBox = textRef.value.getBBox();
    bgWidth.value = textBBox.width + 8;
    bgHeight.value = textBBox.height + 4;
  }
});

const transform = computed(() => `translate(${props.x},${props.y})`);
const bgStyle = computed(() => ({
  fill: 'white',
  stroke: 'white',
  strokeWidth: 3,
  ...props.labelStyle,
}));
</script>

<template>
  <g :transform="transform" :class="className">
    <rect
      v-if="labelShowBg"
      ref="bgRect"
      :width="bgWidth"
      :height="bgHeight"
      :x="-bgWidth / 2"
      :y="-bgHeight / 2"
      :style="bgStyle"
      rx="2"
      ry="2"
    />
    <text ref="textRef" text-anchor="middle" dominant-baseline="middle" :style="labelStyle">
      {{ label }}
    </text>
  </g>
</template>
