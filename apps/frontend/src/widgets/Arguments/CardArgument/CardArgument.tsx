import { type FC } from 'react';
import styles from './CardArgument.module.scss';
import classNames from 'classnames';
import { type TCardArgumentProps } from './CardArgument.models';
import { Avatar } from '@/libs/ui-components/Avatar';
import { ArgumentButtonImg } from '@/libs/ui-components/Buttons/ArgumentButtonImg';
import { ArgumentLineButton } from '@/libs/ui-components/Buttons/ArgumentLineButton';
import { lineaVertical } from '../../../core/constants/uiContent';

export const CardArgument: FC<TCardArgumentProps> = ({
  className,
  item,
  connection,
  onContextMenu,
  showContextMenu,
}) => {
  return (
    <div className={classNames(styles.cardArgument, className)}>
      <div className='flex flex-row'>
        <div className='flex min-w-5 flex-col items-center pt-0'>
          <Avatar avatar={item.author?.avatar} alt={item.author?.name} className={styles.ava} />

          {!!connection && <div className={lineaVertical}> </div>}
        </div>
        <div className='ml-1 flex flex-col pl-1'>
          <ArgumentButtonImg item={item} />
          <ArgumentLineButton item={item} onContextMenu={onContextMenu} showContextMenu={showContextMenu} />
        </div>
      </div>
    </div>
  );
};
