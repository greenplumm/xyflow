import { computed } from 'vue';
import { ConnectionState, pointToRendererPoint } from '@xyflow/system';
import { useStore } from './useStore';
import type { InternalNode, Node, VueFlowStore } from '../types';

function storeSelector(s: VueFlowStore) {
  return s.connection.inProgress
    ? { ...s.connection, to: pointToRendererPoint(s.connection.to, s.transform) }
    : { ...s.connection };
}

function getSelector<NodeType extends Node = Node, SelectorReturn = ConnectionState<InternalNode<NodeType>>>(
  connectionSelector?: (connection: ConnectionState<InternalNode<NodeType>>) => SelectorReturn
): (s: VueFlowStore) => SelectorReturn | ConnectionState<InternalNode> {
  if (connectionSelector) {
    const combinedSelector = (s: VueFlowStore) => {
      const connection = storeSelector(s) as ConnectionState<InternalNode<NodeType>>;
      return connectionSelector(connection);
    };
    return combinedSelector;
  }

  return storeSelector;
}

/**
 * Vue版本的`useConnection`钩子返回当前连接状态，当有活跃连接交互时返回连接状态，否则返回null。
 * 典型用例是根据条件（如连接是否有效）来改变手柄颜色。
 *
 * @public
 * @example
 *
 * ```vue
 *<script setup>
 *import { useConnection } from '@xyflow/vue';
 *
 *const connection = useConnection();
 *</script>
 *
 *<template>
 *  <div>
 *    {{ connection ? `有人正尝试从${connection.fromNode}连接到这个节点` : '当前没有传入连接' }}
 *  </div>
 *</template>
 * ```
 *
 * @returns ConnectionState的响应式引用
 */
export function useConnection<NodeType extends Node = Node, SelectorReturn = ConnectionState<InternalNode<NodeType>>>(
  connectionSelector?: (connection: ConnectionState<InternalNode<NodeType>>) => SelectorReturn
) { 
  const combinedSelector = getSelector<NodeType, SelectorReturn>(connectionSelector);
  
  return useStore(combinedSelector) as SelectorReturn;
}