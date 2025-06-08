import { ref, watch, onUnmounted, type Ref } from 'vue';
import { XYDrag, type XYDragInstance } from '@xyflow/system';

import { handleNodeClick } from '../components/Nodes/utils';
import { useStoreApi } from './useStore';

type UseDragParams = {
  nodeRef: Ref<HTMLDivElement | null>;
  disabled?: boolean;
  noDragClassName?: string;
  handleSelector?: string;
  nodeId?: string;
  isSelectable?: boolean;
  nodeClickDistance?: number;
};

/**
 * Hook for calling XYDrag helper from @xyflow/system.
 *
 * @internal
 */
export function useDrag({
  nodeRef,
  disabled = false,
  noDragClassName,
  handleSelector,
  nodeId,
  isSelectable,
  nodeClickDistance,
}: UseDragParams) {
  const store = useStoreApi();
  const dragging = ref(false);
  const xyDrag = ref<XYDragInstance>();

  // 初始化XYDrag实例
  xyDrag.value = XYDrag({
    getStoreItems: () => store.getState(),
    onNodeMouseDown: (id: string) => {
      handleNodeClick({
        id,
        store,
        nodeRef: nodeRef.value,
      });
    },
    onDragStart: () => {
      dragging.value = true;
    },
    onDragStop: () => {
      dragging.value = false;
    },
  });

  // 监听参数变化更新XYDrag实例
  watch(
    [disabled, nodeRef, xyDrag ],
    () => {
      if (disabled) {
        xyDrag.value?.destroy();
      } else if (nodeRef.value) {
        xyDrag.value?.update({
          noDragClassName,
          handleSelector,
          domNode: nodeRef.value,
          isSelectable,
          nodeId,
          nodeClickDistance,
        });
      }
    },
    { immediate: true }
  );

  // 组件卸载时清理
  onUnmounted(() => {
    xyDrag.value?.destroy();
  });

  return dragging;
}