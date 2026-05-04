import { type FC } from 'react';
import styles from './CardArgumentCreate.module.scss';
import classNames from 'classnames';
import { Card } from '@/libs/ui-components/Card';
import { AuthorTitle } from '@/widgets/ArgumentConfirmacionWidgets/AuthorTitle';
import { type TCardArgumentCreateProps } from './CardArgumentCreate.models';
import { useUser } from '@clerk/nextjs';
import { blockRounded } from '../../../core/constants/uiContent';
import { ArgumentCardImage } from '../../PageWidgets/ArgumentPageWidgets/ArgumentCardImage';
import { NodeEditBar } from '../../PageWidgets/NewOpinionPageWidgets/NewOpinionArgumentsList/NodeEditBar/NodeEditBar';

export const CardArgumentCreate: FC<TCardArgumentCreateProps> = ({ className, item, onEnterDeleteArgument }) => {
  const { user } = useUser();
  const { imageUrl, fullName } = user ?? {};

  const onDelete = () => {
    if (onEnterDeleteArgument) {
      onEnterDeleteArgument(item.id);
    }
  };
  return (
    <Card className={classNames(styles.cardArgumentCreate, className, blockRounded)}>
      <AuthorTitle avatar={imageUrl as string} nameFull={fullName as string} />
      <p className='text-justifyfont-normal text-btn-1 mb-4 max-w-[1100px] text-justify text-base text-wrap'>
        {item.text}
      </p>
      {item.imgUrl && <ArgumentCardImage imagePreview={item.imgUrl} />}
      <div className={classNames(styles.lineaButton)}>
        <NodeEditBar
          options={[]}
          isValid={true}
          canBeDeleted={true}
          onTypeChanged={() => {}}
          onCancel={() => {}}
          onSave={() => {}}
          onDelete={onDelete}
        />
      </div>
    </Card>
  );
};
