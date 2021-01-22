import { Question } from "./Question";
import { User } from "./User";

export interface Quiz {
  id: number;
  creatorId: number;
  creator: User;
  name: string;
  questions: Question[];
}
