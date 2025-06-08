import type { InjectionKey } from 'vue'
import type { FlowOptions } from '@xyflow/system'

export interface FlowContext {
  id: string
  options?: FlowOptions
}

export const FlowKey: InjectionKey<FlowContext> = Symbol('flowInstance')

export type VueFlowProviderProps = {
  id?: string
  options?: FlowOptions
}