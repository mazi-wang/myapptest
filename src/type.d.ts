declare namespace API {
  type Result<T> = {
    code: number;
    message: string;
    data: T;
  };

  type PageReq<T> = {
    current: number;
    pageSize: number;
    data?: T;
  };

  type PageRes<T> = {
    current: number;
    pageSize: number;
    total: number;
    data: T[];
  };
}

/**
 * 返回结果
 */
export type Result<T> = {
  code: number;
  message: string;
  data: T;
};

export enum SortEnum {
  ASCEND,
  DESCEND,
}

export type FilterSort<T> = {
  range: {
    min: T;
    max: T;
  };
  sort: SortEnum | undefined;
};

/**
 * 分页请求数据
 */
export type PageReq<T> = {
  current: number;
  pageSize: number;
  data?: T;
};

/**
 * 分页响应数据
 */
export type PageRes<T> = {
  current: number;
  pageSize: number;
  total: number;
  data: T[];
};

/**
 * 真假枚举
 */
export enum TrueOrFalseEnum {
  TRUE,
  FALSE,
}

export type EditConfigProps = {
  id: string | null;
  isOpen: boolean;
  isLoading: boolean;
};
