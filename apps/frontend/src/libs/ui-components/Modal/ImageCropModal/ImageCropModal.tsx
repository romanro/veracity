/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useRef, useState, type ChangeEvent, type FC } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { ModalContainer } from '../ModalContainer';
import { RoundedButton } from '../../Buttons/RoundedButton';
import { ImageUp, Loader2 } from 'lucide-react';
import type { TImageCropModalProps } from './ImageCropModal.models';
import styles from './ImageCropModal.module.scss';
import classNames from 'classnames';

export const ImageCropModal: FC<TImageCropModalProps> = ({
  isOpen,
  onClose,
  onImageCropped,
  aspectRatio = 684 / 307, // Default to 307:684 aspect ratio
  targetWidth = 684,
  targetHeight = 307,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    imgRef.current = e.currentTarget;

    // Calculate initial crop to match aspect ratio
    const imageAspectRatio = naturalWidth / naturalHeight;
    const cropAspectRatio = aspectRatio;

    let cropWidth: number;
    let cropHeight: number;

    if (imageAspectRatio > cropAspectRatio) {
      // Image is wider than target aspect ratio
      cropHeight = naturalHeight;
      cropWidth = cropHeight * cropAspectRatio;
    } else {
      // Image is taller than target aspect ratio
      cropWidth = naturalWidth;
      cropHeight = cropWidth / cropAspectRatio;
    }

    // Convert to percentage for ReactCrop
    const percentWidth = (cropWidth / naturalWidth) * 100;
    const percentHeight = (cropHeight / naturalHeight) * 100;
    const percentX = ((naturalWidth - cropWidth) / 2 / naturalWidth) * 100;
    const percentY = ((naturalHeight - cropHeight) / 2 / naturalHeight) * 100;

    setCrop({
      unit: '%',
      x: percentX,
      y: percentY,
      width: percentWidth,
      height: percentHeight,
    });
  };

  const applyCrop = async () => {
    if (!completedCrop || !imgRef.current) return;

    setIsProcessing(true);

    try {
      const image = imgRef.current;
      const canvas = document.createElement('canvas');

      // Set canvas to exact target dimensions
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Draw the cropped area and resize to exact dimensions
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        targetWidth,
        targetHeight
      );

      // Convert canvas to blob
      const base64 = canvas.toDataURL('image/jpeg', 0.8);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            onImageCropped(blob, url, base64);
            handleClose();
          }
          setIsProcessing(false);
        },
        'image/jpeg',
        0.8
      );
    } catch (error) {
      console.error('Error cropping image:', error);
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setImageSrc(null);
    setCrop(undefined);
    setCompletedCrop(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <ModalContainer isOpen={isOpen} onClose={handleClose}>
      <input ref={fileInputRef} type='file' accept='image/*' onChange={handleFileChange} className='hidden' />

      <h2 className='mb-4 text-lg font-semibold'>{imageSrc ? 'Crop Image' : 'Upload Image'}</h2>

      {!imageSrc && (
        <div
          className={classNames(styles.uploadSection, isDragging && styles.dragging)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={styles.uploadContent}>
            <ImageUp size={48} className={classNames(styles.uploadIcon, isDragging && styles.iconDragging)} />
            <p className='mb-2 text-base font-medium text-gray-700'>
              {isDragging ? 'Drop image here' : 'Drag and drop an image'}
            </p>
            <p className='mb-4 text-sm text-gray-600'>
              or click the button below. Final image will be {targetWidth}×{targetHeight}px.
            </p>
            <RoundedButton onClick={openFileDialog} className='flex'>
              <ImageUp size={20} className='mr-2' />
              Select Image
            </RoundedButton>
          </div>
        </div>
      )}

      {imageSrc && (
        <>
          <div className={styles.cropContainer}>
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              className={styles.reactCrop}
            >
              <img ref={imgRef} src={imageSrc} alt='Crop preview' onLoad={onImageLoad} className={styles.cropImage} />
            </ReactCrop>
          </div>

          {completedCrop && (
            <div className='mt-3 text-center text-sm text-gray-600'>
              Output: {targetWidth}×{targetHeight}px
            </div>
          )}

          <div className='mt-4 flex justify-end gap-2'>
            <RoundedButton variant='outlined' onClick={handleClose} disabled={isProcessing}>
              Cancel
            </RoundedButton>
            <RoundedButton
              onClick={applyCrop}
              disabled={!completedCrop || isProcessing}
              className={classNames(isProcessing && 'opacity-75')}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className='mr-2 animate-spin' />
                  Processing...
                </>
              ) : (
                'Apply Crop'
              )}
            </RoundedButton>
          </div>
        </>
      )}
    </ModalContainer>
  );
};
