import { type TAuthor } from '@core/models/Author.model';
import { Avatar } from '@libs/ui-components/Avatar';
import { useCallback, type FC } from 'react';
import styles from './AuthorsMenuItem.module.scss';
import classNames from 'classnames';
import { useArgumentSearchParams } from '../PageWidgets/ConsensusPageWidgets/useArgumentSearchParams';
import { Dot } from 'lucide-react';

export const AuthorsMenuItem: FC<{ author: TAuthor }> = ({ author }) => {
  const { name, avatar, id, email } = author;

  const { userId, setUserId } = useArgumentSearchParams();
  const isSelected = userId == id;

  const handleSelect = useCallback(() => {
    setUserId(id);
  }, [id, setUserId]);

  return (
    <button
      className={classNames('flex flex-row items-center justify-end gap-2', styles.button, {
        [styles.selected]: isSelected,
      })}
      onClick={handleSelect}
    >
      {isSelected && <Dot />}
      <span>{name || email}</span>
      <Avatar avatar={avatar} />
    </button>
  );
};
