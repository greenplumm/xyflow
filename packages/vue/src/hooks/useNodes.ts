import { computed } from 'vue'
import { useStore } from './useStore'
import type { Node } from '../types'

export function useNodes<NodeType extends Node = Node>() {
  const store = useStore()
  return computed(() => store.getState().nodes as NodeType[])
}