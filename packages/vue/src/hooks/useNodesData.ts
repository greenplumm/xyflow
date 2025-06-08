import { computed } from 'vue'
import { useStore } from './useStore'
import { storeToRefs } from 'pinia'
import type { Node } from '@xyflow/system'

export function useNodesData<NodeType extends Node = Node>(nodeIds: string | string[]) {
  const store = useStore()
  const { nodes } = storeToRefs(store)

  return computed(() => {
    const ids = Array.isArray(nodeIds) ? nodeIds : [nodeIds]
    return nodes.value
      .filter((node) => ids.includes(node.id))
      .map((node) => ({
        id: node.id,
        type: node.type,
        data: node.data
      })) as Pick<NodeType, 'id' | 'type' | 'data'>[]
  })
}