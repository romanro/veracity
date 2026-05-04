export type TArgumentPageBottonsProps = {
  buttonText: string;
  onPublishButton: boolean;
  onClickPublish: () => void;
  onClickChangeRefuting: () => void;
  setShowCancelModal: (show: boolean) => void;
  showChangeToRefuteButton: boolean;
  isLoading?: boolean;
};
