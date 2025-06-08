import { ref, watchEffect, onUnmounted } from 'vue';
import type { ColorMode, ColorModeClass } from '@xyflow/system';

function getMediaQuery() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return null;
  }

  return window.matchMedia('(prefers-color-scheme: dark)');
}

/**
 * Hook for receiving the current color mode class 'dark' or 'light'.
 *
 * @internal
 * @param colorMode - The color mode to use ('dark', 'light' or 'system')
 */
export function useColorModeClass(colorMode: ColorMode) {
  const colorModeClass = ref<ColorModeClass | null>(
    colorMode === 'system' ? null : colorMode
  );

  watchEffect(() => {
    if (colorMode !== 'system') {
      colorModeClass.value = colorMode;
      return;
    }

    const mediaQuery = getMediaQuery();
    const updateColorModeClass = () => {
      colorModeClass.value = mediaQuery?.matches ? 'dark' : 'light';
    };

    updateColorModeClass();
    mediaQuery?.addEventListener('change', updateColorModeClass);

    onUnmounted(() => {
      mediaQuery?.removeEventListener('change', updateColorModeClass);
    });
  });

  return colorModeClass.value !== null 
    ? colorModeClass.value 
    : getMediaQuery()?.matches 
      ? 'dark' 
      : 'light';
}