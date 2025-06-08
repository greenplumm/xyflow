<script setup lang="ts">
import { computed, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore, useStoreApi } from '../../hooks/useStore';
import { Position, XYHandle, getHostForElement, isMouseEvent, addEdge } from '@xyflow/system';
import type {
  HandleProps as HandlePropsSystem,
  Connection,
  HandleType,
  OnConnect,
  ConnectionState,
  Optional,
} from '@xyflow/system';
import { ConnectionMode, errorMessages } from '@xyflow/system';
import { useNodeId } from '../../contexts/NodeIdContext';
import type { VueFlowState } from '../../types';

export interface HandleProps extends HandlePropsSystem {
  /** Callback called when connection is made */
  onConnect?: OnConnect;
  class?: string;
  style?: Record<string, any>;
  onMouseDown?: (e: MouseEvent) => void;
  onTouchStart?: (e: TouchEvent) => void;
}

const props = withDefaults(defineProps<HandleProps>(), {
  type: 'source',
  position: Position.Top,
  isConnectable: true,
  isConnectableStart: true,
  isConnectableEnd: true,
});

const selector = (s: VueFlowState) => ({
  connectOnClick: s.connectOnClick,
  noPanClassName: s.noPanClassName,
  rfId: s.rfId,
});

const connectingSelector =
  (nodeId: string | null, handleId: string | null, type: HandleType) => (state: VueFlowState) => {
    const { connectionClickStartHandle: clickHandle, connectionMode, connection } = state;
    const { fromHandle, toHandle, isValid } = connection;
    const connectingTo = toHandle?.nodeId === nodeId && toHandle?.id === handleId && toHandle?.type === type;

    return {
      connectingFrom: fromHandle?.nodeId === nodeId && fromHandle?.id === handleId && fromHandle?.type === type,
      connectingTo,
      clickConnecting: clickHandle?.nodeId === nodeId && clickHandle?.id === handleId && clickHandle?.type === type,
      isPossibleEndHandle:
        connectionMode === ConnectionMode.Strict
          ? fromHandle?.type !== type
          : nodeId !== fromHandle?.nodeId || handleId !== fromHandle?.id,
      connectionInProcess: !!fromHandle,
      clickConnectionInProcess: !!clickHandle,
      valid: connectingTo && isValid,
    };
  };

const handleId = computed(() => props.id || null);
const isTarget = computed(() => props.type === 'target');
const store = useStoreApi();
const nodeId = useNodeId();
let sliced = useStore(selector);
// const { connectOnClick, noPanClassName, rfId }
const connectOnClick = sliced.value.connectOnClick;
const noPanClassName = sliced.value.noPanClassName;
const rfId = sliced.value.rfId;

sliced = useStore(connectingSelector(nodeId, handleId.value, props.type));

const {
  connectingFrom,
  connectingTo,
  clickConnecting,
  isPossibleEndHandle,
  connectionInProcess,
  clickConnectionInProcess,
  valid,
} = storeToRefs(sliced.value);

if (!nodeId) {
  store.getState().onError?.('010', errorMessages['error010']());
}

const onConnectExtended = (params: Connection) => {
  const sliced = store.getState();
  // const { defaultEdgeOptions, onConnect: onConnectAction, hasDefaultEdges } = storeToRefs(sliced);
  const edgeParams = reactive({
    ...sliced?.defaultEdgeOptions,
    ...params,
  });
  if (sliced.hasDefaultEdges) {
    const { edges, setEdges } = store.getState();
    setEdges(addEdge(edgeParams, edges));
  }

  sliced?.onConnectAction?.(edgeParams);
  props.onConnect?.(edgeParams);
};

const onPointerDown = (event: MouseEvent | TouchEvent) => {
  if (!nodeId) {
    return;
  }

  const isMouseTriggered = isMouseEvent(event);

  if (props.isConnectableStart && ((isMouseTriggered && (event as MouseEvent).button === 0) || !isMouseTriggered)) {
    const currentStore = store.getState();

    XYHandle.onPointerDown(event, {
      autoPanOnConnect: currentStore.autoPanOnConnect,
      connectionMode: currentStore.connectionMode,
      connectionRadius: currentStore.connectionRadius,
      domNode: currentStore.domNode,
      nodeLookup: currentStore.nodeLookup,
      lib: currentStore.lib,
      isTarget: isTarget.value,
      handleId: handleId.value,
      nodeId,
      flowId: currentStore.rfId,
      panBy: currentStore.panBy,
      cancelConnection: currentStore.cancelConnection,
      onConnectStart: currentStore.onConnectStart,
      onConnectEnd: (connection) => {
        currentStore.onConnectEnd?.(connection);
        if (connection?.isValid) {
          onConnectExtended(connection);
        }
      },
      updateConnection: currentStore.updateConnection,
      onConnect: onConnectExtended,
      isValidConnection: props.isValidConnection || currentStore.isValidConnection,
      getTransform: () => store.getState().transform,
      getFromHandle: () => store.getState().connection.fromHandle,
      autoPanSpeed: currentStore.autoPanSpeed,
    });
  }

  if (isMouseTriggered) {
    props.onMouseDown?.(event as MouseEvent);
  } else {
    props.onTouchStart?.(event as TouchEvent);
  }
};

