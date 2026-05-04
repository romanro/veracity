import { useState, useCallback } from 'react';

export function useTabSelection<T extends { id: string | number }>(tabs: T[]) {
  const [selected, setSelected] = useState<T['id']>(tabs[0].id);

  const onTabSelected = useCallback(
    (id: T['id']) => {
      setSelected(id);
    },
    [setSelected]
  );

  return {
    tabs: tabs as T[],
    selected,
    onTabSelected,
    setSelected,
  };
}
