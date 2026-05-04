import type { TStepId } from '../NewOpinionWizardStepper/NewOpinionWizardStepper.models';

export type TNewOpinionTabsProps = {
  onStepStatusChanged?: (id: TStepId, isDirty: boolean) => void;
  onCancel?: () => void;
};
