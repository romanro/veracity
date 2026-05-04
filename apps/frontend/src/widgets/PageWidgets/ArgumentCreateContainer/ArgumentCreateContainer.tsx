'use client';
import { useEffect, useState, type FC } from 'react';
import { useDispatch } from 'react-redux';
import { useArgumentSearchParams } from '../ConsensusPageWidgets/useArgumentSearchParams';
import { type ArgumentTab } from '@/widgets/OpinionsList/useInfiniteOpinions';
import { NewArgumentCreateInput } from '../ArgumentPageWidgets/NewArgumentCreateInput';
import { addArgument, delArgument, setArguments } from '@/store/argumentsSlice';
import { itemArgumentNew } from './ArgumentCreateContainer.utils';
import { ArgumentsCreateList } from '@/widgets/Arguments/ArgumentsCreateList';
import { newArgumentId } from '@/core/constants/argument';

export const ArgumentCreateContainer: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setArguments([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [currId, setCurrId] = useState<number>(11);
  const { tabId } = useArgumentSearchParams('approve');
  const [preview, setPreview] = useState<string | null>(null);

  const onEnterAddArgument = (newText: string) => {
    if (newText) {
      const newArgument = {
        ...itemArgumentNew,
        id: newArgumentId + String(currId),
        text: newText,
        imgUrl: preview ?? null,
      };
      dispatch(addArgument(newArgument));
      setCurrId(currId + 1);
      setPreview(null);
    }
  };

  const onEnterDeleteArgument = (iaArgument: string) => {
    dispatch(delArgument(iaArgument));
  };

  const onEnterCancelArgument = () => {
    setPreview(null);
  };

  return (
    <div className='mb-6'>
      <ArgumentsCreateList
        showContextMenu={() => {}}
        onContextMenu={false}
        onEnterDeleteArgument={onEnterDeleteArgument}
      />
      <NewArgumentCreateInput
        tab={tabId as ArgumentTab}
        onEnterConfirm={onEnterAddArgument}
        textNewArgument=""
        isImage={true}
        setPreview={setPreview}
        preview={preview}
        onEnterCancelArgument={onEnterCancelArgument}
      />
    </div>
  );
};
