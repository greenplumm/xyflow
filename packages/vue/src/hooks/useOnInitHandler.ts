import { ref, watch } from 'vue';
import type { OnInit, Node, Edge } from '../types';
import { useVueFlow } from './useVueFlow';

/**
 * Hook for calling onInit handler.
 *
 * @internal
 */
export function useOnInitHandler<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  onInit: OnInit<NodeType, EdgeType> | undefined
) {
  const vueFlowInstance = useVueFlow<NodeType, EdgeType>();
  const isInitialized = ref<boolean>(false);

  watch(
    () => vueFlowInstance.viewportInitialized,
    (initialized) => {
      if (!isInitialized.value && initialized && onInit) {
        setTimeout(() => onInit(vueFlowInstance), 1);
        isInitialized.value = true;
      }
    },
    { immediate: true }
  );
}