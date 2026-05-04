import type { FC, TextareaHTMLAttributes } from 'react';
import styles from './TextArea.module.scss';
import classNames from 'classnames';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea: FC<TextAreaProps> = ({ className, ...props }) => {
  return <textarea className={classNames(styles.textArea, className)} {...props} />;
};
