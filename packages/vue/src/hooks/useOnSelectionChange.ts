import { watch, onUnmounted } from 'vue';
import { useStoreApi } from './useStore';
import type { OnSelectionChangeFunc, Node, Edge } from '../types';

export type UseOnSelectionChangeOptions<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  onChange: OnSelectionChangeFunc<NodeType, EdgeType>;
};

/**
 * 这个钩子让你可以监听节点和边选择的变化。
 * 正如其名，当你提供的回调函数会在节点或边的选择状态发生变化时被调用。
 *
 * @public
 * @param params.onChange - 要注册的处理函数
 *
 * @example
 * ```vue
 *<script setup>
 *import { ref } from 'vue';
 *import { useOnSelectionChange } from '@xyflow/vue';
 *
 *const selectedNodes = ref([]);
 *const selectedEdges = ref([]);
 *
 *useOnSelectionChange({
 *  onChange: ({ nodes, edges }) => {
 *    selectedNodes.value = nodes.map(node => node.id);
 *    selectedEdges.value = edges.map(edge => edge.id);
 *  },
 *});
 *</script>
 *```
 *
 * @remarks 你需要使用Vue的computed或watchEffect来确保传递的`onChange`处理函数是稳定的，否则钩子可能无法正常工作。
 */
export function useOnSelectionChange<NodeType extends Node = Node, EdgeType extends Edge = Edge>({
  onChange,
}: UseOnSelectionChangeOptions<NodeType, EdgeType>) {
  const store = useStoreApi<NodeType, EdgeType>();

  watch(() => onChange, (newHandler, oldHandler) => {
    if (oldHandler) {
      const nextHandlers = store.getState().onSelectionChangeHandlers.filter(fn => fn !== oldHandler);
      store.setState({ onSelectionChangeHandlers: nextHandlers });
    }
    
    if (newHandler) {
      const nextHandlers = [...store.getState().onSelectionChangeHandlers, newHandler];
      store.setState({ onSelectionChangeHandlers: nextHandlers });
    }
  }, { immediate: true });

  onUnmounted(() => {
    const nextHandlers = store.getState().onSelectionChangeHandlers.filter(fn => fn !== onChange);
    store.setState({ onSelectionChangeHandlers: nextHandlers });
  });
}