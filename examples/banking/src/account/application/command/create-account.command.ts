import { ICommand } from '@nestjs/cqrs'

export class CreateAccountCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly title: string,
  ) {}
}
