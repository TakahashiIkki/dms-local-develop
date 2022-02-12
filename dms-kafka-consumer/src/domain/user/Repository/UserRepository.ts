import { User } from "../Entity/User";

export interface UserRepository {
  add(user: User): void;
}
