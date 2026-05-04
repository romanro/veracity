export type TStepId = 'TOPIC' | 'VERSION' | 'OPINION';

export type TStepState = 'completed' | 'pending';

export type TOpinionCreationStep = {
  id: TStepId;
  number: number;
  title: string;
  description: string;
  state: TStepState;
  isDirty?: boolean;
};

export type TNewOpinionWizardStepperProps = {
  selectedStep: TStepId;
  steps: TOpinionCreationStep[];
  onStepSelected?: (step: TStepId) => void;
};
