import type { FC } from 'react';
import type { TButtonProps } from '../Buttons.models';
import type { LucideIcon } from 'lucide-react';
import classNames from 'classnames';

type TIconButtonProps = TButtonProps & { icon: LucideIcon };

export const IconButton: FC<TIconButtonProps> = ({ icon: Icon, className = '', ...props }) => {
  return (
    <button className={classNames('m-0 border-none p-0 text-(--color-ghost-text)', className)} {...props}>
      <Icon size={20} />
    </button>
  );
};
