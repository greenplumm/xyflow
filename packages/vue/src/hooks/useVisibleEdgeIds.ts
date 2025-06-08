import { isEdgeVisible } from '@xyflow/system';
import { computed } from 'vue';
import { useStore } from './useStore';
import type { VueFlowState } from '../types';

/**
 * 获取可见边ID的钩子
 * @internal
 * @param onlyRenderVisible 是否只渲染可见边
 * @returns 可见边ID数组
 */
export function useVisibleEdgeIds(onlyRenderVisible: boolean) {
  const store = useStore((state) => ({
    edges: state.edges,
    nodeLookup: state.nodeLookup,
    width: state.width,
    height: state.height,
    transform: state.transform
  }));
  
  if (!onlyRenderVisible) {
    return store.value.edges?.map((edge) => edge.id) || [];
  }

    const visibleEdgeIds: string[] = [];

    if (store.width && store.height) {
      for (const edge of store.edges) {
        const sourceNode = store.nodeLookup.get(edge.source);
        const targetNode = store.nodeLookup.get(edge.target);

        if (
          sourceNode &&
          targetNode &&
          isEdgeVisible({
            sourceNode,
            targetNode,
            width: store.width,
            height: store.height,
            transform: store.transform,
          })
        ) {
          visibleEdgeIds.push(edge.id);
        }
      }
    }

    return visibleEdgeIds;
}