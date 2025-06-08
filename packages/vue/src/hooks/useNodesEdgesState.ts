import { computed } from 'vue'
import type { Node, Edge } from '../types'
import { useStore } from './useStore'

export function useNodesState<NodeType extends Node = Node>() {
  const nodes = useStore((s) => s.nodes)
  return {
    nodes: computed(() => nodes.value as NodeType[]),
    setNodes: (nodes: NodeType[]) => useStoreApi().setState({ nodes })
  }
}

export function useEdgesState<EdgeType extends Edge = Edge>() {
  const edges = useStore((s) => s.edges)
  return {
    edges: computed(() => edges.value as EdgeType[]),
    setEdges: (edges: EdgeType[]) => useStoreApi().setState({ edges })
  }
}