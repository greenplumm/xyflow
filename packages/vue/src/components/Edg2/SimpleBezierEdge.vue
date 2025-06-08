<script setup lang="ts">
import { computed } from 'vue'
import { getBezierPath } from '@xyflow/system'
import type { CSSProperties } from 'vue'

defineProps<{
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition?: string
  targetPosition?: string
  curvature?: number
  markerStart?: string
  markerEnd?: string
  style?: CSSProperties
  className?: string
}>()

const path = computed(() =>
  getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetX: props.targetX,
    targetY: props.targetY,
    sourcePosition: props.sourcePosition,
    targetPosition: props.targetPosition,
    curvature: props.curvature
  })
)
</script>

<template>
  <path
    :d="path"
    :class="['vue-flow__edge-path', className]"
    :style="style"
    :marker-start="markerStart"
    :marker-end="markerEnd"
  />
</template>