import { computed, watch, type Ref } from 'vue';
import { useStore } from './useStore';
import { useNodeId } from '../contexts/NodeIdContext';
import {
  Connection,
  NodeConnection,
  HandleType,
  areConnectionMapsEqual,
  handleConnectionChange,
  errorMessages,
} from '@xyflow/system';

const error014 = errorMessages['error014']();

type UseNodeConnectionsParams = {
  id?: string;
  handleType?: HandleType;
  handleId?: string;
  onConnect?: (connections: Connection[]) => void;
  onDisconnect?: (connections: Connection[]) => void;
};

/**
 * 这个钩子返回特定节点上的连接数组，可以按handle类型('source', 'target')或handle ID进行过滤。
 *
 * @public
 * @param param.id - 节点ID - 如果在自定义节点内调用则为可选
 * @param param.handleType - 按handle类型过滤 'source' 或 'target'
 * @param param.handleId - 按handle ID过滤（仅在节点有多个相同类型的handle时需要）
 * @param param.onConnect - 当建立连接时调用
 * @param param.onDisconnect - 当移除连接时调用
 * @returns 连接数组
 *
 * @example
 * ```vue
 *<script setup>
 *import { useNodeConnections } from '@xyflow/vue';
 *
 *const connections = useNodeConnections({
 *  handleType: 'target',
 *  handleId: 'my-handle',
 *});
 *</script>
 *
 *<template>
 *  <div>当前有 {{ connections.length }} 个传入连接！</div>
 *</template>
 *```
 */
export function useNodeConnections({
  id,
  handleType,
  handleId,
  onConnect,
  onDisconnect,
}: UseNodeConnectionsParams = {}): Ref<NodeConnection[]> {
  const nodeId = useNodeId();
  const currentNodeId = id ?? nodeId;

  if (!currentNodeId) {
    throw new Error(error014);
  }

  const store = useStore();
  const prevConnections = computed(() => {
    const lookupKey = `${currentNodeId}${handleType ? (handleId ? `-${handleType}-${handleId}` : `-${handleType}`) : ''}`;
    return store.connectionLookup.get(lookupKey);
  });

  const connections = computed(() => {
    return Array.from(prevConnections.value?.values() ?? []);
  });

  watch(prevConnections, (newConnections, oldConnections) => {
    if (oldConnections && newConnections && !areConnectionMapsEqual(newConnections, oldConnections)) {
      handleConnectionChange(oldConnections, newConnections, onDisconnect);
      handleConnectionChange(newConnections, oldConnections, onConnect);
    }
  }, { immediate: true });

  return connections;
}