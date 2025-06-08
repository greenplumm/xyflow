/*
 * This component helps us to update the store with the values coming from the user.
 * We distinguish between values we can update directly (like `snapGrid`)
 * and values that have a dedicated setter function in the store (like `setNodes`).
 */
import { watch, ref, onBeforeUnmount } from 'vue';
import { infiniteExtent, type CoordinateExtent } from '@xyflow/system';
import { useStore, useStoreApi } from '../../hooks/useStore';
import type { Node, Edge, VueFlowState, VueFlowProps, FitViewOptions } from '../../types';
import { defaultNodeOrigin } from '../../container/VueFlow/init-values';

// these fields exist in the global store and we need to keep them up to date
const vueFlowFieldsToTrack = [
  'nodes',
  'edges',
  'defaultNodes',
  'defaultEdges',
  'onConnect',
  'onConnectStart',
  'onConnectEnd',
  'onClickConnectStart',
  'onClickConnectEnd',
  'nodesDraggable',
  'nodesConnectable',
  'nodesFocusable',
  'edgesFocusable',
  'edgesReconnectable',
  'elevateNodesOnSelect',
  'elevateEdgesOnSelect',
  'minZoom',
  'maxZoom',
  'nodeExtent',
  'onNodesChange',
  'onEdgesChange',
  'elementsSelectable',
  'connectionMode',
  'snapGrid',
  'snapToGrid',
  'translateExtent',
  'connectOnClick',
  'defaultEdgeOptions',
  'fitView',
  'fitViewOptions',
  'onNodesDelete',
  'onEdgesDelete',
  'onDelete',
  'onNodeDrag',
  'onNodeDragStart',
  'onNodeDragStop',
  'onSelectionDrag',
  'onSelectionDragStart',
  'onSelectionDragStop',
  'onMoveStart',
  'onMove',
  'onMoveEnd',
  'noPanClassName',
  'nodeOrigin',
  'autoPanOnConnect',
  'autoPanOnNodeDrag',
  'onError',
  'connectionRadius',
  'isValidConnection',
  'selectNodesOnDrag',
  'nodeDragThreshold',
  'onBeforeDelete',
  'debug',
  'autoPanSpeed',
  'paneClickDistance',
] as const;

type ReactFlowFieldsToTrack = (typeof vueFlowFieldsToTrack)[number];
type StoreUpdaterProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> = Pick<
  VueFlowProps<NodeType, EdgeType>,
  ReactFlowFieldsToTrack
> & {
  rfId: string;
};
// const props = defineProps<StoreUpdaterProps<NodeType, EdgeType>>();
// rfId doesn't exist in VueFlowProps, but it's one of the fields we want to update
const fieldsToTrack = [...vueFlowFieldsToTrack, 'rfId'] as const;

const selector = (s: VueFlowState) => ({
  setNodes: s.setNodes,
  setEdges: s.setEdges,
  setMinZoom: s.setMinZoom,
  setMaxZoom: s.setMaxZoom,
  setTranslateExtent: s.setTranslateExtent,
  setNodeExtent: s.setNodeExtent,
  reset: s.reset,
  setDefaultNodesAndEdges: s.setDefaultNodesAndEdges,
  setPaneClickDistance: s.setPaneClickDistance,
});

const initPrevValues = {
  translateExtent: infiniteExtent,
  nodeOrigin: defaultNodeOrigin,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: true,
  noPanClassName: 'nopan',
  rfId: '1',
  paneClickDistance: 0,
};

export function StoreUpdater<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  props: StoreUpdaterProps<NodeType, EdgeType>
) {
  const {
    setNodes,
    setEdges,
    setMinZoom,
    setMaxZoom,
    setTranslateExtent,
    setNodeExtent,
    reset,
    setDefaultNodesAndEdges,
    setPaneClickDistance,
  } = useStore(selector);
  const store = useStoreApi<NodeType, EdgeType>();
  
  const previousFields = ref<Partial<StoreUpdaterProps<NodeType, EdgeType>>>(initPrevValues);

  // Initialize default nodes and edges
  setDefaultNodesAndEdges(props.defaultNodes, props.defaultEdges);
  
  // Cleanup on unmount
  onBeforeUnmount(() => {
    previousFields.value = initPrevValues;
    reset();
  });

  // Watch for props changes
  watch(
    () => fieldsToTrack.map((fieldName) => props[fieldName]),
    () => {
      for (const fieldName of fieldsToTrack) {
        const fieldValue = props[fieldName];
        const previousFieldValue = previousFields.value[fieldName];

        if (fieldValue === previousFieldValue) continue;
        if (typeof props[fieldName] === 'undefined') continue;
        
        // Custom handling with dedicated setters
        if (fieldName === 'nodes') setNodes(fieldValue as Node[]);
        else if (fieldName === 'edges') setEdges(fieldValue as Edge[]);
        else if (fieldName === 'minZoom') setMinZoom(fieldValue as number);
        else if (fieldName === 'maxZoom') setMaxZoom(fieldValue as number);
        else if (fieldName === 'translateExtent') setTranslateExtent(fieldValue as CoordinateExtent);
        else if (fieldName === 'nodeExtent') setNodeExtent(fieldValue as CoordinateExtent);
        else if (fieldName === 'paneClickDistance') setPaneClickDistance(fieldValue as number);
        // Renamed fields
        else if (fieldName === 'fitView') store.setState({ fitViewOnInit: fieldValue as boolean });
        else if (fieldName === 'fitViewOptions') store.setState({ fitViewOnInitOptions: fieldValue as FitViewOptions });
        // General case
        else store.setState({ [fieldName]: fieldValue });
      }

      previousFields.value = props;
    },
    { 
      deep: true, 
      // immediate: true 
    }
  );
}