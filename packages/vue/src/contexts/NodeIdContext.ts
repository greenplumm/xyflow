import { inject, provide, type InjectionKey, type Ref, ref } from 'vue';

export const NodeIdSymbol: InjectionKey<Ref<string | null>> = Symbol('NodeId');

export function useNodeId(): string | null {
  const nodeId = inject(NodeIdSymbol, ref(null));
  return nodeId.value;
}

export function provideNodeId(nodeId: string) {
  provide(NodeIdSymbol, ref(nodeId));
}

export default {
  useNodeId,
  provideNodeId
};