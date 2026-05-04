import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { getReliability, getScoreColorClasses } from './VersionScore.model';

export const VersionScore: FC<{ reliability: number; className?: string }> = ({ reliability, className }) => {
  const { t } = useTranslation('topicVersion');

  const reliabilityValue = getReliability(reliability);

  return (
    <div
      className={twMerge(
        'flex flex-col justify-between items-center rounded-xl px-6 py-4 min-w-[150px] self-stretch',
        getScoreColorClasses(reliabilityValue),
        className
      )}
    >
      <h3 className="flex flex-col justify-start -mt-8 font-light text-[2.875rem] leading-[2.875] [font-family:var(--font-percents)]">
        {`${reliabilityValue}%`}
      </h3>
      <h4 className="text-sm font-medium leading-normal uppercase [font-family:var(--font-body)]"></h4>
      <h4 className="text-sm font-medium leading-normal uppercase [font-family:var(--font-body)]">{t('reliability')}</h4>
    </div>
  );
};
