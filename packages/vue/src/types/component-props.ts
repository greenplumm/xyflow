import type { CSSProperties, MouseEvent, WheelEvent } from 'vue';
import type {
  ConnectionMode,
  ConnectionLineType,
  OnConnect,
  OnConnectStart,
  OnConnectEnd,
  CoordinateExtent,
  KeyCode,
  PanOnScrollMode,
  ProOptions,
  PanelPosition,
  OnMove,
  OnMoveStart,
  OnMoveEnd,
  Viewport,
  NodeOrigin,
  HandleType,
  SelectionMode,
  OnError,
  ColorMode,
  SnapGrid,
} from '@xyflow/system';

import type {
  OnSelectionChangeFunc,
  NodeTypes,
  EdgeTypes,
  Node,
  Edge,
  ConnectionLineComponent,
  OnReconnect,
  OnInit,
  DefaultEdgeOptions,
  FitViewOptions,
  OnNodesDelete,
  OnEdgesDelete,
  OnDelete,
  OnNodesChange,
  OnEdgesChange,
  NodeMouseHandler,
  SelectionDragHandler,
  EdgeMouseHandler,
  OnNodeDrag,
  OnBeforeDelete,
  IsValidConnection,
} from '.';

/**
 * VueFlow component props.
 * @public
 */
