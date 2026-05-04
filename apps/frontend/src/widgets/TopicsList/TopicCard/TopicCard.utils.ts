import { type TVersion } from '@core/models/Version.model';

export const getDisplayedVersion = (versions: TVersion[]): { version: TVersion | null; index: number } => {
  if (!versions?.length) {
    return { version: null, index: 0 };
  }

  const sorted = [...versions].sort((a, b) => b.reliability - a.reliability);

  const version = sorted[0];

  const index = versions.findIndex((v) => v.id === version.id) + 1;

  // Assuming the first version has highest reliability
  return { version, index };
};
