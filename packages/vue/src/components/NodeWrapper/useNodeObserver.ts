// src/composables/useNodeObserver.ts
import { ref, watch, onBeforeUnmount, Ref, computed } from 'vue'
import { useStoreApi } from '../../hooks/useStore'
import type { InternalNode } from '../../types'

interface UseNodeObserverOptions {
  /** 响应式 node 对象 */
  node: Ref<InternalNode>
  /** 节点类型 */
  nodeType: Ref<string>
  /** 是否已经有了尺寸（hasDimensions） */
  hasDimensions: Ref<boolean>
  /** ResizeObserver 实例 */
  resizeObserver: Ref<ResizeObserver | null>
}

/**
 * 监控单个节点的尺寸变化 & 内部状态更新
 * @returns `nodeRef` - 绑定到渲染 DOM 元素上的 ref
 */
export function useNodeObserver({
  nodeRef,
  node,
  nodeType,
  hasDimensions,
  resizeObserver,
}: UseNodeObserverOptions) {
  const store = useStoreApi()
  // const nodeRef = ref<HTMLElement | null>(null)
  const observedNode = ref<HTMLElement | null>(null)

  // 保存上一次的位置/类型，用于对比
  const prevSource = ref(node.sourcePosition)
  const prevTarget = ref(node.targetPosition)
  const prevType   = ref(nodeType)

  // 等价于 React 中的 isInitialized
  const isInitialized = computed(() => hasDimensions.value && !!node.internals.handleBounds)

  // 1️⃣ 监听 isInitialized、node.hidden
  watch(
    [isInitialized, nodeRef, () => node.hidden],
    () => {
      const el = nodeRef.value
      if (
        el &&
        !node.hidden &&
        (!isInitialized.value || observedNode.value !== el)
      ) {
        if (observedNode.value && resizeObserver.value) {
          resizeObserver.value.unobserve(observedNode.value)
        }
        if (resizeObserver) {
          resizeObserver.observe(el)
        }
        observedNode.value = el
      }
    },
    { immediate: true }
  )

  // 2️⃣ 组件卸载时清理 observer
  onBeforeUnmount(() => {
    if (observedNode.value && resizeObserver.value) {
      resizeObserver.value.unobserve(observedNode.value)
      observedNode.value = null
    }
  })

  // 3️⃣ 监听 nodeType / sourcePosition / targetPosition
  watch(
    [
      () => node.sourcePosition,
      () => node.targetPosition,
      () => nodeType,
    ],
    ([newSource, newTarget, newType]) => {
      const el = nodeRef.value
      if (!el) return

      const typeChanged   = prevType.value   !== newType
      const sourceChanged = prevSource.value !== newSource
      const targetChanged = prevTarget.value !== newTarget

      if (typeChanged || sourceChanged || targetChanged) {
        prevType.value   = newType
        prevSource.value = newSource
        prevTarget.value = newTarget

        // 调用 store 更新 internals
        store
          .getState()
          .updateNodeInternals(
            new Map([[ node.id, { id: node.id, nodeElement: el, force: true } ]])
          )
      }
    },
    // 只需在依赖变化时触发，无需 immediate
  )

  return nodeRef
}
