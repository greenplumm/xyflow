import type { Ref } from 'vue'
import { useStoreApi } from '../../hooks/useStore'
import { errorMessages } from '@xyflow/system'

type StoreApi = ReturnType<typeof useStoreApi>

/**
 * Handles selection and unselection of a node in Vue Flow.
 * @param options.id - node id to select/unselect
 * @param options.unselect - if true, forces unselection when already selected
 * @param options.nodeRef - ref to the node element, for blurring focus after unselect
 */
export function handleNodeClick(
  {
  id,
  store,
  unselect = false,
  nodeRef,
}: {
    id: string,
    store: StoreApi,
    unselect: boolean,
    nodeRef?: Ref<HTMLElement | null>
  }
) {
  // const { id, store, nodeRef } = options
 
  const state = store.getState()
   
  const addSelectedNodes = state.addSelectedNodes;
  const unselectNodesAndEdges = state.unselectNodesAndEdges;
  const multiSelectionActive = state.multiSelectionActive;
  const nodeLookup = state.nodeLookup;
  const onError = state.onError;

  const node = nodeLookup.get(id)
  if (!node) {
    onError?.('012', errorMessages['error012'](id))
    return
  }

  // 取消节点多选模式
  store.setState({ nodesSelectionActive: false })

  if (!node.selected) {
    // 未选中时，选中
    addSelectedNodes([id])
  } else if (unselect || (node.selected && multiSelectionActive)) {
    // 强制取消选中或多选模式下取消
    unselectNodesAndEdges({ nodes: [node], edges: [] })
    // 动画帧后失焦
    requestAnimationFrame(() => nodeRef?.value?.blur())
  }
}
