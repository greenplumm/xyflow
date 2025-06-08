import type { Node, Edge } from '@xyflow/system';

export type BatchProviderProps = {
  nodes: Node[];
  edges: Edge[];
};

export type QueueConfig = {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
};