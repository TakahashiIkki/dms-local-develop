import { UserId } from "../ValueObject/UserId";

export class User {
  constructor(
    public readonly userId: UserId,
    public readonly createdAt: Date
  ) {}
}
