'use client';
import { useMemo, type FC, lazy, Suspense } from 'react';
import { type TStepId, type TOpinionCreationStep } from './NewOpinionWizardStepper.models';
import styles from './NewOpinionWizardStepperStep.module.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

const CheckIcon = lazy(() => import('lucide-react').then((mod) => ({ default: mod.Check })));

export const NewOpinionWizardStepperStep: FC<{
  step: TOpinionCreationStep;
  isActive: boolean;
  onClick: (step: TStepId) => void;
}> = ({ step, onClick, isActive }) => {
  const { t } = useTranslation('newOpinionPage');
  const { number, title, description, state, id } = step;

  const icon = useMemo(() => {
    switch (state) {
      case 'completed':
        return (
          <Suspense fallback={number}>
            <CheckIcon size={22} />
          </Suspense>
        );
      default:
        return number;
    }
  }, [state, number]);
  return (
    <button className={styles.stepItem} onClick={() => onClick(id)}>
      <span className={classNames(styles.stepNumber, styles[state], isActive && styles.active)}>{icon}</span>
      <div className={styles.stepContent}>
        <h3 className='truncate'>{t(title)}</h3>
        <p className='truncate'>{t(description)}</p>
      </div>
    </button>
  );
};
