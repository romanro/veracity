import React from 'react';

export type TTabsProps = {
  tabs: TTab[];
  onTabSelected: (id: TTab['id']) => void;
  initiallySelected?: TTab['id'];
};

export type TTab = {
  id: string | number;
  label: React.ReactElement | string;
};
