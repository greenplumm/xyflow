import { computed } from 'vue';
import { getNodesInside } from '@xyflow/system';
import { useStore } from './useStore';
import type { Node, ReactFlowState } from '../types';

const selector = (onlyRenderVisible: boolean) => (s: ReactFlowState) => {
  return onlyRenderVisible
    ? getNodesInside<Node>(s.nodeLookup, { x: 0, y: 0, width: s.width, height: s.height }, s.transform, true).map(
      (node) => node.id
    )
    : Array.from(s.nodeLookup.keys());
};

/**
 * Hook for getting the visible node ids from the store.
 *
 * @internal
 * @param onlyRenderVisible
 * @returns array with visible node ids
 */
export function useVisibleNodeIds(onlyRenderVisible: boolean) {
  // const store = useStore();
  const nodeIds = useStore(selector(onlyRenderVisible));

  return nodeIds;
}