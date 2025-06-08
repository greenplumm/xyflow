import { computed } from 'vue';
import {
  pointToRendererPoint,
  getViewportForBounds,
  getFitViewNodes,
  fitView,
  type XYPosition,
  rendererPointToPoint,
  getDimensions,
  SnapGrid,
} from '@xyflow/system';

import { useStoreApi } from '../hooks/useStore';
import type { ViewportHelperFunctions } from '../types';

/**
 * 获取视口辅助函数的组合式函数
 * 
 * @internal
 * @returns 视口辅助函数
 */
export default function useViewportHelper(): ViewportHelperFunctions {
  const store = useStoreApi();

  return computed(() => ({
    zoomIn: (options) => {
      const { panZoom } = store;
      return panZoom ? panZoom.scaleBy(1.2, { duration: options?.duration }) : Promise.resolve(false);
    },
    zoomOut: (options) => {
      const { panZoom } = store;
      return panZoom ? panZoom.scaleBy(1 / 1.2, { duration: options?.duration }) : Promise.resolve(false);
    },
    zoomTo: (zoomLevel, options) => {
      const { panZoom } = store;
      return panZoom ? panZoom.scaleTo(zoomLevel, { duration: options?.duration }) : Promise.resolve(false);
    },
    getZoom: () => store.transform[2],
    setViewport: async (viewport, options) => {
      const {
        transform: [tX, tY, tZoom],
        panZoom,
      } = store;

      if (!panZoom) {
        return Promise.resolve(false);
      }

      await panZoom.setViewport(
        {
          x: viewport.x ?? tX,
          y: viewport.y ?? tY,
          zoom: viewport.zoom ?? tZoom,
        },
        { duration: options?.duration }
      );

      return Promise.resolve(true);
    },
    getViewport: () => {
      const [x, y, zoom] = store.transform;
      return { x, y, zoom };
    },
    fitView: (options) => {
      const { nodeLookup, minZoom, maxZoom, panZoom, domNode } = store;

      if (!panZoom || !domNode) {
        return Promise.resolve(false);
      }

      const fitViewNodes = getFitViewNodes(nodeLookup, options);
      const { width, height } = getDimensions(domNode);

      return fitView(
        {
          nodes: fitViewNodes,
          width,
          height,
          minZoom,
          maxZoom,
          panZoom,
        },
        options
      );
    },
    setCenter: async (x, y, options) => {
      const { width, height, maxZoom, panZoom } = store;
      const nextZoom = typeof options?.zoom !== 'undefined' ? options.zoom : maxZoom;
      const centerX = width / 2 - x * nextZoom;
      const centerY = height / 2 - y * nextZoom;

      if (!panZoom) {
        return Promise.resolve(false);
      }

      await panZoom.setViewport(
        {
          x: centerX,
          y: centerY,
          zoom: nextZoom,
        },
        { duration: options?.duration }
      );

      return Promise.resolve(true);
    },
    fitBounds: async (bounds, options) => {
      const { width, height, minZoom, maxZoom, panZoom } = store;
      const viewport = getViewportForBounds(bounds, width, height, minZoom, maxZoom, options?.padding ?? 0.1);

      if (!panZoom) {
        return Promise.resolve(false);
      }

      await panZoom.setViewport(viewport, { duration: options?.duration });

      return Promise.resolve(true);
    },
    screenToFlowPosition: (
      clientPosition: XYPosition,
      options: { snapToGrid?: boolean; snapGrid?: SnapGrid } = {}
    ) => {
      const { transform, snapGrid, snapToGrid, domNode } = store;

      if (!domNode) {
        return clientPosition;
      }

      const { x: domX, y: domY } = domNode.getBoundingClientRect();
      const correctedPosition = {
        x: clientPosition.x - domX,
        y: clientPosition.y - domY,
      };
      const _snapGrid = options.snapGrid ?? snapGrid;
      const _snapToGrid = options.snapToGrid ?? snapToGrid;

      return pointToRendererPoint(correctedPosition, transform, _snapToGrid, _snapGrid);
    },
    flowToScreenPosition: (flowPosition: XYPosition) => {
      const { transform, domNode } = store;

      if (!domNode) {
        return flowPosition;
      }

      const { x: domX, y: domY } = domNode.getBoundingClientRect();
      const rendererPosition = rendererPointToPoint(flowPosition, transform);

      return {
        x: rendererPosition.x + domX,
        y: rendererPosition.y + domY,
      };
    },
  })).value;
}