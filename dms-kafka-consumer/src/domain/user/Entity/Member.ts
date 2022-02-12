import { UserId } from "../ValueObject/UserId";

export class Member {
  constructor(public readonly userId: UserId, public readonly name: string) {}
}
