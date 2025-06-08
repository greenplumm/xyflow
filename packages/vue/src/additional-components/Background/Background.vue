<template>
  <svg
    :class="cc(['vue-flow__background', className])"
    :style="{
      ...style,
      ...containerStyle,
      '--xy-background-color-props': bgColor,
      '--xy-background-pattern-color-props': color,
    }"
    ref="svgRef"
    data-testid="rf__background"
  >
    <pattern
      :id="_patternId"
      :x="transform[0] % scaledGap[0]"
      :y="transform[1] % scaledGap[1]"
      :width="scaledGap[0]"
      :height="scaledGap[1]"
      patternUnits="userSpaceOnUse"
      :patternTransform="`translate(-${scaledOffset[0]},-${scaledOffset[1]})`"
    >
      <Patterns v-if="isDots" type="dot" :radius="scaledSize / 2" :className="patternClassName" />
      <Patterns
        v-else
        type="line"
        :dimensions="patternDimensions"
        :lineWidth="lineWidth"
        :variant="variant"
        :className="patternClassName"
      />
    </pattern>
    <rect x="0" y="0" width="100%" height="100%" :fill="`url(#${_patternId})`" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import cc from 'classcat';
import { useStore } from '../../hooks/useStore';
import { default as Patterns } from './Patterns.vue';
import { containerStyle } from '../../styles/utils';
import { BackgroundVariant } from './types';
import type { BackgroundProps } from './types';
import type { VueFlowState } from '../../types';

const defaultSize = {
  [BackgroundVariant.Dots]: 1,
  [BackgroundVariant.Lines]: 1,
  [BackgroundVariant.Cross]: 6,
};

const selector = (s: VueFlowState) => ({
  transform: s.transform,
  patternId: `pattern-${s.rfId}`,
});

export default defineComponent({
  name: 'Background',
  components: { Patterns },
  props: {
    id: {
      type: String,
      required: false,
    },
    variant: {
      type: String as PropType<BackgroundVariant>,
      default: BackgroundVariant.Dots,
    },
    gap: {
      type: [Number, Array] as PropType<number | [number, number]>,
      default: 20,
    },
    size: {
      type: Number,
      required: false,
    },
    lineWidth: {
      type: Number,
      default: 1,
    },
    offset: {
      type: [Number, Array] as PropType<number | [number, number]>,
      default: 0,
    },
    color: {
      type: String,
      required: false,
    },
    bgColor: {
      type: String,
      required: false,
    },
    style: {
      type: Object as PropType<CSSProperties>,
      required: false,
    },
    className: {
      type: String,
      required: false,
    },
    patternClassName: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const svgRef = ref<SVGSVGElement | null>(null);
    const slice = useStore(selector);
    const transform = slice.value.transform;
    const patternId = slice.value.patternId;

    const patternSize = props.size || defaultSize[props.variant];
    const isDots = props.variant === BackgroundVariant.Dots;
    const isCross = props.variant === BackgroundVariant.Cross;
    const gapXY: [number, number] = Array.isArray(props.gap) ? props.gap : [props.gap, props.gap];
    const scaledGap: [number, number] = [gapXY[0] * transform[2] || 1, gapXY[1] * transform[2] || 1];
    const scaledSize = patternSize * transform[2];
    const offsetXY: [number, number] = Array.isArray(props.offset) ? props.offset : [props.offset, props.offset];

    const patternDimensions: [number, number] = isCross ? [scaledSize, scaledSize] : scaledGap;
    const scaledOffset: [number, number] = [
      offsetXY[0] * transform[2] || 1 + patternDimensions[0] / 2,
      offsetXY[1] * transform[2] || 1 + patternDimensions[1] / 2,
    ];

    const _patternId = `${patternId}${props.id ? props.id : ''}`;

    return {
      svgRef,
      cc,
      containerStyle,
      isDots,
      patternDimensions,
      lineWidth: props.lineWidth,
      variant: props.variant,
      patternClassName: props.patternClassName,
      className: props.className,
      style: props.style,
      bgColor: props.bgColor,
      color: props.color,
      transform,
      scaledGap,
      scaledOffset,
      _patternId,
      scaledSize,
    };
  },
});
</script>
