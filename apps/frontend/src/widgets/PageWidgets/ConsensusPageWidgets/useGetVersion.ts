import { VersionsApi } from '@core/api/apis/Version.api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

type TUseGeVersionParams = { versionId?: string; locale?: string };

export const useGetVersion = ({ versionId, locale }: TUseGeVersionParams) => {
  return useQuery({
    queryKey: ['version', versionId, locale],
    queryFn: () => VersionsApi.getById(versionId),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
    enabled: Boolean(versionId),
  });
};
