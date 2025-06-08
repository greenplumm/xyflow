import { inject, provide, type InjectionKey } from 'vue';
import { createStore } from '../store';

export type StoreContextType = ReturnType<typeof createStore>;

export const StoreContextKey: InjectionKey<StoreContextType> = Symbol('StoreContext');

export const Provider = (store: StoreContextType, key) => {
  provide(key || StoreContextKey, store);
};

export const storeContext = {
  Provider,
  Inject: (key) => inject(key || StoreContextKey)
};

export default storeContext;