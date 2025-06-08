<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { useStore, useStoreApi } from '../../hooks/useStore';
import type { OnSelectionChangeFunc, Node, Edge } from '../../types';

interface SelectionListenerProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  onSelectionChange?: OnSelectionChangeFunc<NodeType, EdgeType>;
}

const selector = (s: any) => {
  const selectedNodes = [];
  const selectedEdges = [];

  for (const [, node] of s.nodeLookup) {
    if (node.selected) {
      selectedNodes.push(node.internals.userNode);
    }
  }

  for (const [, edge] of s.edgeLookup) {
    if (edge.selected) {
      selectedEdges.push(edge);
    }
  }

  return { selectedNodes, selectedEdges };
};

export default defineComponent({
  name: 'SelectionListener',
  props: {
    onSelectionChange: {
      type: Function as PropType<OnSelectionChangeFunc>,
      default: undefined,
    },
  },
  setup(props) {
    const store = useStoreApi();
    const state = useStore(selector);

    watch(
      () => state.value,
      (newVal, oldVal) => {
        if (props.onSelectionChange) {
          props.onSelectionChange({
            nodes: newVal.selectedNodes,
            edges: newVal.selectedEdges,
          });
        }
      },
      { deep: true }
    );

    return {};
  },
});
</script>
