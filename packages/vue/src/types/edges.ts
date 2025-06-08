/* eslint-disable @typescript-eslint/no-explicit-any */

import type { CSSProperties } from 'vue';
import type {
  EdgeBase,
  BezierPathOptions,
  Position,
  SmoothStepPathOptions,
  DefaultEdgeOptionsBase,
  HandleType,
  Connection,
  ConnectionLineType,
  Handle,
  EdgePosition,
  StepPathOptions,
  OnError,
  FinalConnectionState,
} from '@xyflow/system';

import { EdgeTypes, InternalNode, Node } from '.';
export interface CustomSVGAttributes {
  fill?: string;
  stroke?: string;
  strokeWidth?: string | number;
  strokeLinecap?: string;
  strokeLinejoin?: string;
  strokeDasharray?: string;
  style?: CSSProperties;
  class?: string;
}
/**
 * @inline
 */
export type EdgeLabelOptions = {
  label?: string;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
};

/**
 * An `Edge` is the complete description with everything Vue Flow needs
 * to know in order to render it.
 * @public
 */
export type Edge<
  EdgeData extends Record<string, unknown> = Record<string, unknown>,
  EdgeType extends string | undefined = string | undefined
> = EdgeBase<EdgeData, EdgeType> &
  EdgeLabelOptions & {
    style?: CSSProperties;
    class?: string;
    reconnectable?: boolean | HandleType;
    focusable?: boolean;
  };

type SmoothStepEdge<EdgeData extends Record<string, unknown> = Record<string, unknown>> = Edge<
  EdgeData,
  'smoothstep'
> & {
  pathOptions?: SmoothStepPathOptions;
};

type BezierEdge<EdgeData extends Record<string, unknown> = Record<string, unknown>> = Edge<EdgeData, 'default'> & {
  pathOptions?: BezierPathOptions;
};

type StepEdge<EdgeData extends Record<string, unknown> = Record<string, unknown>> = Edge<EdgeData, 'step'> & {
  pathOptions?: StepPathOptions;
};

type StraightEdge<EdgeData extends Record<string, unknown> = Record<string, unknown>> = Edge<EdgeData, 'straight'>;

export type BuiltInEdge = SmoothStepEdge | BezierEdge | StepEdge | StraightEdge;

export type EdgeMouseHandler<EdgeType extends Edge = Edge> = (event: MouseEvent, edge: EdgeType) => void;

export type EdgeWrapperProps<EdgeType extends Edge = Edge> = {
  id: string;
  edgesFocusable: boolean;
  edgesReconnectable: boolean;
  elementsSelectable: boolean;
  noPanClass: string;
  onClick?: EdgeMouseHandler<EdgeType>;
  onDoubleClick?: EdgeMouseHandler<EdgeType>;
  onReconnect?: OnReconnect<EdgeType>;
  onContextMenu?: EdgeMouseHandler<EdgeType>;
  onMouseEnter?: EdgeMouseHandler<EdgeType>;
  onMouseMove?: EdgeMouseHandler<EdgeType>;
  onMouseLeave?: EdgeMouseHandler<EdgeType>;
  reconnectRadius?: number;
  onReconnectStart?: (event: MouseEvent, edge: EdgeType, handleType: HandleType) => void;
  onReconnectEnd?: (
    event: MouseEvent | TouchEvent,
    edge: EdgeType,
    handleType: HandleType,
    connectionState: FinalConnectionState
  ) => void;
  rfId?: string;
  edgeTypes?: EdgeTypes;
  onError?: OnError;
  disableKeyboardA11y?: boolean;
};

/**
 * Many properties on an [`Edge`](/api-reference/types/edge) are optional. When a new edge is created,
 * the properties that are not provided will be filled in with the default values
 * passed to the `defaultEdgeOptions` prop of the [`<VueFlow />`](/api-reference/vue-flow#defaultedgeoptions) component.
 */
