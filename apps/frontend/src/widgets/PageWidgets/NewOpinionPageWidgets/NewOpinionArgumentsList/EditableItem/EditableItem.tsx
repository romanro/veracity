import { type FC } from 'react';
import { isTextItem, isHeadingItem } from '../NewOpinionArgumentsList.utils';
import { BaseEditableItem } from '../BaseEditableItem/BaseEditableItem';
import { NodeEditBar } from '../NodeEditBar/NodeEditBar';
import { EditableItemContent } from './EditableItemContent';
import { useEditableItemLogic } from './useEditableItemLogic';
import { editModeTypeOptions, isItemTextValid } from '../ItemRenderer/ItemTypeOptions';
import type { TEditableItemProps } from './EditableItem.models';

export const EditableItem: FC<TEditableItemProps> = (props) => {
  const { item, isAnyItemEditing, showTypeSelect, showLine } = props;

  const {
    inputRef,
    value,
    setValue,
    tempImgFile,
    inEditState,
    setItemEditable,
    handleImageCropped,
    handleImageRemove,
    onSave,
    onCancel,
    onDelete,
    onTypeChanged,
    onAddItemClick,
  } = useEditableItemLogic(props);


  return (
    <BaseEditableItem
      item={item}
      isEditing={isAnyItemEditing}
      inEditState={inEditState}
      setItemEditable={setItemEditable}
      showDragHandle={true}
      showAuthorHeader={!isHeadingItem(item)}
      showLine={showLine}
      onAddItemClick={onAddItemClick}
      isAnyItemEditing={isAnyItemEditing}
    >
      <EditableItemContent
        item={item}
        inEditState={inEditState}
        value={value}
        setValue={setValue}
        tempImgFile={tempImgFile}
        inputRef={inputRef}
      />

      {inEditState && (
        <NodeEditBar
          type={item.type}
          options={editModeTypeOptions}
          isValid={isItemTextValid(value)}
          canBeDeleted={true}
          showTypeSelect={showTypeSelect}
          onTypeChanged={onTypeChanged}
          onCancel={onCancel}
          onSave={onSave}
          onDelete={onDelete}
          enableImageUpload={isTextItem(item)}
          imagePreview={isTextItem(item) ? tempImgFile : null}
          onImageCropped={handleImageCropped}
          onImageRemove={handleImageRemove}
        />
      )}
    </BaseEditableItem>
  );
};
