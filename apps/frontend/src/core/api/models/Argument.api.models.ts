import { type TArgument } from '@core/models/Argument.model';
import { type TVersion } from '@core/models/Version.model';
import type { TMultiResponse } from './Response.model';
import type { TPagination } from './Pagination.model';
import type { TListDocument } from '@/widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionArgumentsList/NewOpinionArgumentsList.models';

export type TArgumentMultiResponse = {
  version: TVersion | null;
  arguments: TMultiResponse<TArgument>;
};

export type TArgumentRequestParams = TArgumentSortSearchParams & {
  topicId?: string | number;
  versionId?: string | number;
  argumentId?: string | number;
  userId?: string | number;
};

export type TArgumentCreateBody = {
  title: string;
  versionId?: string | number;
  argumentId: string | number;
  asApprove: boolean;
};

export type TArgumentCreateAsProofBody = {
  asProof: boolean;
  argumentId: string | number;
  arguments: TCreateItemArgument[];
};

export type TCreateItemArgument = {
  argumentId: string | null;
  argumentText: string;
};

export type TArgumentPutBody = {
  id: string | number;
  text: string;
};

export type TArgumentSortSearchParams = Partial<TPagination> & {
  sortDirection?: 'asc' | 'desc';
  sortArgument?: 'veracity' | 'favorite' | 'create';
  search?: null | string;
};

export type TOpinionArgumentsSubmitBody = {
  versionId?: string;
  topicId?: string;
  topic?: string;
  version?: string;
  items: TListDocument['items'];
};

type TItem = { id: string | number; text: string };

export type TOpinionArgumentsSubmitResponse = {
  createdArguments?: TItem[];
  topicId?: string;
  versionId?: string;
};

export type ArgumentListItem = {type: 'argument' | 'text' | 'heading1' | 'heading2' | 'heading3'} & TArgument;

export type TOpinionArgumentsResponse = {
  version: TVersion;
  arguments: {data: ArgumentListItem[]} & TPagination;
};
