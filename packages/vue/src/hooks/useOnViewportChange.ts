import { watch, onUnmounted } from 'vue';
import { useStoreApi } from './useStore';
import type { OnViewportChange } from '@xyflow/system';

export type UseOnViewportChangeOptions = {
  onStart?: OnViewportChange;
  onChange?: OnViewportChange;
  onEnd?: OnViewportChange;
};

/**
 * `useOnViewportChange`钩子让你可以监听视口的变化，例如平移和缩放。
 * 你可以为视口变化的每个阶段提供回调函数：`onStart`、`onChange`和`onEnd`。
 *
 * @public
 * @param params.onStart - 当视口开始变化时调用
 * @param params.onChange - 当视口变化时调用
 * @param params.onEnd - 当视口停止变化时调用
 *
 * @example
 * ```vue
 *<script setup>
 *import { useOnViewportChange } from '@xyflow/vue';
 *
 *useOnViewportChange({
 *  onStart: (viewport) => console.log('start', viewport),
 *  onChange: (viewport) => console.log('change', viewport),
 *  onEnd: (viewport) => console.log('end', viewport),
 *});
 *</script>
 *```
 */
export function useOnViewportChange({ onStart, onChange, onEnd }: UseOnViewportChangeOptions) {
  const store = useStoreApi();

  watch(() => onStart, (newHandler) => {
    store.setState({ onViewportChangeStart: newHandler });
  }, { immediate: true });

  watch(() => onChange, (newHandler) => {
    store.setState({ onViewportChange: newHandler });
  }, { immediate: true });

  watch(() => onEnd, (newHandler) => {
    store.setState({ onViewportChangeEnd: newHandler });
  }, { immediate: true });

  onUnmounted(() => {
    store.setState({ 
      onViewportChangeStart: undefined,
      onViewportChange: undefined,
      onViewportChangeEnd: undefined
    });
  });
}