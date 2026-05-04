'use client';
import { SSRReactQueryProvider } from '@core/providers/ReactQueryProvider/SSRReactQueryProvider';
import { useEffect, useMemo, useReducer, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { type TNewOpinionPageContainerProps } from './NewOpinionPageContainer.models';
import type { TStepId } from '../NewOpinionWizardStepper/NewOpinionWizardStepper.models';
import { reducer, initialState } from './NewOpinionPageContainer.reducer';
import { useGetTopicAndVersion } from './useGetTopicAndVersion';
import { type TTopic } from '@/core/models/Topic.model';
import { type TVersion } from '@/core/models/Version.model';
import {
  ModalConfirmation,
  NewOpinionCreationTab,
  NewOpinionTopic,
  NewOpinionVersion,
  NewOpinionWizardStepper,
} from './NewOpinionPageContainer.lazy';
import { useUnsavedChangesWarning } from '@libs/hooks/useUnsavedChangesWarning';
import { getTopicVersionPath } from '@/core/utils/path/getTopicVersionPath.util';

export const NewOpinionPageContainer: FC<TNewOpinionPageContainerProps> = ({ dehydratedState, mainParams }) => {
  const { t } = useTranslation('newOpinionPage');
  const [state, dispatch] = useReducer(reducer, initialState);

  const { steps, activeStepId, topic, version } = state;

  const { serverTopic, serverVersion, isLoading } = useGetTopicAndVersion({ mainParams });

  const hasUnsavedChanges = useMemo(() => {
    return steps.some((step) => step.isDirty);
  }, [steps]);

  const { showModal, confirmNavigation, cancelNavigation, handleNavigation } =
    useUnsavedChangesWarning(hasUnsavedChanges);

  useEffect(() => {
    if (serverTopic) {
      dispatch({ type: 'SET_TOPIC', payload: { topic: serverTopic } });
    }
    if (serverVersion) {
      dispatch({ type: 'SET_VERSION', payload: { version: serverVersion } });
    }
  }, [serverTopic, serverVersion]);

  const onStepStatusChanged = (id: TStepId, isDirty: boolean) => {
    dispatch({ type: 'SET_STEP_IS_DIRTY', payload: { id, isDirty } });
  };

  const onStepSelected = (step: TStepId) => {
    dispatch({ type: 'SET_ACTIVE', payload: step });
  };

  const onTopicSelected = (topic: Partial<TTopic>, isValid: boolean) => {
    if (isValid) {
      dispatch({ type: 'SET_TOPIC', payload: { topic } });
      dispatch({ type: 'SET_ACTIVE', payload: 'VERSION' });
    }
  };

  const onVersionSelected = (version: Partial<TVersion>, isValid: boolean) => {
    if (isValid) {
      dispatch({ type: 'SET_VERSION', payload: { version } });
      dispatch({ type: 'SET_ACTIVE', payload: 'OPINION' });
    }
  };

  const onCancel = () => {
    const { locale, topicId, versionId } = mainParams;
    const href = getTopicVersionPath({ locale: locale ?? 'en', topicId, versionId });
    handleNavigation(href);
  };

  return (
    <SSRReactQueryProvider dehydratedState={dehydratedState}>
      <section className='mx-auto w-full max-w-[1750px] overflow-hidden px-8 max-h-[calc(100vh-var(--header-height))]'>
        {activeStepId === 'TOPIC' && (
          <>
            <NewOpinionTopic
              isLoading={isLoading}
              topic={topic}
              onTopicSelected={onTopicSelected}
              onStepStatusChanged={onStepStatusChanged}
              onCancel={onCancel}
            >
              <NewOpinionWizardStepper selectedStep={activeStepId} steps={steps} onStepSelected={onStepSelected} />
            </NewOpinionTopic>
          </>
        )}

        {activeStepId === 'VERSION' && (
          <>
            <NewOpinionVersion
              isLoading={isLoading}
              version={version}
              topicTitle={topic?.title}
              onVersionSelected={onVersionSelected}
              onStepStatusChanged={onStepStatusChanged}
              onCancel={onCancel}
            >
              <NewOpinionWizardStepper selectedStep={activeStepId} steps={steps} onStepSelected={onStepSelected} />
            </NewOpinionVersion>
          </>
        )}
        {activeStepId === 'OPINION' && (
          <>
            <NewOpinionCreationTab
              isLoading={isLoading}
              topic={topic}
              version={version}
              onStepStatusChanged={onStepStatusChanged}
              onCancel={onCancel}
            >
              <NewOpinionWizardStepper selectedStep={activeStepId} steps={steps} onStepSelected={onStepSelected} />
            </NewOpinionCreationTab>
          </>
        )}
      </section>
      <ModalConfirmation
        headerText={t('discardChangesTitle')}
        bodyText={t('discardChangesMessage')}
        showCancelModal={showModal}
        onClose={cancelNavigation}
        handleDiscard={confirmNavigation}
      />
    </SSRReactQueryProvider>
  );
};