const onClick = (event: MouseEvent) => {
  const {
    onClickConnectStart,
    onClickConnectEnd,
    connectionClickStartHandle,
    connectionMode,
    isValidConnection: isValidConnectionStore,
    lib,
    rfId: flowId,
    nodeLookup,
    connection: connectionState,
  } = store.getState();

  if (!nodeId || (!connectionClickStartHandle && !props.isConnectableStart)) {
    return;
  }

  if (!connectionClickStartHandle) {
    onClickConnectStart?.(event, { nodeId, handleId: handleId.value, handleType: props.type });
    store.setState({ connectionClickStartHandle: { nodeId, type: props.type, id: handleId.value } });
    return;
  }

  const doc = getHostForElement(event.target as Element);
  const isValidConnectionHandler = props.isValidConnection || isValidConnectionStore;
  const { connection, isValid } = XYHandle.isValid(event, {
    handle: {
      nodeId,
      id: handleId.value,
      type: props.type,
    },
    connectionMode,
    fromNodeId: connectionClickStartHandle.nodeId,
    fromHandleId: connectionClickStartHandle.id || null,
    fromType: connectionClickStartHandle.type,
    isValidConnection: isValidConnectionHandler,
    flowId,
    doc,
    lib,
    nodeLookup,
  });

  if (isValid && connection) {
    onConnectExtended(connection);
  }

  const connectionClone = structuredClone(connectionState) as Optional<ConnectionState, 'inProgress'>;
  delete connectionClone.inProgress;
  connectionClone.toPosition = connectionClone.toHandle ? connectionClone.toHandle.position : null;
  onClickConnectEnd?.(event, connectionClone);

  store.setState({ connectionClickStartHandle: null });
};
</script>

<template>
  <div
    :data-handleid="handleId"
    :data-nodeid="nodeId"
    :data-handlepos="props.position"
    :data-id="`${rfId}-${nodeId}-${handleId}-${props.type}`"
    class="vue-flow__handle"
    :class="[
      `vue-flow__handle-${props.position}`,
      'nodrag',
      noPanClassName,
      props.class,
      {
        source: !isTarget,
        target: isTarget,
        connectable: props.isConnectable,
        connectablestart: props.isConnectableStart,
        connectableend: props.isConnectableEnd,
        clickconnecting: clickConnecting,
        connectingfrom: connectingFrom,
        connectingto: connectingTo,
        valid,
        connectionindicator:
          props.isConnectable &&
          (!connectionInProcess || isPossibleEndHandle) &&
          (connectionInProcess || clickConnectionInProcess ? props.isConnectableEnd : props.isConnectableStart),
      },
    ]"
    @mousedown="onPointerDown"
    @touchstart="onPointerDown"
    @click="connectOnClick ? onClick : undefined"
    :style="props.style"
  >
    <slot />
  </div>
</template>

<style>
.vue-flow__handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #fff;
  border: 1px solid #555;
  border-radius: 50%;
  z-index: 10;
}

.vue-flow__handle-top {
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
}

.vue-flow__handle-right {
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
}

.vue-flow__handle-bottom {
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
}

.vue-flow__handle-left {
  left: -5px;
  top: 50%;
  transform: translateY(-50%);
}

.vue-flow__handle.source {
  background: #555;
}

.vue-flow__handle.target {
  background: #555;
}

.vue-flow__handle.connectable {
  cursor: crosshair;
}

.vue-flow__handle.connectingfrom,
.vue-flow__handle.connectingto {
  background: #ff0072;
}

.vue-flow__handle.valid {
  background: #00ff72;
}

.vue-flow__handle.connectionindicator {
  /* box-shadow: 0 0 0 1px #fff, 0 0 0 3px #ff0072; */
}
</style>
