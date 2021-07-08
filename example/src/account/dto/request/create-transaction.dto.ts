export class CreateTransactionDto {
  constructor(
    public readonly _id: string,
    public readonly value: number,
    public readonly date: Date,
  ) {}
}
