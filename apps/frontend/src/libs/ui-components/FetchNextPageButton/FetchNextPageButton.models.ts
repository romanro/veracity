export type TFetchNextPageButtonProps = {
  isFetchingNextPage?: boolean;
  hasNextPage: boolean | undefined;
  fetchNextPage?: () => void;
};
