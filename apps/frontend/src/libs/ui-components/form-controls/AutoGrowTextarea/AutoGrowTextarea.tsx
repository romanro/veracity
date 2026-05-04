import { useRef, type FC, type TextareaHTMLAttributes, type RefObject } from 'react';
import styles from './AutoGrowTextarea.module.scss';
import classNames from 'classnames';

type AutoGrowTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  inputRef?: RefObject<HTMLTextAreaElement | null>;
};

export const AutoGrowTextarea: FC<AutoGrowTextareaProps> = ({ inputRef, className, ...props }) => {
  const localRef = useRef<HTMLTextAreaElement>(null);
  const refToUse = inputRef ?? localRef;

  const onInput = () => {
    const el = refToUse.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  return (
    <textarea
      ref={refToUse}
      onInput={onInput}
      className={classNames(styles.textArea, className)}
      rows={1}
      style={{ overflow: 'hidden', resize: 'none' }}
      {...props}
    />
  );
};
