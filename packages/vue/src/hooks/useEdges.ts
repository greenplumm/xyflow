import { computed } from 'vue'
import { useStore } from './useStore'
import { storeToRefs } from 'pinia'

export function useEdges() {
  const store = useStore()
  const { edges } = storeToRefs(store)
  
  return computed(() => edges.value.map(edge => ({
    ...edge,
    selected: store.selectedEdges.includes(edge.id),
    zIndex: edge.zIndex || 0
  })))
}