import type { XYPosition } from '@xyflow/system';

import { default as InputNode } from '../Nodes/InputNode.vue';
import { default as DefaultNode } from '../Nodes/DefaultNode.vue';
import { default as GroupNode } from '../Nodes/GroupNode.vue';
import { default as OutputNode } from '../Nodes/OutputNode.vue';
import type { InternalNode, Node, NodeTypes } from '../../types';

export const arrowKeyDiffs: Record<string, XYPosition> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

export const builtinNodeTypes: NodeTypes = {
  input: InputNode,
  default: DefaultNode,
  output: OutputNode,
  group: GroupNode,
};

export function getNodeInlineStyleDimensions<NodeType extends Node = Node>(
  node: InternalNode<NodeType>
): {
    width: number | string | undefined;
    height: number | string | undefined;
  } {
  if (node.internals?.handleBounds === undefined) {
    return {
      width: node.width ?? node.initialWidth ?? node.style?.width,
      height: node.height ?? node.initialHeight ?? node.style?.height,
    };
  }

  return {
    width: node.width ?? node.style?.width,
    height: node.height ?? node.style?.height,
  };
}
export interface NodeWrapperProps {
  // nodeId: string,
  id:string,
  width?: number
  height?: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  resizable?: boolean
  onResizeStart?: (event: MouseEvent) => void
  onResize?: (width: number, height: number) => void
  onResizeEnd?: (event: MouseEvent) => void
  children?: any,
  resizeObserver?: ResizeObserver,
}