export type DefaultEdgeOptions = DefaultEdgeOptionsBase<Edge>;

export type EdgeTextProps = CustomSVGAttributes<SVGElement> &
  EdgeLabelOptions & {
    x: number;
    y: number;
  };

/**
 * When you implement a custom edge it is wrapped in a component that enables some
 * basic functionality. The `EdgeProps` type is the props that are passed to this.
 * @public
 * @expand
 */
export type EdgeProps<EdgeType extends Edge = Edge> = Pick<
  EdgeType,
  'id' | 'animated' | 'data' | 'style' | 'selected' | 'source' | 'target' | 'selectable' | 'deletable'
> &
  EdgePosition &
  EdgeLabelOptions & {
    sourceHandleId?: string | null;
    targetHandleId?: string | null;
    markerStart?: string;
    markerEnd?: string;
    // @TODO: how can we get better types for pathOptions?
    pathOptions?: any;
    interactionWidth?: number;
  };

/**
 * BaseEdge component props
 * @public
 * @expand
 */
export type BaseEdgeProps = Omit<CustomSVGAttributes<SVGPathElement>, 'd'> &
  EdgeLabelOptions & {
    /** Additional padding where interacting with an edge is still possible */
    interactionWidth?: number;
    /** The x position of edge label */
    labelX?: number;
    /** The y position of edge label */
    labelY?: number;
    /** SVG path of the edge */
    path: string;
  };

/**
 * Helper type for edge components that get exported by the library
 * @public
 * @expand
 */
export type EdgeComponentProps = EdgePosition &
  EdgeLabelOptions & {
    id?: EdgeProps['id'];
    markerStart?: EdgeProps['markerStart'];
    markerEnd?: EdgeProps['markerEnd'];
    interactionWidth?: EdgeProps['interactionWidth'];
    style?: EdgeProps['style'];
    sourceHandleId?: EdgeProps['sourceHandleId'];
    targetHandleId?: EdgeProps['targetHandleId'];
  };

export type EdgeComponentWithPathOptions<PathOptions> = EdgeComponentProps & {
  pathOptions?: PathOptions;
};

/**
 * BezierEdge component props
 * @public
 * @expand
 */
export type BezierEdgeProps = EdgeComponentWithPathOptions<BezierPathOptions>;

/**
 * SmoothStepEdge component props
 * @public
 * @expand
 */
export type SmoothStepEdgeProps = EdgeComponentWithPathOptions<SmoothStepPathOptions>;

/**
 * StepEdge component props
 * @public
 * @expand
 */
export type StepEdgeProps = EdgeComponentWithPathOptions<StepPathOptions>;

/**
 * StraightEdge component props
 * @public
 * @expand
 */
export type StraightEdgeProps = Omit<EdgeComponentProps, 'sourcePosition' | 'targetPosition'>;

/**
 * SimpleBezier component props
 * @public
 * @expand
 */
export type SimpleBezierEdgeProps = EdgeComponentProps;

export type OnReconnect<EdgeType extends Edge = Edge> = (oldEdge: EdgeType, newConnection: Connection) => void;

/**
 * If you want to render a custom component for connection lines, you can set the
 * `connectionLineComponent` prop on the [`<VueFlow />`](/api-reference/vue-flow#connection-connectionLineComponent)
 * component. The `ConnectionLineComponentProps` are passed to your custom component.
 *
 * @public
 */
export type ConnectionLineComponentProps<NodeType extends Node = Node> = {
  connectionLineStyle?: CSSProperties;
  connectionLineType: ConnectionLineType;
  fromNode: InternalNode<NodeType>;
  fromHandle: Handle;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  fromPosition: Position;
  toPosition: Position;
  connectionStatus: 'valid' | 'invalid' | null;
  toNode: InternalNode<NodeType> | null;
  toHandle: Handle | null;
};

export type ConnectionLineComponent<NodeType extends Node = Node> = (
  props: ConnectionLineComponentProps<NodeType>
) => any;