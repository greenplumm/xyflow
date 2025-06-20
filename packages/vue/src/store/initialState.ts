import {
  infiniteExtent,
  ConnectionMode,
  adoptUserNodes,
  getViewportForBounds,
  Transform,
  updateConnectionLookup,
  devWarn,
  getInternalNodesBounds,
  NodeOrigin,
  initialConnection,
  CoordinateExtent,
} from '@xyflow/system';

import type { Edge, InternalNode, Node, VueFlowStore } from '../types';

const getInitialState = ({
  nodes,
  edges,
  defaultNodes,
  defaultEdges,
  width,
  height,
  fitView,
  nodeOrigin,
  nodeExtent,
}: {
  nodes?: Node[];
  edges?: Edge[];
  defaultNodes?: Node[];
  defaultEdges?: Edge[];
  width?: number;
  height?: number;
  fitView?: boolean;
  nodeOrigin?: NodeOrigin;
  nodeExtent?: CoordinateExtent;
} = {}): VueFlowStore => {
  const nodeLookup = new Map<string, InternalNode>();
  const parentLookup = new Map();
  const connectionLookup = new Map();
  const edgeLookup = new Map();

  const storeEdges = defaultEdges ?? edges ?? [];
  const storeNodes = defaultNodes ?? nodes ?? [];
  const storeNodeOrigin = nodeOrigin ?? [0, 0];
  const storeNodeExtent = nodeExtent ?? infiniteExtent;

  updateConnectionLookup(connectionLookup, edgeLookup, storeEdges);
  adoptUserNodes(storeNodes, nodeLookup, parentLookup, {
    nodeOrigin: storeNodeOrigin,
    nodeExtent: storeNodeExtent,
    elevateNodesOnSelect: false,
  });

  let transform: Transform = [0, 0, 1];

  if (fitView && width && height) {
    const bounds = getInternalNodesBounds(nodeLookup, {
      filter: (node) => !!((node.width || node.initialWidth) && (node.height || node.initialHeight)),
    });

    const { x, y, zoom } = getViewportForBounds(bounds, width, height, 0.5, 2, 0.1);
    transform = [x, y, zoom];
  }

  return {
    rfId: '1',
    width: 0,
    height: 0,
    transform,
    nodes: storeNodes,
    nodeLookup,
    parentLookup,
    edges: storeEdges,
    edgeLookup,
    connectionLookup,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: defaultNodes !== undefined,
    hasDefaultEdges: defaultEdges !== undefined,
    minZoom: 0.5,
    maxZoom: 2,
    translateExtent: infiniteExtent,
    nodeExtent: storeNodeExtent,
    nodesSelectionActive: false,
    userSelectionActive: false,
    userSelectionRect: null,
    connectionMode: ConnectionMode.Strict,
    domNode: null,
    panZoom: null,
    paneDragging: false,
    noPanClassName: 'nopan',
    nodeOrigin: storeNodeOrigin,
    nodeDragThreshold: 1,

    snapGrid: [15, 15],
    snapToGrid: false,

    nodesDraggable: true,
    nodesConnectable: true,
    nodesFocusable: true,
    edgesFocusable: true,
    edgesReconnectable: true,
    elementsSelectable: true,
    elevateNodesOnSelect: true,
    elevateEdgesOnSelect: false,
    fitViewOnInit: false,
    fitViewDone: false,
    fitViewOnInitOptions: undefined,
    selectNodesOnDrag: true,

    multiSelectionActive: false,

    connection: { ...initialConnection },
    connectionClickStartHandle: null,
    connectOnClick: true,

    ariaLiveMessage: '',
    autoPanOnConnect: true,
    autoPanOnNodeDrag: true,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: devWarn,
    isValidConnection: undefined,
    onSelectionChangeHandlers: [],

    lib: 'vue',
    debug: false,
  };
};

export default getInitialState;