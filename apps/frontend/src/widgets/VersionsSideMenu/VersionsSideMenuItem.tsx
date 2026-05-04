import { type TVersion } from '@core/models/Version.model';
import classNames from 'classnames';
import { type FC } from 'react';
import styles from './VersionsSideMenu.module.scss';
import { useTranslation } from 'react-i18next';
import { useReplaceVersionId } from './useReplaceVersionId';
import { getReliability, getScoreTextColorClass } from '../VersionsList/VersionPreview/VersionScore/VersionScore.model';

export const VersionsSideMenuItem: FC<{ version: TVersion; selected: boolean }> = ({ version, selected }) => {
  const { t } = useTranslation('topicVersion');
  const { title, reliability, id } = version;
  const replaceVersionId = useReplaceVersionId();

  const handleVersionNavigation = () => {
    replaceVersionId(id);
  };

  const reliabilityValue = getReliability(reliability);

  return (
    <>
      <button
        disabled={selected}
        className={classNames(styles.button, 'text-(--color-text-secondary)', {
          [styles.selected]: selected,
        })}
        onClick={handleVersionNavigation}
      >
        {title}
      </button>
      <p className={getScoreTextColorClass(reliabilityValue)}>
        {reliabilityValue}% <span className='text-(--color-text-secondary)'>{t('reliability')}</span>
      </p>
    </>
  );
};
