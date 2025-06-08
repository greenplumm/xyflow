import { defineStore } from 'pinia';

import {
  getFitViewNodes,
  fitView as fitViewSystem,
  adoptUserNodes,
  updateAbsolutePositions,
  panBy as panBySystem,
  updateNodeInternals as updateNodeInternalsSystem,
  updateConnectionLookup,
  handleExpandParent,
  NodeChange,
  EdgeSelectionChange,
  NodeSelectionChange,
  ParentExpandChild,
  initialConnection,
  NodeOrigin,
  CoordinateExtent,
} from '@xyflow/system';

import { applyEdgeChanges, applyNodeChanges, createSelectionChange, getSelectionChanges } from '../utils/changes';
import getInitialState from './initialState';
import type { VueFlowStore, Node, Edge, UnselectNodesAndEdgesParams, FitViewOptions } from '../types';

export const useVueFlowStore = defineStore('vueflow', {
  state: () => ({
    ...getInitialState(),
    // transform: [0, 0, 1] as Transform,
  }),
  actions: {
    setNodes(nodes: Node[]) {
      const { nodeLookup, parentLookup, nodeOrigin, elevateNodesOnSelect, nodeExtent } = this;
      adoptUserNodes(nodes, nodeLookup, parentLookup, {
        nodeOrigin,
        nodeExtent,
        elevateNodesOnSelect,
        checkEquality: true,
      });
      this.nodes = nodes;
    },
    setEdges(edges: Edge[]) {
      updateConnectionLookup(this.connectionLookup, this.edgeLookup, edges);
      this.edges = edges;
    },
    setDefaultNodesAndEdges(nodes?: Node[], edges?: Edge[]) {
      if (nodes) {
        this.setNodes(nodes);
        this.hasDefaultNodes = true;
      }
      if (edges) {
        this.setEdges(edges);
        this.hasDefaultEdges = true;
      }
    },
    updateNodeInternals(updates: string[], params = { triggerFitView: true }) {
      const {
        triggerNodeChanges,
        nodeLookup,
        parentLookup,
        fitViewOnInit,
        fitViewDone,
        fitViewOnInitOptions,
        domNode,
        nodeOrigin,
        nodeExtent,
        elevateNodesOnSelect,
        fitViewSync
      } = this;

      // const changes = updateNodeInternalsSystem(updates, nodeLookup, parentLookup, {
      //   nodeOrigin,
      //   nodeExtent,
      //   elevateNodesOnSelect,
      // });
      const { changes, updatedInternals } = updateNodeInternalsSystem(
        updates,
        nodeLookup,
        parentLookup,
        domNode,
        nodeOrigin,
        nodeExtent
      );

      if (!updatedInternals) {
        return;
      }
      updateAbsolutePositions(nodeLookup, parentLookup, { nodeOrigin, nodeExtent });
      if (params.triggerFitView) {
        // this.fitViewSync(fitViewOnInitOptions);
        let nextFitViewDone = fitViewDone;
            if (!fitViewDone && fitViewOnInit) {
                nextFitViewDone = fitViewSync({
                    ...fitViewOnInitOptions,
                    nodes: fitViewOnInitOptions?.nodes,
                });
            }
        this.fitViewDone = nextFitViewDone
      }
      if (changes.length > 0) {
        triggerNodeChanges(changes);
      }
    },
    updateNodePositions(nodeDragItems, dragging = false) {
      const parentExpandChildren: ParentExpandChild[] = [];
      const changes = [];
      const { nodeLookup, triggerNodeChanges } = this;

      for (const [id, dragItem] of nodeDragItems) {
        const node = nodeLookup.get(id);
        const expandParent = !!(node?.expandParent && node?.parentId && dragItem?.position);

        const change: NodeChange = {
          id,
          type: 'position',
          position: expandParent
            ? {
                x: Math.max(0, dragItem.position.x),
                y: Math.max(0, dragItem.position.y),
              }
            : dragItem.position,
          dragging,
        };

        if (expandParent && node.parentId) {
          parentExpandChildren.push({
            id,
            parentId: node.parentId,
            rect: {
              ...dragItem.internals.positionAbsolute,
              width: dragItem.measured.width ?? 0,
              height: dragItem.measured.height ?? 0,
            },
          });
        }

        changes.push(change);
      }

      if (parentExpandChildren.length > 0) {
        const { parentLookup, nodeOrigin } = this;
        const parentExpandChanges = handleExpandParent(parentExpandChildren, nodeLookup, parentLookup, nodeOrigin);
        changes.push(...parentExpandChanges);
      }

      triggerNodeChanges(changes);
    },
    addSelectedNodes(selectedNodeIds) {
      const { multiSelectionActive, edgeLookup, nodeLookup, triggerNodeChanges, triggerEdgeChanges } = this;

      if (multiSelectionActive) {
        const nodeChanges = selectedNodeIds.map((nodeId) => createSelectionChange(nodeId, true));
        triggerNodeChanges(nodeChanges);
        return;
      }

      triggerNodeChanges(getSelectionChanges(nodeLookup, new Set([...selectedNodeIds]), true));
      triggerEdgeChanges(getSelectionChanges(edgeLookup));
    },
    addSelectedEdges(selectedEdgeIds) {
      const { multiSelectionActive, edgeLookup, nodeLookup, triggerNodeChanges, triggerEdgeChanges } = this;

      if (multiSelectionActive) {
        const changedEdges = selectedEdgeIds.map((edgeId) => createSelectionChange(edgeId, true));
        triggerEdgeChanges(changedEdges);
        return;
      }

      triggerEdgeChanges(getSelectionChanges(edgeLookup, new Set([...selectedEdgeIds])));
      triggerNodeChanges(getSelectionChanges(nodeLookup, new Set(), true));
    },
    unselectNodesAndEdges({ nodes, edges }: UnselectNodesAndEdgesParams = {}) {
      const { edges: storeEdges, nodes: storeNodes, nodeLookup, triggerNodeChanges, triggerEdgeChanges } = this;
      const nodesToUnselect = nodes ? nodes : storeNodes;
      const edgesToUnselect = edges ? edges : storeEdges;
      const nodeChanges = nodesToUnselect.map((n) => {
        const internalNode = nodeLookup.get(n.id);
        if (internalNode) {
          internalNode.selected = false;
        }

        return createSelectionChange(n.id, false);
      });
      const edgeChanges = edgesToUnselect.map((edge) => createSelectionChange(edge.id, false));

      triggerNodeChanges(nodeChanges);
      triggerEdgeChanges(edgeChanges);
    },
    resetSelectedElements() {
      const { edges, nodes, triggerNodeChanges, triggerEdgeChanges } = this;

      const nodeChanges = nodes.reduce<NodeSelectionChange[]>(
        (res, node) => (node.selected ? [...res, createSelectionChange(node.id, false)] : res),
        []
      );
      const edgeChanges = edges.reduce<EdgeSelectionChange[]>(
        (res, edge) => (edge.selected ? [...res, createSelectionChange(edge.id, false)] : res),
        []
      );

      triggerNodeChanges(nodeChanges);
      triggerEdgeChanges(edgeChanges);
    },
     setMinZoom(minZoom){
        const { panZoom, maxZoom } = this;
        panZoom?.setScaleExtent([minZoom, maxZoom]);
        this.minZoom = minZoom;
      },
      setMaxZoom(maxZoom){
        const { panZoom, minZoom } = this;
        panZoom?.setScaleExtent([minZoom, maxZoom]);
        this.maxZoom = maxZoom;
      },
    setTranslateExtent(translateExtent) {
      this.panZoom?.setTranslateExtent(translateExtent);
      this.translateExtent = translateExtent;
    },
    panBy(delta) : Promise<boolean> {
      const { transform, width, height, panZoom, translateExtent } = this;

      return panBySystem({ delta, panZoom, transform, translateExtent, width, height });
    },
    triggerNodeChanges(changes) {
        const { onNodesChange, setNodes, nodes, hasDefaultNodes, debug } = this;

        if (changes?.length) {
          if (hasDefaultNodes) {
            const updatedNodes = applyNodeChanges(changes, nodes);
            setNodes(updatedNodes);
          }

          if (debug) {
            console.log('Vue Flow: trigger node changes', changes);
          }

          onNodesChange?.(changes);
        }
      },
      triggerEdgeChanges(changes) {
        const { onEdgesChange, setEdges, edges, hasDefaultEdges, debug } = this;

        if (changes?.length) {
          if (hasDefaultEdges) {
            const updatedEdges = applyEdgeChanges(changes, edges);
            setEdges(updatedEdges);
          }

          if (debug) {
            console.log('React Flow: trigger edge changes', changes);
          }

          onEdgesChange?.(changes);
        }
      },
    fitView(options?: FitViewOptions): Promise<boolean> {
      const { panZoom, width, height, minZoom, maxZoom, nodeLookup } = this;

      if (!panZoom) {
        return Promise.resolve(false);
      }

      const fitViewNodes = getFitViewNodes(nodeLookup, options);

      return fitViewSystem(
        {
          nodes: fitViewNodes,
          width,
          height,
          panZoom,
          minZoom,
          maxZoom,
        },
        options
      );
    },
    fitViewSync(options) {
        const { panZoom, width, height, minZoom, maxZoom, nodeLookup, fitView } = this;
        if (!panZoom) {
            return false;
        }
        const fitViewNodes = getFitViewNodes(nodeLookup, options);
        fitViewSystem({
            nodes: fitViewNodes,
            width,
            height,
            panZoom,
            minZoom,
            maxZoom,
        }, options);
        return fitViewNodes.size > 0;
    },
    cancelConnection() {
      this.connection = { ...initialConnection };
    },
    updateConnection(connection) {
      this.connection = connection;
    },
    reset() {
      this.$patch({ ...getInitialState() });
    },
  },
});

export const createStore = (options: {
  nodes?: Node[];
  edges?: Edge[];
  defaultNodes?: Node[];
  defaultEdges?: Edge[];
  width?: number;
  height?: number;
  fitView?: boolean;
  nodeOrigin?: NodeOrigin;
  nodeExtent?: CoordinateExtent;
}) => {
  const store = useVueFlowStore();
  store.$patch({ 
      nodes: options.nodes,
      edges: options.edges,
      width: options.width,
      height: options.height,
      fitView: options.fitView,
      nodeOrigin: options.nodeOrigin,
      // nodeExtent: options.nodeExtent,
      defaultNodes: options.defaultNodes,
      defaultEdges: options.defaultEdges,
  });
  return store;
};