export interface Exercise {
  id?: string;
  label: string;
  sets?: number;
  reps?: number;
  weight?: number;
}
export interface Training {
  id: string;
  title: string;
  userId: string;
  exercises: Exercise[];
}

export type FormData = Partial<Exercise>;
