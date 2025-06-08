import { inject, provide, toRaw, defineComponent, watchEffect, nextTick, computed, type InjectionKey, type Ref } from 'vue';
import { EdgeChange, NodeChange } from '@xyflow/system';

import { useStoreApi } from '../../hooks/useStore';
import { storeContext } from '../../contexts/StoreContext';
import { getElementsDiffChanges } from '../../utils';
import { Queue, QueueItem } from './types';
import type { Edge, Node } from '../../types';
import { useQueue } from './useQueue';

const BatchContextKey: InjectionKey<{
  nodeQueue: Queue<any>;
  edgeQueue: Queue<any>;
}> = Symbol('batch-context') as InjectionKey<{
  nodeQueue: Queue<any>;
  edgeQueue: Queue<any>;
}>;

/**
 * This is a provider component that holds and processes the node and edge update queues
 * that are needed to handle setNodes, addNodes, setEdges and addEdges.
 *
 * @internal
 */
export const BatchProvider = defineComponent({
  setup(_, { slots }) {
    const store = useStoreApi<NodeType, EdgeType>();

  const nodeQueueHandler = watchEffect(() => {
    const { nodes, setNodes, hasDefaultNodes, onNodesChange, nodeLookup } = store.getState();
    // setNodes(nodes || []);
    // return (queueItems: QueueItem<NodeType>[]) => {
      let next = nodes || [];
      // for (const payload of queueItems) {
      //   next = typeof payload === 'function' ? payload(next) : payload;
      // }

      if (hasDefaultNodes) {
        setNodes(next);
      } else if (onNodesChange) {
        onNodesChange(
          getElementsDiffChanges({
            items: next,
            lookup: nodeLookup,
          }) as NodeChange<NodeType>[]
        );
      }
    // };
  });
  
  const nodeQueue = useQueue<NodeType>(nodeQueueHandler);

  const edgeQueueHandler = watchEffect(() => {
    const { edges, setEdges, hasDefaultEdges, onEdgesChange, edgeLookup } = store.getState();
    // setEdges(edges || []);
    // return (queueItems: QueueItem<EdgeType>[]) => {
      let next = edges;
      // for (const payload of queueItems) {
      //   next = typeof payload === 'function' ? payload(next) : payload;
      // }

      if (hasDefaultEdges) {
        setEdges(next);
      } else if (onEdgesChange) {
        onEdgesChange(
          getElementsDiffChanges({
            items: next,
            lookup: edgeLookup,
          }) as EdgeChange<EdgeType>[]
        );
      }
    // };
  });
   
  const edgeQueue = useQueue(edgeQueueHandler);
  
  storeContext.Provider({
    nodeQueue,
    edgeQueue
  }, BatchContextKey);

    return () => slots.default?.();
  },
});
export function BatchProvider1<NodeType extends Node = Node, EdgeType extends Edge = Edge>({
  slots,
}: {
  slots: any;
}) {
  const store = useStoreApi<NodeType, EdgeType>();

  const nodeQueueHandler = watchEffect(() => {
    const { nodes, setNodes, hasDefaultNodes, onNodesChange, nodeLookup } = store.getState();
    
    return (queueItems: QueueItem<NodeType>[]) => {
      let next = nodes?.value || [];
      for (const payload of queueItems) {
        next = typeof payload === 'function' ? payload(next) : payload;
      }

      if (hasDefaultNodes) {
        setNodes(next);
      } else if (onNodesChange) {
        onNodesChange(
          getElementsDiffChanges({
            items: next,
            lookup: nodeLookup,
          }) as NodeChange<NodeType>[]
        );
      }
    };
  });
  
  const nodeQueue = useQueue<NodeType>(nodeQueueHandler);

  const edgeQueueHandler = watchEffect(() => {
    const { edges, setEdges, hasDefaultEdges, onEdgesChange, edgeLookup } = store.getState();
    
    return (queueItems: QueueItem<EdgeType>[]) => {
      let next = edges?.value;
      for (const payload of queueItems) {
        next = typeof payload === 'function' ? payload(next) : payload;
      }

      if (hasDefaultEdges) {
        setEdges(next);
      } else if (onEdgesChange) {
        onEdgesChange(
          getElementsDiffChanges({
            items: next,
            lookup: edgeLookup,
          }) as EdgeChange<EdgeType>[]
        );
      }
    };
  });
   
  const edgeQueue = useQueue(edgeQueueHandler);
  
  storeContext.Provider({
    nodeQueue,
    edgeQueue
  }, BatchContextKey);
  return slots;
}

export function useBatchContext() {
  const batchContext = storeContext.Inject(BatchContextKey);

  if (!batchContext) {
    throw new Error('useBatchContext must be used within a BatchProvider');
  }

  return batchContext;
}