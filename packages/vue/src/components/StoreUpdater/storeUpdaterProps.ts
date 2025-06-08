import type { Node, Edge, VueFlowProps, FitViewOptions } from '@/types'
import type { CoordinateExtent } from '@xyflow/system'

/**
 * 完整列出 StoreUpdater 组件所需的 props 类型，替代 Pick<VueFlowProps, ...>
 */
export interface StoreUpdaterProps<NT extends Node = Node, ET extends Edge = Edge> {
  nodes?: NT[]
  edges?: ET[]
  defaultNodes?: NT[]
  defaultEdges?: ET[]

  onConnect?: VueFlowProps<NT, ET>['onConnect']
  onConnectStart?: VueFlowProps<NT, ET>['onConnectStart']
  onConnectEnd?: VueFlowProps<NT, ET>['onConnectEnd']
  onClickConnectStart?: VueFlowProps<NT, ET>['onClickConnectStart']
  onClickConnectEnd?: VueFlowProps<NT, ET>['onClickConnectEnd']

  nodesDraggable?: boolean
  nodesConnectable?: boolean
  nodesFocusable?: boolean
  edgesFocusable?: boolean
  edgesReconnectable?: boolean
  elevateNodesOnSelect?: boolean
  elevateEdgesOnSelect?: boolean

  minZoom?: number
  maxZoom?: number
  nodeExtent?: CoordinateExtent

  onNodesChange?: VueFlowProps<NT, ET>['onNodesChange']
  onEdgesChange?: VueFlowProps<NT, ET>['onEdgesChange']

  elementsSelectable?: boolean
  connectionMode?: VueFlowProps<NT, ET>['connectionMode']
  snapGrid?: VueFlowProps<NT, ET>['snapGrid']
  snapToGrid?: boolean
  translateExtent?: CoordinateExtent
  connectOnClick?: boolean
  defaultEdgeOptions?: VueFlowProps<NT, ET>['defaultEdgeOptions']

  fitView?: boolean
  fitViewOptions?: FitViewOptions

  onNodesDelete?: VueFlowProps<NT, ET>['onNodesDelete']
  onEdgesDelete?: VueFlowProps<NT, ET>['onEdgesDelete']
  onDelete?: VueFlowProps<NT, ET>['onDelete']

  onNodeDrag?: VueFlowProps<NT, ET>['onNodeDrag']
  onNodeDragStart?: VueFlowProps<NT, ET>['onNodeDragStart']
  onNodeDragStop?: VueFlowProps<NT, ET>['onNodeDragStop']

  onSelectionDrag?: VueFlowProps<NT, ET>['onSelectionDrag']
  onSelectionDragStart?: VueFlowProps<NT, ET>['onSelectionDragStart']
  onSelectionDragStop?: VueFlowProps<NT, ET>['onSelectionDragStop']

  onMoveStart?: VueFlowProps<NT, ET>['onMoveStart']
  onMove?: VueFlowProps<NT, ET>['onMove']
  onMoveEnd?: VueFlowProps<NT, ET>['onMoveEnd']

  noPanClassName?: string
  nodeOrigin?: VueFlowProps<NT, ET>['nodeOrigin']
  autoPanOnConnect?: boolean
  autoPanOnNodeDrag?: boolean

  onError?: VueFlowProps<NT, ET>['onError']
  connectionRadius?: number
  isValidConnection?: VueFlowProps<NT, ET>['isValidConnection']

  selectNodesOnDrag?: boolean
  nodeDragThreshold?: number
  onBeforeDelete?: VueFlowProps<NT, ET>['onBeforeDelete']

  debug?: boolean
  autoPanSpeed?: number
  paneClickDistance?: number

  /** 每次渲染实例的唯一 ID */
  rfId: string
}
