<script setup lang="ts">
import { useStore } from '../../hooks/useStore';
import type { ReactFlowState } from '../../types';

const style = { display: 'none' };
const ariaLiveStyle = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  border: '0',
  padding: '0',
  overflow: 'hidden',
  clip: 'rect(0px, 0px, 0px, 0px)',
  clipPath: 'inset(100%)',
};

import { ARIA_NODE_DESC_KEY, ARIA_EDGE_DESC_KEY, ARIA_LIVE_MESSAGE } from './constants';

const selector = (s: ReactFlowState) => s.ariaLiveMessage;

const props = defineProps<{
  rfId: string;
  disableKeyboardA11y?: boolean;
}>();

const ariaLiveMessage = useStore(selector);
</script>

<template>
  <div :id="`${ARIA_NODE_DESC_KEY}-${props.rfId}`" :style="style">
    Press enter or space to select a node.
    <span v-if="!props.disableKeyboardA11y">You can then use the arrow keys to move the node around.</span>
    Press delete to remove it and escape to cancel.
  </div>
  <div :id="`${ARIA_EDGE_DESC_KEY}-${props.rfId}`" :style="style">
    Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.
  </div>
  <div
    v-if="!props.disableKeyboardA11y"
    :id="`${ARIA_LIVE_MESSAGE}-${props.rfId}`"
    aria-live="assertive"
    aria-atomic="true"
    :style="ariaLiveStyle"
  >
    {{ ariaLiveMessage }}
  </div>
</template>
