import { SpendingLimit } from '../entities/spending-limit.entity';

export interface ISpendingLimitRepository {
  findByUserAndMonth(
    userId: string,
    month: number,
    year: number,
  ): Promise<SpendingLimit | null>;
  create(limit: Omit<SpendingLimit, 'id'>): Promise<SpendingLimit>;
  update(id: string, limit: Partial<SpendingLimit>): Promise<SpendingLimit>;
  delete(id: string): Promise<void>;
}

export const SPENDING_LIMIT_REPOSITORY = Symbol('ISpendingLimitRepository');
