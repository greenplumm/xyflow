<script setup lang="ts">
import type { ControlButtonProps } from './types';

defineProps<ControlButtonProps>();

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();
</script>

<template>
  <button
    :class="['vue-flow__controls-button', className]"
    :style="style"
    :title="title"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <slot>
      <svg :class="`vue-flow__controls-icon ${disabled ? 'vue-flow__controls-icon-disabled' : ''}`" viewBox="0 0 24 24">
        <path d="M18.984 6.422h-6.422v-6.422h-1.031v6.422h-6.422v1.031h6.422v6.406h1.031v-6.406h6.422z" />
      </svg>
    </slot>
  </button>
</template>
