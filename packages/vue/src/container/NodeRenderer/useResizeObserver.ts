import { onBeforeUnmount } from 'vue'
import { useStore } from '../../hooks/useStore'
import type { InternalNodeUpdate, ResizeObserverEntry } from '@xyflow/system'

/**
 * Vue 3 等价的 useResizeObserver 组合式函数
 * - 创建 ResizeObserver 并在组件卸载时自动断开
 * - 收集 resize entries，将更新批量提交到 store.updateNodeInternals
 */
export function useResizeObserver(): ResizeObserver | null {
  const updateNodeInternals = useStore((s) => s.updateNodeInternals)
  let resizeObserver: ResizeObserver | null = null

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const updates = new Map<string, InternalNodeUpdate>()
      for (const entry of entries) {
        const id = entry.target.getAttribute('data-id')
        if (!id) continue
        updates.set(id, {
          id,
          nodeElement: entry.target as HTMLDivElement,
          force: true,
        })
      }
      updateNodeInternals?.value(updates)
    })
  }

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
  })

  return resizeObserver
}
