import { type TMainParamsProps } from '@/core/models/main';
import { type DehydratedState } from '@tanstack/react-query';

export type TArgumentPageContainerProps = {
  dehydratedState: DehydratedState;
  mainParams: TMainParamsProps;
};
