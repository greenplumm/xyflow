import type { Connection, XYPosition } from '@xyflow/system';

export interface HandleProps {
  nodeId: string;
  position: XYPosition;
  type: 'source' | 'target';
  isValidConnection?: (connection: Connection) => boolean;
  onConnectStart?: (event: MouseEvent | TouchEvent, params: { nodeId: string; handleType: string }) => void;
  onConnectEnd?: (event: MouseEvent | TouchEvent) => void;
  onConnect?: (connection: Connection) => void;
  className?: string;
}