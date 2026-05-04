'use client';
import { RoundedButton } from '@libs/ui-components/Buttons/RoundedButton';
import { InfoBlock } from '@libs/ui-components/InfoBlock';
import { useState, useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';

export const HomePageInfoBlocks: FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const { t } = useTranslation('mainPage');

  // Load from localStorage after hydration to avoid mismatch
  useEffect(() => {
    try {
      const stored = localStorage.getItem('infoBlocksCollapsed');
      if (stored !== null) setCollapsed(JSON.parse(stored));
    } catch {
      console.warn('Error parsing infoBlocksCollapsed from localStorage');
    }
  }, []);



  // Save to localStorage whenever collapsed changes
  useEffect(() => {
    try {
      localStorage.setItem('infoBlocksCollapsed', JSON.stringify(collapsed));
    } catch (error) {
      console.warn('Error saving infoBlocksCollapsed to localStorage', error);
    }
  }, [collapsed]);

  const raw = t('infoBlocks', { returnObjects: true }) as unknown;

  const infoEntries =
    raw && typeof raw === 'object' && !Array.isArray(raw)
      ? Object.entries(raw as Record<string, any>)
      : [];

  return (
    <section className="w-full px-4 py-8">
      <div
        className={`flex-center overflow-hidden transition-[max-height] duration-300 ease-in-out ${collapsed ? 'max-h-0' : 'max-h-[2000px]'
          }`}
      >
        <ul suppressHydrationWarning className="flex gap-4 overflow-x-auto pb-2 lg:mx-auto lg:grid lg:max-w-[1024px] lg:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lg:justify-center lg:gap-4 lg:overflow-x-visible lg:px-4 lg:py-8">
          {infoEntries.map(([id, info], index) => (
            <li key={id} className="max-w-[320px] min-w-[280px] shrink-0 lg:mx-auto lg:w-full lg:min-w-0">
              <InfoBlock id={id} info={info} background={index} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex justify-center">
        <RoundedButton onClick={() => setCollapsed((v) => !v)} variant="secondary">
          {collapsed ? t('showBlock') : t('hideBlock')}
        </RoundedButton>
      </div>
    </section>
  );
};
