export type Tag = "work" | "personal" | "urgent" | "goal";

export interface Task {
  id: number;
  name: string;
  tag: Tag;
  time: string;
  date: string;
  done: boolean;
}
