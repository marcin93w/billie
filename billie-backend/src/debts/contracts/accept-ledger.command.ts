export class AcceptLedgerCommand {
  constructor(
    public readonly userId: string,
    public readonly threadId: string,
  ) {}
}
