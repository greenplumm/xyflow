import { watch } from 'vue'
import type { Viewport } from '@xyflow/system'
import { useStore, useStoreApi } from './useStore'
import type { VueFlowState } from '../types'

const selector = (state: VueFlowState) => state.panZoom?.syncViewport

export function useViewportSync(viewport?: Viewport) {
  const store = useStoreApi()
  const syncViewport = useStore(selector)

  watch(() => viewport, (currentViewport) => {
    if (currentViewport) {
      syncViewport?.(currentViewport)
      store.setState({ transform: [currentViewport.x, currentViewport.y, currentViewport.zoom] })
    }
  }, { immediate: true, deep: true })

  return null
}