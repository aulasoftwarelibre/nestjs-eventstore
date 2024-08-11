export class CreateWidthdrawalCommand {
  constructor(
    public readonly accountId: string,
    public readonly value: number,
    public readonly date: Date,
  ) {}
}
