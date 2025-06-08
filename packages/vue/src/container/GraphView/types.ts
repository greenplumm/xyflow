import type { Edge, Node, VueFlowProps } from '../../types';

export type GraphViewProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> = Omit<
  VueFlowProps<NodeType, EdgeType>,
  'onSelectionChange' | 'nodes' | 'edges' | 'onMove' | 'onMoveStart' | 'onMoveEnd' | 'elevateEdgesOnSelect'
> &
  Required<
    Pick<
      VueFlowProps<NodeType, EdgeType>,
      | 'selectionKeyCode'
      | 'deleteKeyCode'
      | 'multiSelectionKeyCode'
      | 'connectionLineType'
      | 'onlyRenderVisibleElements'
      | 'translateExtent'
      | 'minZoom'
      | 'maxZoom'
      | 'defaultMarkerColor'
      | 'noDragClassName'
      | 'noWheelClassName'
      | 'noPanClassName'
      | 'defaultViewport'
      | 'disableKeyboardA11y'
      | 'paneClickDistance'
      | 'nodeClickDistance'
    >
  > & {
    rfId: string;
  };