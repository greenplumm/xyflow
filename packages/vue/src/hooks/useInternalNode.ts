import { computed } from 'vue';
import { useStoreApi } from './useStore';
import type { InternalNode, Node } from '../types';

/**
 * 这个钩子返回特定节点的内部表示。
 * 使用此钩子的组件会在节点变化时重新渲染，包括节点被选中或移动时。
 *
 * @public
 * @param id - 节点的id
 * @returns 节点的内部表示或undefined
 *
 * @example
 * ```vue
 *<script setup>
 *import { useInternalNode } from '@xyflow/vue';
 *
 *const internalNode = useInternalNode('node-1');
 *const absolutePosition = computed(() => internalNode.value?.internals.positionAbsolute);
 *</script>
 *
 *<template>
 *  <div>
 *    节点的绝对位置是:
 *    <p>x: {{ absolutePosition?.x }}</p>
 *    <p>y: {{ absolutePosition?.y }}</p>
 *  </div>
 *</template>
 *```
 */
export function useInternalNode<NodeType extends Node = Node>(id: string) {
  const store = useStoreApi();
  
  return computed(() => {
    return store.getState().nodeLookup.get(id) as InternalNode<NodeType> | undefined;
  });
}