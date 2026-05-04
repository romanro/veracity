import Link from 'next/link';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { type TVersionShortSummaryProps } from './VersionShortSummary.models';
import styles from './VersionShortSummary.module.scss';
import { useLocaleRouter } from '@libs/hooks/useLocaleRouter';
import { getReliability } from '../VersionsList/VersionPreview/VersionScore/VersionScore.model';

const getReliabilityColor = (value: number) => {
  if (value <= 0) return styles.reliabilityGray;
  if (value <= 66) return styles.reliabilityOrange;
  return styles.reliabilitySuccess;
};

export const VersionShortSummary: FC<TVersionShortSummaryProps> = ({ version, index, topicId }) => {
  const { t } = useTranslation('topicVersion');
  const { getLocalizedPath } = useLocaleRouter();

  if (!version) {
    return null;
  }

  const { id, reliability, title } = version;

  const href = getLocalizedPath(topicId ? `/topics/${topicId}/versions/${id}/consensus` : `/versions/${id}/consensus`);

  const reliabilityValue = getReliability(reliability);
  const reliabilityColor = getReliabilityColor(reliabilityValue);

  return (
    <Link href={href}>
      <article className={styles.summary}>
        <h6 className='flex items-center'>
          <span>
            {t('version')} #{index} • {t('reliability')}{' '}
          </span>
          <span className={`${reliabilityColor} pl-1`}>{` ${reliabilityValue}%`}</span>
        </h6>
        <p>{title}</p>
      </article>
    </Link>
  );
};