export interface VueFlowProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  /**
   * An array of nodes to render in a controlled flow.
   */
  nodes?: NodeType[];
  /**
   * An array of edges to render in a controlled flow.
   */
  edges?: EdgeType[];
  /** The initial nodes to render in an uncontrolled flow. */
  defaultNodes?: NodeType[];
  /** The initial edges to render in an uncontrolled flow. */
  defaultEdges?: EdgeType[];
  /**
   * Defaults to be applied to all new edges that are added to the flow.
   */
  defaultEdgeOptions?: DefaultEdgeOptions;
  /** This event handler is called when a user clicks on a node */
  onNodeClick?: NodeMouseHandler<NodeType>;
  /** This event handler is called when a user double clicks on a node */
  onNodeDoubleClick?: NodeMouseHandler<NodeType>;
  /** This event handler is called when mouse of a user enters a node */
  onNodeMouseEnter?: NodeMouseHandler<NodeType>;
  /** This event handler is called when mouse of a user moves over a node */
  onNodeMouseMove?: NodeMouseHandler<NodeType>;
  /** This event handler is called when mouse of a user leaves a node */
  onNodeMouseLeave?: NodeMouseHandler<NodeType>;
  /** This event handler is called when a user right clicks on a node */
  onNodeContextMenu?: NodeMouseHandler<NodeType>;
  /** This event handler is called when a user starts to drag a node */
  onNodeDragStart?: OnNodeDrag<NodeType>;
  /** This event handler is called when a user drags a node */
  onNodeDrag?: OnNodeDrag<NodeType>;
  /** This event handler is called when a user stops dragging a node */
  onNodeDragStop?: OnNodeDrag<NodeType>;
  /** This event handler is called when a user clicks on an edge */
  onEdgeClick?: (event: MouseEvent, edge: EdgeType) => void;
  /** This event handler is called when a user right clicks on an edge */
  onEdgeContextMenu?: EdgeMouseHandler<EdgeType>;
  /** This event handler is called when mouse of a user enters an edge */
  onEdgeMouseEnter?: EdgeMouseHandler<EdgeType>;
  /** This event handler is called when mouse of a user moves over an edge */
  onEdgeMouseMove?: EdgeMouseHandler<EdgeType>;
  /** This event handler is called when mouse of a user leaves an edge */
  onEdgeMouseLeave?: EdgeMouseHandler<EdgeType>;
  /** This event handler is called when a user double clicks on an edge */
  onEdgeDoubleClick?: EdgeMouseHandler<EdgeType>;
  onReconnect?: OnReconnect<EdgeType>;
  onReconnectStart?: (event: MouseEvent, edge: EdgeType, handleType: HandleType) => void;
  onReconnectEnd?: (event: MouseEvent, edge: EdgeType, handleType: HandleType) => void;
  onNodesChange?: OnNodesChange<NodeType>;
  onEdgesChange?: OnEdgesChange<EdgeType>;
  onNodesDelete?: OnNodesDelete<NodeType>;
  onEdgesDelete?: OnEdgesDelete<EdgeType>;
  onDelete?: OnDelete<NodeType, EdgeType>;
  onSelectionDragStart?: SelectionDragHandler<NodeType>;
  onSelectionDrag?: SelectionDragHandler<NodeType>;
  onSelectionDragStop?: SelectionDragHandler<NodeType>;
  onSelectionStart?: (event: MouseEvent) => void;
  onSelectionEnd?: (event: MouseEvent) => void;
  onSelectionContextMenu?: (event: MouseEvent, nodes: NodeType[]) => void;
  onConnect?: OnConnect;
  onConnectStart?: OnConnectStart;
  onConnectEnd?: OnConnectEnd;
  onClickConnectStart?: OnConnectStart;
  onClickConnectEnd?: OnConnectEnd;
  onInit?: OnInit<NodeType, EdgeType>;
  onMove?: OnMove;
  onMoveStart?: OnMoveStart;
  onMoveEnd?: OnMoveEnd;
  onSelectionChange?: OnSelectionChangeFunc<NodeType, EdgeType>;
  onPaneScroll?: (event?: WheelEvent) => void;
  onPaneClick?: (event: MouseEvent) => void;
  onPaneContextMenu?: (event: MouseEvent) => void;
  onPaneMouseEnter?: (event: MouseEvent) => void;
  onPaneMouseMove?: (event: MouseEvent) => void;
  onPaneMouseLeave?: (event: MouseEvent) => void;
  paneClickDistance?: number;
  nodeClickDistance?: number;
  onBeforeDelete?: OnBeforeDelete<NodeType, EdgeType>;
  nodeTypes?: NodeTypes;
  edgeTypes?: EdgeTypes;
  connectionLineType?: ConnectionLineType;
  connectionLineStyle?: CSSProperties;
  connectionLineComponent?: ConnectionLineComponent<NodeType>;
  connectionLineContainerStyle?: CSSProperties;
  connectionMode?: ConnectionMode;
  deleteKeyCode?: KeyCode | null;
  selectionKeyCode?: KeyCode | null;
  selectionOnDrag?: boolean;
  selectionMode?: SelectionMode;
  panActivationKeyCode?: KeyCode | null;
  multiSelectionKeyCode?: KeyCode | null;
  zoomActivationKeyCode?: KeyCode | null;
  snapToGrid?: boolean;
  snapGrid?: SnapGrid;
  onlyRenderVisibleElements?: boolean;
  nodesDraggable?: boolean;
  nodesConnectable?: boolean;
  nodesFocusable?: boolean;
  nodeOrigin?: NodeOrigin;
  edgesFocusable?: boolean;
  edgesReconnectable?: boolean;
  elementsSelectable?: boolean;
  selectNodesOnDrag?: boolean;
  panOnDrag?: boolean | number[];
  minZoom?: number;
  maxZoom?: number;
  viewport?: Viewport;
  defaultViewport?: Viewport;
  onViewportChange?: (viewport: Viewport) => void;
  translateExtent?: CoordinateExtent;
  preventScrolling?: boolean;
  nodeExtent?: CoordinateExtent;
  defaultMarkerColor?: string;
  zoomOnScroll?: boolean;
  zoomOnPinch?: boolean;
  panOnScroll?: boolean;
  panOnScrollSpeed?: number;
  panOnScrollMode?: PanOnScrollMode;
  zoomOnDoubleClick?: boolean;
  reconnectRadius?: number;
  noDragClassName?: string;
  noWheelClassName?: string;
  noPanClassName?: string;
  fitView?: boolean;
  fitViewOptions?: FitViewOptions;
  connectOnClick?: boolean;
  attributionPosition?: PanelPosition;
  proOptions?: ProOptions;
  elevateNodesOnSelect?: boolean;
  elevateEdgesOnSelect?: boolean;
  disableKeyboardA11y?: boolean;
  autoPanOnNodeDrag?: boolean;
  autoPanOnConnect?: boolean;
  autoPanSpeed?: number;
  connectionRadius?: number;
  onError?: OnError;
  isValidConnection?: IsValidConnection<EdgeType>;
  nodeDragThreshold?: number;
  width?: number;
  height?: number;
  colorMode?: ColorMode;
  debug?: boolean;
}