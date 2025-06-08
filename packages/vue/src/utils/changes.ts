/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EdgeLookup,
  NodeLookup,
  EdgeChange,
  NodeChange,
  NodeSelectionChange,
  EdgeSelectionChange,
  NodeRemoveChange,
  EdgeRemoveChange,
} from '@xyflow/system';
import type { Node, Edge } from '../types';

function applyChanges(changes: any[], elements: any[]): any[] {
  const updatedElements: any[] = [];
  const changesMap = new Map<any, any[]>();
  const addItemChanges: any[] = [];

  for (const change of changes) {
    if (change.type === 'add') {
      addItemChanges.push(change);
      continue;
    } else if (change.type === 'remove' || change.type === 'replace') {
      changesMap.set(change.id, [change]);
    } else {
      const elementChanges = changesMap.get(change.id);
      elementChanges ? elementChanges.push(change) : changesMap.set(change.id, [change]);
    }
  }

  for (const element of elements) {
    const changes = changesMap.get(element.id);

    if (!changes) {
      updatedElements.push(element);
      continue;
    }

    if (changes[0].type === 'remove') continue;
    if (changes[0].type === 'replace') {
      updatedElements.push({ ...changes[0].item });
      continue;
    }

    const updatedElement = { ...element };
    changes.forEach(change => applyChange(change, updatedElement));
    updatedElements.push(updatedElement);
  }

  if (addItemChanges.length) {
    addItemChanges.forEach(change => {
      change.index !== undefined
        ? updatedElements.splice(change.index, 0, { ...change.item })
        : updatedElements.push({ ...change.item });
    });
  }

  return updatedElements;
}

function applyChange(change: any, element: any) {
  switch (change.type) {
    case 'select':
      element.selected = change.selected;
      break;
    case 'position':
      change.position !== undefined && (element.position = change.position);
      change.dragging !== undefined && (element.dragging = change.dragging);
      break;
    case 'dimensions':
      if (change.dimensions) {
        element.measured ??= {};
        element.measured.width = change.dimensions.width;
        element.measured.height = change.dimensions.height;
        change.setAttributes && (element.width = change.dimensions.width, element.height = change.dimensions.height);
      }
      change.resizing !== undefined && (element.resizing = change.resizing);
      break;
  }
}

export function applyNodeChanges<NodeType extends Node = Node>(
  changes: NodeChange<NodeType>[],
  nodes: NodeType[]
): NodeType[] {
  return applyChanges(changes, nodes) as NodeType[];
}

export function applyEdgeChanges<EdgeType extends Edge = Edge>(
  changes: EdgeChange<EdgeType>[],
  edges: EdgeType[]
): EdgeType[] {
  return applyChanges(changes, edges) as EdgeType[];
}

export function createSelectionChange(id: string, selected: boolean): NodeSelectionChange | EdgeSelectionChange {
  return { id, type: 'select', selected };
}

export function getSelectionChanges(
  items: Map<string, any>,
  selectedIds: Set<string> = new Set(),
  mutateItem = false
) {
  const changes: Array<NodeSelectionChange | EdgeSelectionChange> = [];

  for (const [id, item] of items) {
    const willBeSelected = selectedIds.has(id);
    if (item.selected !== willBeSelected) {
      mutateItem && (item.selected = willBeSelected);
      changes.push(createSelectionChange(id, willBeSelected));
    }
  }

  return changes;
}

export function getElementsDiffChanges({
  items = [],
  lookup,
}: {
  items: any[] | undefined;
  lookup: Map<string, any>;
}): any[] {
  const changes: any[] = [];
  const itemsLookup = new Map(items.map(item => [item.id, item]));

  items.forEach((item, index) => {
    const storeItem = lookup.get(item.id)?.internals?.userNode ?? lookup.get(item.id);
    storeItem !== undefined && storeItem !== item && changes.push({ id: item.id, item, type: 'replace' });
    !storeItem && changes.push({ item, type: 'add', index });
  });

  Array.from(lookup.keys()).forEach(id => {
    !itemsLookup.has(id) && changes.push({ id, type: 'remove' });
  });

  return changes;
}

export function elementToRemoveChange<T extends Node | Edge>(item: T): NodeRemoveChange | EdgeRemoveChange {
  return { id: item.id, type: 'remove' };
}