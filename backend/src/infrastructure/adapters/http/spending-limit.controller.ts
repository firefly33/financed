import { Controller, Post, Body, Inject } from '@nestjs/common';
import type { ISpendingLimitRepository } from '../../../domain/ports/spending-limit.repository.interface';
import { SPENDING_LIMIT_REPOSITORY } from '../../../domain/ports/spending-limit.repository.interface';

@Controller('spending-limits')
export class SpendingLimitController {
  constructor(
    @Inject(SPENDING_LIMIT_REPOSITORY)
    private readonly spendingLimitRepository: ISpendingLimitRepository,
  ) {}

  @Post()
  async create(
    @Body()
    createLimitDto: {
      userId: string;
      monthlyLimit: number;
      month: number;
      year: number;
    },
  ) {
    return this.spendingLimitRepository.create(createLimitDto);
  }
}
