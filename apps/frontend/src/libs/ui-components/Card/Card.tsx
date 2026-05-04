import { type FC } from 'react';
import { type CardProps } from './Card.models';
import styles from './Card.module.scss';
import classNames from 'classnames';

export const Card: FC<CardProps> = ({ children, className, setNodeRef, attributesDrag, listenersDrag }) => {
  return (
    <div ref={setNodeRef} {...listenersDrag} {...attributesDrag} className={classNames(styles.card, className)}>
      {children}
    </div>
  );
};
