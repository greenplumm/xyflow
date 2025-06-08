import { computed } from 'vue'
import { useStore } from './useStore'
import { storeToRefs } from 'pinia'
import type { Node, Dimensions } from '@xyflow/system'

export function useNodeInternals(nodeId: string) {
  const store = useStore()
  const { nodes } = storeToRefs(store)

  const node = computed(() => nodes.value.find(n => n.id === nodeId))

  const updateDimensions = (dimensions: Dimensions) => {
    if (node.value) {
      store.updateNodeDimensions([{ id: nodeId, ...dimensions }])
    }
  }

  return {
    dimensions: computed(() => node.value?.dimensions || null),
    updateDimensions,
    isInitialized: computed(() => !!node.value?.dimensions)
  }
}