'use client';

import { useState } from 'react';
import React from 'react';
import { useLocaleRouter } from '@/libs/hooks/useLocaleRouter';
import styles from './ArgumentPageBottons.module.scss';
import classNames from 'classnames';
import { CardArgument } from '../CardArgument';
import type { TConfirmationItemArgumentProps } from './ConfirmacionItemArgument.models';

export const ConfirmationItemArgument: React.FC<TConfirmationItemArgumentProps> = ({
  connection = true,
  topicId,
  versionId,
  item,
}) => {
  const { pushLocalePath } = useLocaleRouter();
  const [onContextMenu, setOnContextMenu] = useState<boolean>(false);
  const showContextMenu = () => {
    setOnContextMenu(!onContextMenu);
  };

  const getPageArgumentsCommets = () => {
    pushLocalePath(`/arguments/${item.id}?topic=${topicId}&version=${versionId}`);
  };

  return (
    <button
      onClick={() => {
        getPageArgumentsCommets();
      }}
    >
      <CardArgument
        className={classNames(styles.mainBody)}
        item={item}
        connection={connection}
        onContextMenu={onContextMenu}
        showContextMenu={showContextMenu}
      />
    </button>
  );
};
