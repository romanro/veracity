export type TNodeType = 'text' | 'argument' | 'heading1' | 'heading2' | 'heading3';

type TBaseArgumentTreeNode = {
  id: string;
  path: string;
  type: TNodeType;
};

// Types of Leafs
export type TTextLeaf = TBaseArgumentTreeNode & {
  type: 'text';
  title: string; // editable
  imageUrl?: string; // optional image (remote URL)
  imgFile?: string; // optional image (base64 data URI for locally uploaded files)
};

import type { TArgument } from '@core/models/Argument.model';

export type TArgumentLeaf = TBaseArgumentTreeNode & {
  type: 'argument';
  originalArgumentId?: string;
  originalArgument?: TArgument;
};

export type TLeaf = TTextLeaf | TArgumentLeaf;

// Headings
export type THeading1 = TBaseArgumentTreeNode & {
  type: 'heading1';
  title: string;
  children: (THeading2 | TLeaf)[];
};

export type THeading2 = TBaseArgumentTreeNode & {
  type: 'heading2';
  title: string;
  children: (THeading3 | TLeaf)[];
};

export type THeading3 = TBaseArgumentTreeNode & {
  type: 'heading3';
  title: string;
  children: (THeading4 | TLeaf)[];
};

export type THeading4 = TBaseArgumentTreeNode & {
  type: 'heading4';
  title: string;
  children: (THeading5 | TLeaf)[];
};

export type THeading5 = TBaseArgumentTreeNode & {
  type: 'heading5';
  title: string;
  children: TLeaf[];
};

export type THeadingNode = THeading1 | THeading2 | THeading3 | THeading4 | THeading5;

// Root type
export type TDocumentRoot = {
  id?: 'root';
  type: 'root';
  path: 'root';
  children: (THeading1 | TLeaf)[];
};

// Generic Node Type
export type TNode = TDocumentRoot | THeadingNode | TLeaf;
