export function getSelectionChanges(
  items: Map<string, any>,
  selectedIds: Set<string> = new Set(),
  mutateItem = false
) {
  const changes: Array<any> = [];

  for (const [id, item] of items) {
    const willBeSelected = selectedIds.has(id);
    if (item.selected !== willBeSelected) {
      mutateItem && (item.selected = willBeSelected);
      changes.push({
        id,
        type: 'select',
        selected: willBeSelected
      });
    }
  }

  return changes;
}

export function createSelectionChange(id: string, selected: boolean) {
  return {
    id,
    type: 'select',
    selected
  } as const;
}