import { Controller, Post, Body } from '@nestjs/common';
import { InMemorySpendingLimitRepository } from '../../repositories/in-memory-spending-limit.repository';

@Controller('spending-limits')
export class SpendingLimitController {
  constructor(
    private readonly spendingLimitRepository: InMemorySpendingLimitRepository,
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
