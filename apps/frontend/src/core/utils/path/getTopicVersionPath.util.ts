export function getTopicVersionPath({
  locale,
  topicId,
  versionId,
  authorId,
}: {
  locale: string;
  topicId?: string | number;
  versionId?: string | number;
  authorId?: string | number;
}): string {
  const parts = [locale];

  if (topicId) {
    parts.push('topics', String(topicId));
  }

  if (versionId) {
    parts.push('versions', String(versionId));

    if (authorId) {
      parts.push(`consensus?userId=${String(authorId)}`);
    } else {
      parts.push('consensus');
    }
  }

  return '/' + parts.join('/');
}

export function getNewOpinionPath({
  locale,
  topicId,
  versionId,
}: {
  locale: string;
  topicId?: string | number;
  versionId?: string | number;
}): string {
  const parts = [locale];

  if (topicId) {
    parts.push('topics', String(topicId));
  }

  if (versionId) {
    parts.push('versions', String(versionId));
  }

  return '/' + parts.join('/') + '/new-opinion';
}
