import { ref, watchEffect, onUnmounted } from 'vue'
import { useNodesStore } from '../store/nodes'

export function useUpdateNodeInternals(nodeId?: string) {
  const store = useStore()
  const updateTrigger = ref(0)
  
  const updateInternals = (id: string) => {
    const node = store.getNodeInternals(id)
    if (node) {
      store.setNodeInternals({
        ...node,
        __rf: {
          ...node.__rf,
          handleBounds: node.__rf.handleBounds,
          initialized: true
        }
      })
      updateTrigger.value++
    }
  }

  watchEffect(() => {
    if (nodeId) {
      updateInternals(nodeId)
    }
  })

  onUnmounted(() => {
    if (nodeId) {
      store.removeNodeInternals(nodeId)
    }
  })

  return {
    update: () => nodeId && updateInternals(nodeId),
    updateTrigger
  }
}