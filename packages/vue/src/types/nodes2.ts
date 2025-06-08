import type { CSSProperties } from 'vue';
import type { CoordinateExtent, NodeBase, OnError, NodeProps as NodePropsBase, InternalNodeBase } from '@xyflow/system';

import { NodeTypes } from './general';

/**
 * Vue适配的节点类型定义
 * @public
 */
export type Node<
  NodeData extends Record<string, unknown> = Record<string, unknown>,
  NodeType extends string = string
> = NodeBase<NodeData, NodeType> & {
  style?: CSSProperties;
  className?: string;
  resizing?: boolean;
  focusable?: boolean;
};

/**
 * 内部使用的节点类型
 * @public
 */
export type InternalNode<NodeType extends Node = Node> = InternalNodeBase<NodeType>;

export type NodeMouseHandler<NodeType extends Node = Node> = (event: MouseEvent, node: NodeType) => void;
export type SelectionDragHandler<NodeType extends Node = Node> = (event: MouseEvent, nodes: NodeType[]) => void;
export type OnNodeDrag<NodeType extends Node = Node> = (
  event: MouseEvent,
  node: NodeType,
  nodes: NodeType[]
) => void;

export type NodeWrapperProps<NodeType extends Node> = {
  id: string;
  nodesConnectable: boolean;
  elementsSelectable: boolean;
  nodesDraggable: boolean;
  nodesFocusable: boolean;
  onClick?: NodeMouseHandler<NodeType>;
  onDoubleClick?: NodeMouseHandler<NodeType>;
  onMouseEnter?: NodeMouseHandler<NodeType>;
  onMouseMove?: NodeMouseHandler<NodeType>;
  onMouseLeave?: NodeMouseHandler<NodeType>;
  onContextMenu?: NodeMouseHandler<NodeType>;
  resizeObserver: ResizeObserver | null;
  noDragClassName: string;
  noPanClassName: string;
  rfId: string;
  disableKeyboardA11y: boolean;
  nodeTypes?: NodeTypes;
  nodeExtent?: CoordinateExtent;
  onError?: OnError;
  nodeClickDistance?: number;
};

/**
 * 内置节点类型
 * @public
 */
export type BuiltInNode =
  | Node<{ label: string }, 'input' | 'output' | 'default'>
  | Node<Record<string, never>, 'group'>;

/**
 * 自定义节点属性类型
 * @public
 */
export type NodeProps<NodeType extends Node = Node> = NodePropsBase<NodeType>;