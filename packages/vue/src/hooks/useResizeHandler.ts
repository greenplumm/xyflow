import { watch, onUnmounted, ref } from 'vue'
import type { OnResize, OnResizeEnd, OnResizeStart, ResizeHandlerOptions } from '../types'

export function useResizeHandler({
  onResizeStart,
  onResize,
  onResizeEnd,
  element,
}: ResizeHandlerOptions) {
  const resizeObserver = ref<ResizeObserver>()
  const isResizing = ref(false)

  const handleResizeStart = (event: Event) => {
    isResizing.value = true
    onResizeStart?.(event)
  }

  const handleResize = (event: Event) => {
    if (isResizing.value) {
      onResize?.(event)
    }
  }

  const handleResizeEnd = (event: Event) => {
    isResizing.value = false
    onResizeEnd?.(event)
  }

  const setupWindowListeners = () => {
    window.addEventListener('resize', handleResize)
    window.addEventListener('resize', handleResizeEnd)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('resize', handleResizeEnd)
    }
  }

  const setupElementObserver = () => {
    if (element) {
      resizeObserver.value = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const event = new Event('resize')
          handleResizeStart(event)
          handleResize(event)
          handleResizeEnd(event)
        })
      })

      resizeObserver.value.observe(element)
    }

    return () => {
      resizeObserver.value?.disconnect()
    }
  }

  const cleanupWindow = setupWindowListeners()
  const cleanupObserver = setupElementObserver()

  onUnmounted(() => {
    cleanupWindow()
    cleanupObserver()
  })

  return {
    isResizing,
  }
}