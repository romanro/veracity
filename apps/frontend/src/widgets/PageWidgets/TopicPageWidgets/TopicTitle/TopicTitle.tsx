'use client';
import React from 'react';
import { type FC } from 'react';
import { type TTopicTitleProps } from './TopicTitle.models';
import { getPluralForm } from '@/libs/utils/string/getPluralForm.util';
import { useTranslation } from 'react-i18next';
import styles from './TopicTitle.module.scss';

import Link from 'next/link';

export const TopicTitle: FC<TTopicTitleProps> = ({
  title,
  topicId,
  locale,
  versionsCount,
  topicPositionCenter = false,
}) => {
  const topicHref = `/${locale}/topics/${topicId}`;
  const { t } = useTranslation('topicVersion');

  return (
    <div className={styles.topicContainer}>
      <Link className={styles.topicLink} href={topicHref}>

        <h2 className={(styles.topicTextName, topicPositionCenter ? styles.topicTextNameCenter : undefined)}>
          {t('topic')}
        </h2>

       

        <h2 className={styles.topicTextTitle}>{title}</h2>
      </Link>
      <h6 className={styles.topicTextVersions}>
        {getPluralForm({ single: t('version'), multi: t('versions'), count: versionsCount })}
      </h6>
    </div>
  );
};
