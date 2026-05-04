import React from 'react';
import { IndicatorItem } from './IndicatorItem';
import cls from './style.module.scss';

type TIndicator = {
  active: number;
};

export const Indicator = (props: TIndicator) => {
  const { active } = props;
  const colorActive = Math.round(76 * active);

  const indicatorItem = Array.from({ length: 76 }, (v, i) => i + 1);

  return (
    <div className={`${cls['indicator']}`}>
      {indicatorItem.map((indicator, index) => {
        return (
          <IndicatorItem
            key={index}
            classNameString={`
        ${
          index < 58
            ? index <= colorActive
              ? cls['color-red-active']
              : cls['color-red']
            : index <= colorActive
              ? cls['color-green-active']
              : cls['color-green']
        }
        ${cls['flex-grow']}  
      `}
          />
        );
      })}
    </div>
  );
};
