export type TPagination = { page: number; perPage: number; pages?: number; total?: number };

export type TApproveRefusePagination = {
  pageApprove: number;
  perPageAprove: number;
  pageRefuse: number;
  perPageRefuse: number;
};

export type TSearchParams = Partial<TPagination> & {
  orderBy?: null | string;
  orderDirection?: null | string;
  search?: null | string;
};
