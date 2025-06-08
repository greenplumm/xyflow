import { computed } from 'vue'
import { getHandleBounds } from '@xyflow/system'
import { error } from '../../utils/errors'
import type { HandleProps } from './types'

export function useHandle(props: HandleProps) {
  const handleId = computed(() => {
    if (!props.nodeId) {
      error('002')
      return ''
    }
    return `${props.nodeId}-${props.position.join('-')}`
  })

  const handlePointerDown = (event: MouseEvent | TouchEvent) => {
    if (!props.onConnectStart || !props.nodeId) return

    const isTarget = props.type === 'target'
    const handleType = isTarget ? 'target' : 'source'
    const { x, y } = getHandleBounds(event.target as HTMLElement)

    props.onConnectStart(event, {
      nodeId: props.nodeId,
      handleType,
      x,
      y
    })

    const onMouseMove = (e: MouseEvent) => {
      props.onConnect?.({
        source: !isTarget ? props.nodeId! : null,
        target: isTarget ? props.nodeId! : null,
        sourceHandle: handleId.value,
        targetHandle: handleId.value
      })
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      props.onConnectEnd?.(event)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  return {
    handleId,
    handlePointerDown
  }
}