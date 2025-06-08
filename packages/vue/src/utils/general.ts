import { ref } from 'vue';
import { isNodeBase, isEdgeBase } from '@xyflow/system';
import type { Rect } from '../../types';
import type { Node, Edge } from '@xyflow/system';

export const isRectIntersecting = (
  rect1: Rect,
  rect2: Rect
): boolean => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

/**
 * 测试对象是否可作为Node使用
 */
export const isNode = <NodeType extends Node = Node>(
  element: unknown
): element is NodeType => isNodeBase<NodeType>(element);

/**
 * 测试对象是否可作为Edge使用
 */
export const isEdge = <EdgeType extends Edge = Edge>(
  element: unknown
): element is EdgeType => isEdgeBase<EdgeType>(element);

export function fixedForwardRef<T, P = {}>(
  props: P, // 添加 props 参数定义
  render: (props: P, ref: T) => any
): (props: P & { ref?: T }) => any {
  const internalRef = ref<T>();
  if (typeof render === 'function') {
    return render({ ...props, ref: internalRef }, internalRef.value) as any;
  }
  console.error('The render parameter passed to fixedForwardRef is not a function.');
  return null;
}