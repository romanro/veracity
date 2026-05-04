import { Info, type LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

export const EmptyList = ({
  title,
  iconComponent: Icon = Info,
}: {
  title: string;
  iconComponent?: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
}) => {
  return (
    <div className='flex items-center justify-center gap-4 p-6 text-(--color-text-secondary)'>
      <Icon size={50} className='m-3' />
      <h2 className='text-lg'>{title}</h2>
    </div>
  );
};
