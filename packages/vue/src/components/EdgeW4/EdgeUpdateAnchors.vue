<script setup lang="ts">
import { XYHandle, type Connection, EdgePosition, FinalConnectionState, HandleType } from '@xyflow/system';
import EdgeAnchor from '../Edges/EdgeAnchor.vue';
import type { EdgeWrapperProps, Edge } from '../../types/edges';
import { useStoreApi } from '../../hooks/useStore';

const props = defineProps<
  {
    edge: Edge;
    isReconnectable: boolean | 'source' | 'target';
    reconnectRadius: EdgeWrapperProps['reconnectRadius'];
    onReconnect: EdgeWrapperProps['onReconnect'];
    onReconnectStart: EdgeWrapperProps['onReconnectStart'];
    onReconnectEnd: EdgeWrapperProps['onReconnectEnd'];
    setUpdateHover: (hover: boolean) => void;
    setReconnecting: (updating: boolean) => void;
  } & EdgePosition
>();

const store = useStoreApi();

const handleEdgeUpdater = (
  event: MouseEvent,
  oppositeHandle: { nodeId: string; id: string | null; type: HandleType }
) => {
  if ((event as MouseEvent).button !== 0) {
    return;
  }

  const {
    autoPanOnConnect,
    domNode,
    isValidConnection,
    connectionMode,
    connectionRadius,
    lib,
    onConnectStart,
    onConnectEnd,
    cancelConnection,
    nodeLookup,
    rfId: flowId,
    panBy,
    updateConnection,
  } = store.getState();
  const isTarget = oppositeHandle.type === 'target';

  props.setReconnecting(true);
  props.onReconnectStart?.(event, props.edge, oppositeHandle.type);

  const _onReconnectEnd = (evt: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
    props.setReconnecting(false);
    props.onReconnectEnd?.(evt, props.edge, oppositeHandle.type, connectionState);
  };

  const onConnectEdge = (connection: Connection) => props.onReconnect?.(props.edge, connection);

  XYHandle.onPointerDown(event, {
    autoPanOnConnect,
    connectionMode,
    connectionRadius,
    domNode,
    handleId: oppositeHandle.id,
    nodeId: oppositeHandle.nodeId,
    nodeLookup,
    isTarget,
    edgeUpdaterType: oppositeHandle.type,
    lib,
    flowId,
    cancelConnection,
    panBy,
    isValidConnection,
    onConnect: onConnectEdge,
    onConnectStart,
    onConnectEnd,
    onReconnectEnd: _onReconnectEnd,
    updateConnection,
    getTransform: () => store.getState().transform,
    getFromHandle: () => store.getState().connection.fromHandle,
  });
};

const onReconnectSourceMouseDown = (event: MouseEvent): void =>
  handleEdgeUpdater(event, { nodeId: props.edge.target, id: props.edge.targetHandle ?? null, type: 'target' });
const onReconnectTargetMouseDown = (event: MouseEvent): void =>
  handleEdgeUpdater(event, { nodeId: props.edge.source, id: props.edge.sourceHandle ?? null, type: 'source' });
const onReconnectMouseEnter = () => props.setUpdateHover(true);
const onReconnectMouseOut = () => props.setUpdateHover(false);
</script>

<template>
  <EdgeAnchor
    v-if="isReconnectable === true || isReconnectable === 'source'"
    :position="sourcePosition"
    :centerX="sourceX"
    :centerY="sourceY"
    :radius="reconnectRadius"
    @mousedown="onReconnectSourceMouseDown"
    @mouseenter="onReconnectMouseEnter"
    @mouseout="onReconnectMouseOut"
    type="source"
  />
  <EdgeAnchor
    v-if="isReconnectable === true || isReconnectable === 'target'"
    :position="targetPosition"
    :centerX="targetX"
    :centerY="targetY"
    :radius="reconnectRadius"
    @mousedown="onReconnectTargetMouseDown"
    @mouseenter="onReconnectMouseEnter"
    @mouseout="onReconnectMouseOut"
    type="target"
  />
</template>
