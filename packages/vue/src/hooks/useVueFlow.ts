import { computed } from 'vue'
import type {
  Node as VueNode,
  Edge as VueEdge,
  InternalNode,
  VueFlowState,
  GeneralHelpers,
  Rect,
  VueFlowInstance,
} from '@/types'
import { elementToRemoveChange, isEdge, isNode } from '../utils';

import {
  evaluateAbsolutePosition,
  getElementsToRemove,
  getNodesBounds,
  getOverlappingArea,
  isRectObject,
  nodeToRect, 
} from '@xyflow/system'
import { useStore, useStoreApi } from './useStore'
import useViewportHelper from './useViewportHelper'
 
export function useVueFlow<
  NodeType extends VueNode = VueNode,
  EdgeType extends VueEdge = VueEdge
>(): VueFlowInstance<NodeType, EdgeType> {
  const viewportHelper = useViewportHelper()
  const storeApi = useStoreApi<NodeType, EdgeType>()
  const storeState = useStore((s: VueFlowState) => s)
  const viewportInitialized = computed(() => !!storeState.panZoom)

  const getInternalNode = (id: string): InternalNode<NodeType> =>
    storeApi.getState().nodeLookup.get(id) as InternalNode<NodeType>

  const setNodes: GeneralHelpers<NodeType, EdgeType>['setNodes'] = payload => {
    storeApi.getState().setNodes(payload)
  }

  const setEdges: GeneralHelpers<NodeType, EdgeType>['setEdges'] = payload => {
    storeApi.getState().setEdges(payload)
  }

  const getNodeRect = (nodeOrId: NodeType | { id: string }): Rect | null => {
    const { nodeLookup, nodeOrigin } = storeApi.getState()
    const node = isNode<NodeType>(nodeOrId)
      ? nodeOrId
      : nodeLookup.get(nodeOrId.id)!
    const position = node.parentId
      ? evaluateAbsolutePosition(
          node.position,
          node.measured,
          node.parentId,
          nodeLookup,
          nodeOrigin
        )
      : node.position
    const nodeWithPosition = {
      ...node,
      position,
      width: node.measured?.width ?? node.width,
      height: node.measured?.height ?? node.height,
    }
    return nodeToRect(nodeWithPosition)
  }

  const updateNode: GeneralHelpers<NodeType, EdgeType>['updateNode'] = (
    id,
    update,
    options = { replace: false }
  ) => {
    setNodes(prev =>
      prev.map(n => {
        if (n.id === id) {
          const next = typeof update === 'function' ? update(n) : update
          return options.replace && isNode(next)
            ? (next as NodeType)
            : { ...n, ...next }
        }
        return n
      })
    )
  }

  const updateEdge: GeneralHelpers<NodeType, EdgeType>['updateEdge'] = (
    id,
    update,
    options = { replace: false }
  ) => {
    setEdges(prev =>
      prev.map(e => {
        if (e.id === id) {
          const next = typeof update === 'function' ? update(e) : update
          return options.replace && isEdge(next)
            ? (next as EdgeType)
            : { ...e, ...next }
        }
        return e
      })
    )
  }

  const generalHelpers: GeneralHelpers<NodeType, EdgeType> = {
    getNodes: () => [...storeApi.getState().nodes] as NodeType[],
    getNode: id => getInternalNode(id).internals.userNode as NodeType,
    getInternalNode,
    getEdges: () => [...(storeApi.getState().edges ?? [])] as EdgeType[],
    getEdge: id => storeApi.getState().edgeLookup.get(id) as EdgeType,
    setNodes,
    setEdges,
    addNodes: payload =>
      setNodes(prev => [...prev, ...(Array.isArray(payload) ? payload : [payload])]),
    addEdges: payload =>
      setEdges(prev => [...prev, ...(Array.isArray(payload) ? payload : [payload])]),
    toObject: () => {
      const { nodes = [], edges = [], transform } = storeApi.getState()
      const [x, y, zoom] = transform
      return { nodes: [...nodes], edges: [...edges], viewport: { x, y, zoom } }
    },
    deleteElements: async ({ nodes: nodesToRemove = [], edges: edgesToRemove = [] }) => {
      const state = storeApi.getState()
      const {
        nodes,
        edges,
        onNodesDelete,
        onEdgesDelete,
        triggerNodeChanges,
        triggerEdgeChanges,
        onDelete,
        onBeforeDelete,
      } = state
      const { nodes: remNodes, edges: remEdges } = await getElementsToRemove({
        nodesToRemove,
        edgesToRemove,
        nodes,
        edges,
        onBeforeDelete,
      })
      if (remEdges.length) {
        const edgeChanges = remEdges.map(elementToRemoveChange)
        onEdgesDelete?.(remEdges)
        triggerEdgeChanges(edgeChanges)
      }
      if (remNodes.length) {
        const nodeChanges = remNodes.map(elementToRemoveChange)
        onNodesDelete?.(remNodes)
        triggerNodeChanges(nodeChanges)
      }
      if (remNodes.length || remEdges.length) {
        onDelete?.({ nodes: remNodes, edges: remEdges })
      }
      return { deletedNodes: remNodes, deletedEdges: remEdges }
    },
    getIntersectingNodes: (
      nodeOrRect,
      partially = true,
      nodesParam
    ) => {
      const isRect = isRectObject(nodeOrRect)
      const rect = isRect
        ? nodeOrRect
        : getNodeRect(nodeOrRect as any)!
      const list = nodesParam ?? storeApi.getState().nodes
      return list.filter(n => {
        const internal = storeApi.getState().nodeLookup.get(n.id)
        if (internal && !isRect && n.id === (nodeOrRect as any).id) return false
        const currRect = nodeToRect(internal ?? n)
        const overlap = getOverlappingArea(currRect, rect)
        return partially
          ? overlap > 0
          : overlap >= rect.width * rect.height
      }) as NodeType[]
    },
    isNodeIntersecting: (
      nodeOrRect,
      area,
      partially = true
    ) => {
      const rect = isRectObject(nodeOrRect)
        ? nodeOrRect
        : getNodeRect(nodeOrRect as any)!
      const overlap = getOverlappingArea(rect, area)
      return partially
        ? overlap > 0
        : overlap >= area.width * area.height
    },
    updateNode,
    updateNodeData: (id, dataUpdate, options) =>
      updateNode(
        id,
        n => ({
          ...n,
          data:
            typeof dataUpdate === 'function'
              ? dataUpdate(n)
              : dataUpdate,
        }),
        options
      ),
    updateEdge,
    updateEdgeData: (id, dataUpdate, options) =>
      updateEdge(
        id,
        e => ({
          ...e,
          data:
            typeof dataUpdate === 'function'
              ? dataUpdate(e)
              : dataUpdate,
        }),
        options
      ),
    getNodesBounds: nodes =>
      getNodesBounds(nodes, {
        nodeLookup: storeApi.getState().nodeLookup,
        nodeOrigin: storeApi.getState().nodeOrigin,
      }),
    getHandleConnections: ({ type, id, nodeId }) =>
      Array.from(
        storeApi
          .getState()
          .connectionLookup.get(
            `${nodeId}-${type}${
              id ? `-${id}` : ''
            }`
          )
          ?.values() ?? []
      ),
    getNodeConnections: ({ type, handleId, nodeId }) =>
      Array.from(
        storeApi
          .getState()
          .connectionLookup.get(
            `${nodeId}${
              type
                ? handleId
                  ? `-${type}-${handleId}`
                  : `-${type}`
                : ''
            }`
          )
          ?.values() ?? []
      ),
  }

  return {
    ...generalHelpers,
    ...viewportHelper,
    viewportInitialized: viewportInitialized.value,
  }
}
