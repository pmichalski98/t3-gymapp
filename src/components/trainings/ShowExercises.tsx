import { GoTrashcan } from "react-icons/go";
import { type Exercise } from "@prisma/client";
import { type FC } from "react";
interface ShowExercisesProps {
  exercises: Pick<Exercise, "label">[];
  onDelete?: (index: number) => void;
}
export const ShowExercises: FC<ShowExercisesProps> = ({
  exercises,
  onDelete,
}) => {
  return (
    <>
      {exercises.map((exercise, index) => (
        <p key={index} className="flex items-center gap-2">
          {index + 1} {exercise.label}
          {onDelete && (
            <GoTrashcan
              className="cursor-pointer"
              onClick={() => onDelete(index)}
            />
          )}
        </p>
      ))}
    </>
  );
};
