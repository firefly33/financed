export class Expense {
  constructor(
    public readonly id: string,
    public readonly amount: number,
    public readonly description: string,
    public readonly category: string,
    public readonly date: Date,
    public readonly userId: string,
  ) {}
}
