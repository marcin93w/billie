export class InitializeLedgerCommand {
  constructor(
    public readonly userId: string,
    public readonly threadId: string,
  ) {}
}
