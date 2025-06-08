import { watchEffect } from 'vue';
import { errorMessages } from '@xyflow/system';
import { useStoreApi } from '../../hooks/useStore';
import type { EdgeTypes, NodeTypes } from '../../types';

let emptyTypes = {};

/**
 * This hook warns the user if nodeTypes or edgeTypes changed.
 * It is only used in development mode.
 *
 * @internal
 */
export function useNodeOrEdgeTypesWarning(nodeOrEdgeTypes?: NodeTypes): void;
export function useNodeOrEdgeTypesWarning(nodeOrEdgeTypes?: EdgeTypes): void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useNodeOrEdgeTypesWarning(nodeOrEdgeTypes: any = emptyTypes): any {
  const store = useStoreApi();

  if (process.env.NODE_ENV === 'development') {
    watchEffect(() => {
      const usedKeys = new Set([...Object.keys(emptyTypes), ...Object.keys(nodeOrEdgeTypes)]);

      for (const key of usedKeys) {
        if (emptyTypes[key] !== nodeOrEdgeTypes[key]) {
          store.getState().onError?.('002', errorMessages['error002']());
          break;
        }
      }

      emptyTypes = nodeOrEdgeTypes;
    });
  }
}