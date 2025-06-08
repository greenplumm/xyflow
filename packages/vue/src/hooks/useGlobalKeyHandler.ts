import { watch } from 'vue';
import type { KeyCode } from '@xyflow/system';

import { useStoreApi } from './useStore';
import { useKeyPress, UseKeyPressOptions } from './useKeyPress';
import { useVueFlow } from './useVueFlow';
import type { Edge, Node } from '../types';

const selected = (item: Node | Edge) => item.selected;

const deleteKeyOptions: UseKeyPressOptions = { actInsideInputWithModifier: false };
const win = typeof window !== 'undefined' ? window : undefined;

/**
 * Hook for handling global key events.
 *
 * @internal
 */
export function useGlobalKeyHandler({
  deleteKeyCode,
  multiSelectionKeyCode,
}: {
  deleteKeyCode: KeyCode | null;
  multiSelectionKeyCode: KeyCode | null;
}): void {
  const store = useStoreApi();
  const { deleteElements } = useVueFlow();

  const deleteKeyPressed = useKeyPress(deleteKeyCode, deleteKeyOptions);
  const multiSelectionKeyPressed = useKeyPress(multiSelectionKeyCode, { target: win });

  watch(deleteKeyPressed, (pressed) => {
    if (pressed) {
      const { edges, nodes } = store.getState();
      deleteElements({ nodes: nodes.filter(selected), edges: edges.filter(selected) });
      store.setState({ nodesSelectionActive: false });
    }
  });

  watch(multiSelectionKeyPressed, (pressed) => {
    store.setState({ multiSelectionActive: pressed });
  });
}