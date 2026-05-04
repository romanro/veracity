import { type TTopic } from '@core/models/Topic.model';
import { type TMultiResponse } from '@core/api/models/Response.model';

export type TTopicsListProps = Partial<TMultiResponse<TTopic>> & { isLoading: boolean; columns?: 1 | 2 };
