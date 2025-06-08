import type { VueFlowStore, VueFlowState } from './store';
import type { Edge, Node, VueFlowProps } from '.';

export interface VueFlowInstance<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  getNodes: () => NodeType[];
  getNode: (id: string) => NodeType | undefined;
  getEdges: () => EdgeType[];
  getEdge: (id: string) => EdgeType | undefined;
  setNodes: (nodes: NodeType[]) => void;
  setEdges: (edges: EdgeType[]) => void;
  setState: (state: VueFlowState<NodeType, EdgeType>) => void;
  fitView: (options?: FitViewOptions) => void;
  project: (position: [number, number]) => { x: number; y: number; zoom: number };
  updateNodeDimensions: (ids: string[]) => void;
  instance: () => VueFlowStore<NodeType, EdgeType>;
}

export type VueFlowEmits<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  (e: 'update:nodes', nodes: NodeType[]): void;
  (e: 'update:edges', edges: EdgeType[]): void;
  (e: 'update:viewport', viewport: Transform): void;
  (e: 'init', instance: VueFlowInstance<NodeType, EdgeType>): void;
} & {
  [K in keyof VueFlowProps<NodeType, EdgeType> as `update:${K}`]?: (payload: VueFlowProps<NodeType, EdgeType>[K]) => void;
};