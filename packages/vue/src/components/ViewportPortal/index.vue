<template>
  <Teleport :to="viewPortalDiv" v-if="viewPortalDiv">
    <slot />
  </Teleport>
</template>

<script setup lang="ts">
import { useStore } from '../../hooks/useStore';
import type { VueFlowState } from '../../types';

const selector = (s: VueFlowState) => s.domNode?.querySelector('.react-flow__viewport-portal');
const viewPortalDiv = useStore(selector);
</script>
