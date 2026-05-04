import { useMemo, type FC } from 'react';
import { type TInfoBlockProps } from './InfoBlock.models';
import classNames from 'classnames';
import styles from './InfoBlock.module.scss';

const BACKGROUNDS = [styles.bg_gradient_1, styles.bg_gradient_2, styles.bg_gradient_3];

export const InfoBlock: FC<TInfoBlockProps> = ({ info, background = 0 }) => {
  const { title, text, footerTitle, footerText } = info;

  const pickedBg = useMemo(() => {
    return background >= BACKGROUNDS.length ? 0 : background;
  }, [background]);

  return (
    <div className={classNames('flex flex-col justify-between gap-2', styles.block, BACKGROUNDS[pickedBg])}>
      <header>
        <h3>{title}</h3>
        <p>{text}</p>
      </header>
      <footer>
        {footerTitle && <h3>{footerTitle}</h3>}
        {footerText && <p>{footerText}</p>}
      </footer>
    </div>
  );
};
