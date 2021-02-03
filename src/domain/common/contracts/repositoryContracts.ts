export interface FindOneOptions<T> {
  relations?: string[];
  sortBy?: {
    [P in keyof T]?: "ASC" | "DESC";
  };
}

export interface FindManyOptions<T> extends FindOneOptions<T> {
  offset?: number;
  limit?: number;
}

export interface OperationResult<T> {
  operation: "create" | "find" | "update";
  entity: T;
}

export interface WhereOptions<T> {
  where: number | Partial<T>;
  options?: FindOneOptions<T>;
}

export type FindInWhere<T> = {
  [P in keyof T]?: Array<T[P]>;
};

export interface ListAndCount<T> {
  list: T[];
  count: number;
}

export interface BasicWrite<T> {
  create(params: T): Promise<T>;
  create(params: T[]): Promise<T[]>;
  update(id: number, params: Partial<T>): Promise<T>;
  remove(id: number | number[]): Promise<void>;
  remove(where: Partial<T>): Promise<void>;
}

export interface BasicRead<T> {
  find(where?: Partial<T>, options?: FindManyOptions<T>): Promise<T[]>;
  findOne(where?: Partial<T>, options?: FindOneOptions<T>): Promise<T>;
  findById(id: number, options?: FindOneOptions<T>): Promise<T>;
  findByIds(id: number[], options?: FindManyOptions<T>): Promise<T[]>;
  count(where?: Partial<T>): Promise<number>;
}

export interface ExtendedWrite<T> {
  findOneOrCreate(
    condition: WhereOptions<T>,
    params: T,
  ): Promise<OperationResult<T>>;
  upsert(condition: WhereOptions<T>, params: T): Promise<OperationResult<T>>;
  dropRow(id: number | number[]): Promise<void>;
  dropRow(where: Partial<T>): Promise<void>;
  flush(): Promise<void>;
}

export interface ExtendedRead<T> {
  findIn(where: FindInWhere<T>, options?: FindManyOptions<T>): Promise<T[]>;
  findLike(where: Partial<T>, options?: FindManyOptions<T>): Promise<T[]>;
  findOneOrThrow(where: Partial<T>, options?: FindOneOptions<T>): Promise<T>;
  findAndCount(
    where?: Partial<T>,
    options?: FindManyOptions<T>,
  ): Promise<ListAndCount<T>>;
  isUnique(where: Partial<T>, options?: FindOneOptions<T>): Promise<boolean>;
  isUniqueOrThrow(
    where: Partial<T>,
    options?: FindOneOptions<T>,
  ): Promise<boolean>;
}

export interface Repository<T>
  extends BasicWrite<T>,
    BasicRead<T>,
    ExtendedWrite<T>,
    ExtendedRead<T> {}

export interface RepositoryCreateUniqueOrThrow<T> {
  createUniqueOrThrow(payload: T): Promise<T>;
}
