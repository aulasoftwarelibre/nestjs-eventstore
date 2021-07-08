export class AccountDto {
  constructor(
    public readonly _id: string,
    public readonly title: string,
    public readonly balance: number,
  ) {}
}
