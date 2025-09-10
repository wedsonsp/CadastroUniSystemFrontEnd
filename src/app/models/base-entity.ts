export abstract class BaseEntity<TId> {
  id!: TId;
  deleted: boolean = false;
  createdBy?: number;
  createdAt?: Date;
  updatedBy?: number;
  updatedAt?: Date;
}



