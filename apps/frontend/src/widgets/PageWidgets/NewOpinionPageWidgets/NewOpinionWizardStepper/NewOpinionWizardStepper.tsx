'use client';
import { type FC } from 'react';
import { type TStepId, type TNewOpinionWizardStepperProps } from './NewOpinionWizardStepper.models';
import { NewOpinionWizardStepperStep } from './NewOpinionWizardStepperStep';

export const NewOpinionWizardStepper: FC<TNewOpinionWizardStepperProps> = ({ steps, selectedStep, onStepSelected }) => {
  const selectStep = (id: TStepId) => {
    onStepSelected?.(id);
  };

  return (
    <ul className='mx-auto grid max-w-[980px] grid-cols-3 gap-4'>
      {steps.map((step) => (
        <li key={step.id}>
          <NewOpinionWizardStepperStep step={step} onClick={selectStep} isActive={step.id === selectedStep} />
        </li>
      ))}
    </ul>
  );
};
