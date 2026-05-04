import { useCallback, type FC } from 'react';
import styles from './AuthorsMenuItem.module.scss';
import classNames from 'classnames';
import { useArgumentSearchParams } from '../PageWidgets/ConsensusPageWidgets/useArgumentSearchParams';
import { Asterisk, Dot } from 'lucide-react';

export const AuthorsMenuConsensusButton: FC = () => {
  const { userId, clearUserId } = useArgumentSearchParams();
  const isSelected = !userId;

  const handleSelect = useCallback(() => {
    clearUserId();
  }, [clearUserId]);

  return (
    <button
      className={classNames('flex flex-row items-center justify-end gap-2', styles.button, {
        [styles.selected]: isSelected,
      })}
      onClick={handleSelect}
    >
      {isSelected && <Dot />}
      <span>Consensus</span>
      <Asterisk size={20} color='white' className='block rounded-full bg-(--color-purple-600)' />
    </button>
  );
};
