import type { CSSProperties } from 'vue'
import type {
  CoordinateExtent,
  NodeBase,
  OnError,
  NodeProps as NodePropsBase,
  InternalNodeBase,
} from '@xyflow/system'
import type { NodeTypes } from './general'

/**
 * The `Node` type represents everything Vue Flow needs to know about a given node.
 * Whenever you want to update a certain attribute of a node, you need to create a new
 * node object.
 *
 * @public
 */
export type Node<
  NodeData extends Record<string, unknown> = Record<string, unknown>,
  NodeType extends string = string
> = NodeBase<NodeData, NodeType> & {
  style?: CSSProperties
  className?: string
  resizing?: boolean
  focusable?: boolean
}

/**
 * The `InternalNode` type is identical to the base `Node` type but is extended
 * with additional properties used internally.
 *
 * @public
 */
export type InternalNode<NodeType extends Node = Node> = InternalNodeBase<NodeType>

/**
 * Handler for mouse events on nodes.
 */
export type NodeMouseHandler<NodeType extends Node = Node> = (
  event: MouseEvent,
  node: NodeType
) => void

/**
 * Handler for selection drag events on nodes.
 */
export type SelectionDragHandler<NodeType extends Node = Node> = (
  event: MouseEvent,
  nodes: NodeType[]
) => void

/**
 * Handler for node drag events.
 */
export type OnNodeDrag<NodeType extends Node = Node> = (
  event: MouseEvent,
  node: NodeType,
  nodes: NodeType[]
) => void

/**
 * Props passed to the NodeWrapper component.
 * @public
 */
export interface NodeWrapperProps<NodeType extends Node = Node> {
  id: string
  nodesConnectable: boolean
  elementsSelectable: boolean
  nodesDraggable: boolean
  nodesFocusable: boolean
  onClick?: NodeMouseHandler<NodeType>
  onDoubleClick?: NodeMouseHandler<NodeType>
  onMouseEnter?: NodeMouseHandler<NodeType>
  onMouseMove?: NodeMouseHandler<NodeType>
  onMouseLeave?: NodeMouseHandler<NodeType>
  onContextMenu?: NodeMouseHandler<NodeType>
  resizeObserver: ResizeObserver | null
  noDragClassName: string
  noPanClassName: string
  rfId: string
  disableKeyboardA11y: boolean
  nodeTypes?: NodeTypes
  nodeExtent?: CoordinateExtent
  onError?: OnError
  nodeClickDistance?: number
}

/**
 * Built-in node types provided by Vue Flow.
 * @public
 */
export type BuiltInNode =
  | Node<{ label: string }, 'input' | 'output' | 'default'>
  | Node<Record<string, never>, 'group'>

/**
 * Props passed to custom node components.
 * @public
 */
export type NodeProps<NodeType extends Node = Node> = NodePropsBase<NodeType>
