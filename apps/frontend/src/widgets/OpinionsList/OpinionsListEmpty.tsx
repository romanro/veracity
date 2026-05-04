'use client';

import { useTranslation } from 'react-i18next';
import { Card } from '@libs/ui-components/Card';
import { EmptyList } from '@libs/ui-components/EmptyList';

export const OpinionsListEmpty = () => {
  const { t } = useTranslation('argumentPage');

  return (
    <Card>
      <EmptyList title={t('noArgumentsAdded')} />
    </Card>
  );
};
