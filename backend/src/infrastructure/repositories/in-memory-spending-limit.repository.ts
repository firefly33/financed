import { Injectable } from '@nestjs/common';
import { ISpendingLimitRepository } from '../../domain/ports/spending-limit.repository.interface';
import { SpendingLimit } from '../../domain/entities/spending-limit.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class InMemorySpendingLimitRepository
  implements ISpendingLimitRepository
{
  private limits: SpendingLimit[] = [];

  async findByUserAndMonth(
    userId: string,
    month: number,
    year: number,
  ): Promise<SpendingLimit | null> {
    return (
      this.limits.find(
        (limit) =>
          limit.userId === userId &&
          limit.month === month &&
          limit.year === year,
      ) || null
    );
  }

  async create(limit: Omit<SpendingLimit, 'id'>): Promise<SpendingLimit> {
    const newLimit = new SpendingLimit(
      randomUUID(),
      limit.userId,
      limit.monthlyLimit,
      limit.month,
      limit.year,
    );
    this.limits.push(newLimit);
    return newLimit;
  }

  async update(
    id: string,
    limit: Partial<SpendingLimit>,
  ): Promise<SpendingLimit> {
    const index = this.limits.findIndex((l) => l.id === id);
    if (index === -1) {
      throw new Error('Spending limit not found');
    }
    const updated = new SpendingLimit(
      id,
      limit.userId ?? this.limits[index].userId,
      limit.monthlyLimit ?? this.limits[index].monthlyLimit,
      limit.month ?? this.limits[index].month,
      limit.year ?? this.limits[index].year,
    );
    this.limits[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.limits = this.limits.filter((limit) => limit.id !== id);
  }
}
