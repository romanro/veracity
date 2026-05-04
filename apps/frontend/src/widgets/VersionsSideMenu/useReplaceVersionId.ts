'use client';

import { useRouter, usePathname } from 'next/navigation';

export const useReplaceVersionId = () => {
  const router = useRouter();
  const pathname = usePathname();

  const replaceVersionId = (newVersionId: string) => {
    // Match and replace versionId in the path
    const newPath = pathname.replace(/\/versions\/[^/]+/, `/versions/${newVersionId}`);
    router.push(newPath); // or `replace(newPath)` if you don't want history entry
  };

  return replaceVersionId;
};

export const useGotoVersionRoute = () => {
  const router = useRouter();
  const pathname = usePathname();

  const goToVersion = (newVersionId: string, subPath?: string) => {
    const newPath = pathname.replace(
      /\/versions\/[^/]+(?:\/[^/]*)?/,
      `/versions/${newVersionId}${subPath ? `/${subPath}` : ''}`
    );

    router.push(newPath);
  };

  return goToVersion;
};
