export type TImageCropModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onImageCropped: (blob: Blob, url: string, base64: string) => void;
  aspectRatio?: number;
  targetWidth?: number;
  targetHeight?: number;
};
