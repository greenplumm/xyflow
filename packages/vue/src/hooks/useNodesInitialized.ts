import { computed, type Ref } from 'vue';
import { nodeHasDimensions } from '@xyflow/system';
import { useStore } from './useStore';
import type { VueFlowStore } from '../types';

export type UseNodesInitializedOptions = {
  includeHiddenNodes?: boolean;
};

const selector = (options: UseNodesInitializedOptions) => (s: VueFlowStore) => {
  if (s.nodeLookup.size === 0) {
    return false;
  }

  for (const [, { hidden, internals }] of s.nodeLookup) {
    if (options.includeHiddenNodes || !hidden) {
      if (internals.handleBounds === undefined || !nodeHasDimensions(internals.userNode)) {
        return false;
      }
    }
  }

  return true;
};

/**
 * 这个hook告诉你flow中的所有节点是否已经被测量并赋予了宽度和高度。
 * 当你添加一个节点到flow中时，这个hook会返回`false`，然后在节点被测量后返回`true`。
 *
 * @public
 * @param options.includeHiddenNodes - 默认为false
 * @returns 返回一个计算属性，指示所有节点是否已初始化
 *
 * @example
 * ```ts
 * import { useNodesInitialized } from '@xyflow/vue';
 *
 * const options = {
 *   includeHiddenNodes: false,
 * };
 *
 * const nodesInitialized = useNodesInitialized(options);
 * ```
 */
export function useNodesInitialized(
  options: UseNodesInitializedOptions = {
    includeHiddenNodes: false,
  }
): Ref<boolean> {
  const store = useStore();
  return computed(() => selector(options)(store.value));
}