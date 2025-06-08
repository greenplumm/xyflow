import { inject, computed } from 'vue';
import { errorMessages } from '@xyflow/system';
import type { Edge, Node, ReactFlowState } from '../types';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    getState: () => ReactFlowState;
    setState: (state: Partial<ReactFlowState>) => void;
    subscribe: (listener: (state: ReactFlowState) => void) => () => void;
  }
}

const piniaErrorMessage = errorMessages['error001']();

/**
 * 这个hook可以用来订阅React Flow组件的内部状态变化
 * @public
 * @param selector
 * @returns 选中的状态切片
 * @example
 * ```ts
 * const nodes = useStore((state) => state.nodes);
 * ```
 */
export function useStore<StateSlice = unknown>(
  selector: (state: ReactFlowState) => StateSlice
) {
  const store = inject('flow-store');
  
  if (!store) {
    throw new Error(piniaErrorMessage);
  }

  return selector(store.getState());
}

/**
 * 在某些情况下，你可能需要直接访问store对象
 * @returns store对象
 * @example
 * ```ts
 * const store = useStoreApi();
 * ```
 */
export function useStoreApi<NodeType extends Node = Node, EdgeType extends Edge = Edge>() {
  const store = inject('flow-store') as {
    getState: () => ReactFlowState<NodeType, EdgeType>;
    setState: (state: Partial<ReactFlowState<NodeType, EdgeType>>) => void;
    subscribe: (listener: (state: ReactFlowState<NodeType, EdgeType>) => void) => () => void;
  } | null;

  if (!store) {
    throw new Error(piniaErrorMessage);
  }

  return {
    getState: store.getState,
    setState: store.setState,
    subscribe: store.subscribe
  };
}