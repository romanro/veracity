import { useState, type FC } from 'react';
import type { TTextLeafProps } from '../NodeComponents.models';
import styles from './TextLeaf.module.scss';
import classNames from 'classnames';
import { NodeEditBar } from '../../../../NewOpinionArgumentsList/NodeEditBar/NodeEditBar';
import { getOptionsByType } from '../HeadingNode/NodeTypeOption';
import { useNodeTools } from '../../useNodeTools';
import { BaseEditableNode } from '../BaseEditableNode/BaseEditableNode';
import { ArgumentCardImage } from '@/widgets/PageWidgets/ArgumentPageWidgets/ArgumentCardImage';

export const TextLeaf: FC<TTextLeafProps> = ({
  node,
  hasParent,
  removeNode,
  updateNode,
  editingNode,
  setEditingNode,
  isEditing = false,
}) => {
  const { inEditState, setNodeEditable, inputRef, value, setValue, onCancel, onTypeChanged, onDelete } = useNodeTools({
    node,
    editingNode,
    updateNode,
    setEditingNode,
    removeNode,
  });

  const { type, title, imageUrl, imgFile, path } = node;
  const [tempImgFile, setTempImgFile] = useState<string | null>(imgFile || null);

  const handleImageCropped = (_blob: Blob, _url: string, base64: string) => {
    setTempImgFile(base64);
  };

  const handleImageRemove = () => {
    setTempImgFile(null);
  };

  const handleSave = () => {
    updateNode(path, (n) => ({ ...n, title: value, imgFile: tempImgFile || undefined }));
    setEditingNode?.(null);
  };

  const handleCancel = () => {
    setTempImgFile(imgFile || null);
    onCancel();
  };

  return (
    <BaseEditableNode
      node={node}
      isEditing={isEditing}
      inEditState={inEditState}
      setNodeEditable={setNodeEditable}
      showDragHandle={true}
      showLine={hasParent}
      className={styles.textLeaf}
    >
      {inEditState ? (
        <>
          <textarea
            ref={inputRef}
            className={classNames(styles.textarea, styles.text)}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
          />
          {tempImgFile && (
            <div className={styles.imagePreview}>
              <ArgumentCardImage imagePreview={tempImgFile} />
            </div>
          )}
        </>
      ) : (
        <>
          <p className={styles.text}>{title}</p>
            {(imgFile || imageUrl) && (
            <div className={styles.imagePreview}>
                <ArgumentCardImage imagePreview={(imgFile || imageUrl)!} />
            </div>
          )}
        </>
      )}
      {inEditState && (
        <NodeEditBar
          type={type}
          options={getOptionsByType(type)}
          isValid={value?.length > 10}
          canBeDeleted={true}
          onTypeChanged={onTypeChanged}
          onCancel={handleCancel}
          onSave={handleSave}
          onDelete={onDelete}
          enableImageUpload={true}
          imagePreview={tempImgFile}
          onImageCropped={handleImageCropped}
          onImageRemove={handleImageRemove}
        />
      )}
    </BaseEditableNode>
  );
};
