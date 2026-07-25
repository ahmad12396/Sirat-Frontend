export type ID = string;

export type Nullable<T> = T | null;

export type Timestamps = {
  createdAt: string;
  updatedAt: string;
};

export type BaseEntity = Timestamps & {
  id: ID;
};
