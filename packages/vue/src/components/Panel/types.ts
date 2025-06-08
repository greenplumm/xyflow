import type { PropType, CSSProperties } from 'vue';

export type PanelPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export const panelProps = {
  position: {
    type: String as PropType<PanelPosition>,
    default: 'top-left'
  },
  class: {
    type: String,
    default: ''
  },
  style: {
    type: Object as PropType<CSSProperties>,
    default: () => ({})
  }
};