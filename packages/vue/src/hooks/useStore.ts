import { computed } from 'vue'
import { storeContext as useFlowStore } from '../contexts/StoreContext';
 
import type { VueFlowState } from '../types'
import { errorMessages } from '@xyflow/system'

const piniaErrorMessage = errorMessages['error001']()

/**
 * Subscribe to reactive slices of the Vue Flow store.
 * @param selector - function to pick a slice from the store state
 * @returns a computed ref of the selected state slice
 */
export function useStore<StateSlice>(
  selector: (state: VueFlowState) => StateSlice
) {
  const store = useFlowStore.Inject() as VueFlowStore
  if (!store) {
    throw new Error(piniaErrorMessage)
  }
  // reactive computed slice
  return computed(() => selector(store as VueFlowState))
}

/**
 * Access the Vue Flow store API for direct state reading and patching.
 * @returns getState, setState, subscribe methods similar to Zustand
 */
export function useStoreApi() {
  const store = useFlowStore.Inject() as VueFlowStore
  if (!store) {
    throw new Error(piniaErrorMessage)
  }
  // 新版 getState：返回一个把 state + action 混合在一起的对象
  function getState(): VueFlowState & VueFlowStore {
    const state = store.$state as VueFlowState

    return new Proxy(state, {
      get(target, prop: string) {
        // 1. 优先读 state
        if (prop in target) {
          return (target as any)[prop]
        }
        // 2. 再去 store 上找（actions、getters、其他属性）
        const val = (store as any)[prop]
        if (typeof val === 'function') {
          // bind 回 store，保证 this/Proxy 正确
          return val.bind(store)
        }
        return val
      },
      set(target, prop: string, value) {
        // 写 state 时，走 $patch
        if (prop in (target as any)) {
          store.$patch({ [prop]: value })
          return true
        }
        // 其它属性不允许写
        return false
      },
    }) as VueFlowState & VueFlowStore
  }
  return {
    getState,
    setState: (patch: Partial<VueFlowState>) => store.$patch(patch),
    subscribe: store.$subscribe.bind(store),
  }
}
