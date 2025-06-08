import { computed } from 'vue';
import { calculateNodePosition, snapPosition, type XYPosition } from '@xyflow/system';

import { type Node } from '../types';
import { useStoreApi } from './useStore';

const selectedAndDraggable = (nodesDraggable: boolean) => (n: Node) =>
  n.selected && (n.draggable || (nodesDraggable && typeof n.draggable === 'undefined'));

/**
 * 组合式函数用于通过传递方向和因子来更新节点位置
 *
 * @internal
 * @returns 更新节点位置的函数
 */
export function useMoveSelectedNodes() {
  const store = useStoreApi();

  const moveSelectedNodes = (params: { direction: XYPosition; factor: number }) => {
    const { nodeExtent, snapToGrid, snapGrid, nodesDraggable, onError, updateNodePositions, nodeLookup, nodeOrigin } =
      store.getState();
    const nodeUpdates = new Map();
    const isSelected = selectedAndDraggable(nodesDraggable);

    /*
     * 默认情况下，每次按键节点移动5px
     * 如果启用了网格吸附，我们使用网格值作为速度
     */
    const xVelo = snapToGrid ? snapGrid[0] : 5;
    const yVelo = snapToGrid ? snapGrid[1] : 5;

    const xDiff = params.direction.x * xVelo * params.factor;
    const yDiff = params.direction.y * yVelo * params.factor;

    for (const [, node] of nodeLookup) {
      if (!isSelected(node)) {
        continue;
      }

      let nextPosition = {
        x: node.internals.positionAbsolute.x + xDiff,
        y: node.internals.positionAbsolute.y + yDiff,
      };

      if (snapToGrid) {
        nextPosition = snapPosition(nextPosition, snapGrid);
      }

      const { position, positionAbsolute } = calculateNodePosition({
        nodeId: node.id,
        nextPosition,
        nodeLookup,
        nodeExtent,
        nodeOrigin,
        onError,
      });

      node.position = position;
      node.internals.positionAbsolute = positionAbsolute;

      nodeUpdates.set(node.id, node);
    }

    updateNodePositions(nodeUpdates);
  };

  return {
    moveSelectedNodes,
  };
}