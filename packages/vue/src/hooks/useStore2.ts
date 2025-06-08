// import { computed, inject, toRaw } from 'vue';
// import { useVueFlowStore } from '../store';
import { errorMessages } from '@xyflow/system';
import type { Node, Edge, VueFlowStore } from '../types';
import { storeContext } from '../contexts/StoreContext';
const piniaErrorMessage = errorMessages['error001']();

/**
 * 用于订阅Vue Flow组件内部状态变化的hook
 * @param selector 状态选择器函数
 * @returns 计算属性返回选择的状态切片
 */
export function useStore<StateSlice = unknown>(
  selector: (state: VueFlowStore) => StateSlice
) {
  const store = storeContext.Inject() as VueFlowStore;
  
  if (!store) {
    throw new Error(piniaErrorMessage);
  }
  
  return selector(store);
}

/**
 * 用于直接访问store实例的hook
 * @returns store API对象
 */
export function useStoreApi<NodeType extends Node = Node, EdgeType extends Edge = Edge>() {
  const store = storeContext.Inject();
  
  if (!store) {
    throw new Error(piniaErrorMessage);
  }
  
  return {
    getState: () => store,
    setState: (state: Partial<VueFlowStore>) => store.$patch(state),
    subscribe: (fn: (state: VueFlowStore) => void) => {
      store.$subscribe((mutation, state) => fn(state));
      return () => store.$subscribe(() => {});
    }
  };
}