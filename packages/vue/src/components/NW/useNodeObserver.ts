import { ref, onMounted, onUnmounted, watchEffect } from 'vue'
import { getDimensions } from '@xyflow/system'
import type { NodeWrapperProps } from './types'

export function useNodeObserver(props: NodeWrapperProps) {
  const nodeRef = ref<HTMLElement>()
  const resizeHandleRef = ref<HTMLElement>()
  let observer: ResizeObserver | null = null

  const handleResizeStart = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    props.onResizeStart?.(event)

    const startX = event.clientX
    const startY = event.clientY
    const initialWidth = nodeRef.value?.offsetWidth || 0
    const initialHeight = nodeRef.value?.offsetHeight || 0

    const onMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      const newWidth = Math.max(
        props.minWidth || 0,
        Math.min(props.maxWidth || Infinity, initialWidth + deltaX)
      )
      const newHeight = Math.max(
        props.minHeight || 0,
        Math.min(props.maxHeight || Infinity, initialHeight + deltaY)
      )
      
      props.onResize?.(newWidth, newHeight)
    }

    const onMouseUp = (e: MouseEvent) => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      props.onResizeEnd?.(e)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  onMounted(() => {
    observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = getDimensions(entry.target)
        props.onResize?.(width, height)
      }
    })

    watchEffect(() => {
      if (nodeRef.value) {
        observer?.observe(nodeRef.value)
      }
    })
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return {
    nodeRef,
    resizeHandleRef,
    handleResizeStart
  }
}