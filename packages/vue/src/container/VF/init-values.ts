import { type NodeOrigin, type Viewport } from '@xyflow/system';

export const defaultNodeOrigin: NodeOrigin = [0, 0];
export const defaultNodeExtent: CoordinateExtent = [
  [-Infinity, -Infinity],
  [Infinity, Infinity],
];
export const defaultViewport: Viewport = { x: 0, y: 0, zoom: 1 };