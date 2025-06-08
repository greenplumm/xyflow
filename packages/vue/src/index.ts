export { default as VueFlow } from './container/VueFlow/index.vue';
export { Handle, type HandleProps } from './components/Handle';
export {
  EdgeText,
  StraightEdge,
  StepEdge,
  // BezierEdge,
  SimpleBezierEdge,
  SmoothStepEdge,
  BaseEdge,
} from './components/Edges';

export { default as VueFlowProvider } from './components/VueFlowProvider/index.vue';
export { default as Panel } from './components/Panel/index.vue';
export { type PanelProps } from './components/Panel/types';
export { default as EdgeLabelRenderer} from './components/EdgeLabelRenderer/index.vue';
export { default as ViewportPortal}  from './components/ViewportPortal/index.vue';

export { useVueFlow } from './hooks/useVueFlow';
export { useUpdateNodeInternals } from './hooks/useUpdateNodeInternals';
export { useNodes } from './hooks/useNodes';
export { useEdges } from './hooks/useEdges';
export { useViewport } from './hooks/useViewport';
export { useKeyPress } from './hooks/useKeyPress';
export { useNodesState, useEdgesState } from './hooks/useNodesEdgesState';
export { useStore, useStoreApi } from './hooks/useStore';
export { useOnViewportChange, type UseOnViewportChangeOptions } from './hooks/useOnViewportChange';
export { useOnSelectionChange, type UseOnSelectionChangeOptions } from './hooks/useOnSelectionChange';
export { useNodesInitialized, type UseNodesInitializedOptions } from './hooks/useNodesInitialized';
export { useHandleConnections } from './hooks/useHandleConnections';
export { useNodeConnections } from './hooks/useNodeConnections';
export { useNodesData } from './hooks/useNodesData';
export { useConnection } from './hooks/useConnection';
export { useInternalNode } from './hooks/useInternalNode';
export { useNodeId } from './contexts/NodeIdContext';

export { applyNodeChanges, applyEdgeChanges } from './utils/changes';
export { isNode, isEdge } from './utils/general';

export * from './additional-components';

export * from './types';

// system types
export {
  type Align,
  type SmoothStepPathOptions,
  type BezierPathOptions,
  ConnectionLineType,
  type EdgeMarker,
  type EdgeMarkerType,
  MarkerType,
  type OnMove,
  type OnMoveStart,
  type OnMoveEnd,
  type Connection,
  ConnectionMode,
  type OnConnectStartParams,
  type OnConnectStart,
  type OnConnect,
  type OnConnectEnd,
  type Viewport,
  type SnapGrid,
  PanOnScrollMode,
  type ViewportHelperFunctionOptions,
  type SetCenterOptions,
  type FitBoundsOptions,
  type PanelPosition,
  type ProOptions,
  SelectionMode,
  type SelectionRect,
  type OnError,
  type NodeOrigin,
  type OnSelectionDrag,
  Position,
  type XYPosition,
  type XYZPosition,
  type Dimensions,
  type Rect,
  type Box,
  type Transform,
  type CoordinateExtent,
  type ColorMode,
  type ColorModeClass,
  type HandleType,
  type ShouldResize,
  type OnResizeStart,
  type OnResize,
  type OnResizeEnd,
  type ControlPosition,
  type ControlLinePosition,
  ResizeControlVariant,
  type ResizeParams,
  type ResizeParamsWithDirection,
  type ResizeDragEvent,
  type NodeChange,
  type NodeDimensionChange,
  type NodePositionChange,
  type NodeSelectionChange,
  type NodeRemoveChange,
  type NodeAddChange,
  type NodeReplaceChange,
  type EdgeChange,
  type EdgeSelectionChange,
  type EdgeRemoveChange,
  type EdgeAddChange,
  type EdgeReplaceChange,
  type KeyCode,
  type ConnectionState,
  type FinalConnectionState,
  type ConnectionInProgress,
  type NoConnection,
} from '@xyflow/system';

// we need this workaround to prevent a duplicate identifier error
import { type Handle as HandleBound } from '@xyflow/system';
export type Handle = HandleBound;

// system utils
export {
  type GetBezierPathParams,
  getBezierEdgeCenter,
  getBezierPath,
  getEdgeCenter,
  type GetSmoothStepPathParams,
  getSmoothStepPath,
  type GetStraightPathParams,
  getStraightPath,
  getViewportForBounds,
  getNodesBounds,
  getIncomers,
  getOutgoers,
  addEdge,
  reconnectEdge,
  getConnectedEdges,
} from '@xyflow/system';

