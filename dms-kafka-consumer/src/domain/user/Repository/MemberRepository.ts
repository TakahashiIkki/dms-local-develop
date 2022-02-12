import { Member } from "../Entity/Member";

export interface MemberRepository {
  add(member: Member): void;
}
