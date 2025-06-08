// utils/fixedForwardRef.ts
import { h, defineComponent, ref, type Component, type Slots } from 'vue'

export type FitViewOptions<NodeType extends Node = Node> = FitViewOptionsBase<NodeType>;
export type Dimensions = {
  width: number;
  height: number;
};

export type Coordinate = {
  x: number;
  y: number;
};

export type Rect = Coordinate & Dimensions;

export type Transform = {
  x: number;
  y: number;
  zoom: number;
};

export type Padding = number | [number, number] | [number, number, number, number];

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export type SnapGrid = [number, number];

export type ConnectionLineType = 'default' | 'step' | 'bezier';


export function fixedForwardRef<T, P = {}>(
  Component: Component<P & { ref?: Ref<T> }>
) {
  return defineComponent({
    name: `WithForwardedRef_${Component.name || 'Component'}`,
    props: Component.props as unknown as undefined,
    setup(props, { expose, attrs, slots }) {
      const innerRef = ref<T>();
      expose({ innerRef });
      return () => h(Component, {
        ...props,
        ...attrs,
        ref: innerRef
      } as typeof props & { ref: Ref<T> }, slots)
    }
  })
}