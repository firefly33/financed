export class SpendingLimit {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly monthlyLimit: number,
    public readonly month: number,
    public readonly year: number,
  ) {}
}
