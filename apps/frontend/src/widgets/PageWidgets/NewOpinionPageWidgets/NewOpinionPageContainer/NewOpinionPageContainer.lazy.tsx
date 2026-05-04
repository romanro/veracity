import dynamic from 'next/dynamic';
import { ShimmerPlaceholder } from '@libs/ui-components/ShimmerPlaceholder';

export const NewOpinionWizardStepper = dynamic(
  () =>
    import(
      /* webpackPreload: true */ '@/widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionWizardStepper/NewOpinionWizardStepper'
    ).then((mod) => mod.NewOpinionWizardStepper),
  {
    ssr: true,
    loading: () => <ShimmerPlaceholder height={60} className='w-full max-w-[980px]' />,
  }
);

export const NewOpinionTopic = dynamic(
  () =>
    import(
      /* webpackPreload: true */ '@/widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionTabs/NewOpinionTopic'
    ).then((mod) => mod.NewOpinionTopic),
  {
    ssr: true,
    loading: () => <ShimmerPlaceholder height={300} className='!mt-4 w-full max-w-[980px]' />,
  }
);

export const NewOpinionCreationTab = dynamic(
  () =>
    import(
      /* webpackPreload: true */ '@/widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionTabs/NewOpinionCreationTab'
    ).then((mod) => mod.NewOpinionCreationTab),
  {
    ssr: true,
    loading: () => <ShimmerPlaceholder height={300} className='!mt-4 w-full' />,
  }
);

export const NewOpinionVersion = dynamic(
  () =>
    import(
      /* webpackPreload: true */ '@/widgets/PageWidgets/NewOpinionPageWidgets/NewOpinionTabs/NewOpinionVersion'
    ).then((mod) => mod.NewOpinionVersion),
  {
    ssr: true,
    loading: () => <ShimmerPlaceholder height={300} className='!mt-4 w-full max-w-[980px]' />,
  }
);

export const ModalConfirmation = dynamic(
  () =>
    import(/* webpackPreload: true */ '@libs/ui-components/Modal/ModalConfirmation').then(
      (mod) => mod.ModalConfirmation
    ),
  {
    ssr: true,
    loading: () => null,
  }
);
