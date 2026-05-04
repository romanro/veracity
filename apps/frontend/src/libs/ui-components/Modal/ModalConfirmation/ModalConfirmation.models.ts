
export type TModalConfirmationProps = {
  headerText: string;
  bodyText: string;
  showCancelModal: boolean;
  onClose: () => void;
  handleDiscard: () => void;
  confirmBtnLabel?: string;
  cancelBtnLabel?: string;
};
