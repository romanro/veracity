'use client';

import React from 'react';
import cls from './style.module.scss';

type IndicatorItem = {
  classNameString: string;
};

export const IndicatorItem = (props: IndicatorItem) => {
  const { classNameString } = props;
  return <div className={`${cls['item']} ${classNameString}`}></div>;
};
