import { type FC, type MouseEvent } from 'react';
import { Plus } from 'lucide-react';
import classNames from 'classnames';
import styles from './AddItemAfterButton.module.scss';

interface IAddItemAfterButtonProps {
  onClick: (e: MouseEvent) => void;
  disabled?: boolean;
  className?: string;
}

export const AddItemAfterButton: FC<IAddItemAfterButtonProps> = ({ onClick, disabled = false, className }) => {
  return (
    <button className={classNames(styles.toolbutton, className)} onClick={onClick} disabled={disabled} title='Add item after this'>
      <Plus size={18} />
    </button>
  );
};
