import { computed } from 'vue'
import { useStore } from './useStore'
import { storeToRefs } from 'pinia'
import { getHandleBounds } from '@xyflow/system'

export function useHandleConnections(nodeId: string) {
  const store = useStore()
  const { edges, nodes } = storeToRefs(store)

  return computed(() => {
    const node = nodes.value.find(n => n.id === nodeId)
    if (!node) return []

    const handleBounds = getHandleBounds(node)
    return edges.value.filter(edge => {
      return (
        (edge.source === nodeId && handleBounds.source) ||
        (edge.target === nodeId && handleBounds.target)
      )
    })
  })
}