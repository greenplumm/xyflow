import { ref } from 'vue';
import type { Viewport } from '../types';

export function useViewport(initialViewport?: Viewport) {
  const viewport = ref<Viewport>({
    x: 0,
    y: 0,
    zoom: 1,
    ...initialViewport
  });

  const updateViewport = (newViewport: Partial<Viewport>) => {
    viewport.value = {
      ...viewport.value,
      ...newViewport
    };
  };

  return {
    viewport,
    updateViewport
  };
}