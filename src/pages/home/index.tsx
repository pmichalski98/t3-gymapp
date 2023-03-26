import { type NextPage } from "next";

import { api } from "~/utils/api";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import ContentLayout from "~/components/ContentLayout";
import Button from "~/components/Button";
import ButtonStyleWrapper from "~/components/ButtonStyleWrapper";
import { type ChangeEvent, useState } from "react";
import { type Exercise } from "@prisma/client";
import Input from "~/components/Input";

const Home: NextPage = () => {
  const { data, isLoading, error } = api.trainings.getAll.useQuery();
  const [isAdding, setIsAdding] = useState(false);

  if (error) return <div>Something went wrong ...</div>;

  //auto-cols-fr
  return (
    <ContentLayout>
      {isLoading ? (
        <ClipLoader size={150} color="cyan" className="mx-auto mt-20" />
      ) : (
        <>
          <h1 className="text-3xl">Choose training:</h1>
          <div className="flex-wrap justify-center py-4 md:flex ">
            {data &&
              data.map((training) => (
                <ButtonStyleWrapper
                  className="my-4 py-10 text-6xl md:mx-4 md:basis-1/3 "
                  key={training.id}
                >
                  <Link
                    href={{
                      pathname: "/home/[id]",
                      query: { id: training.id },
                    }}
                  >
                    {training.label}
                  </Link>
                </ButtonStyleWrapper>
              ))}
          </div>
          <Button
            onClick={() => setIsAdding(!isAdding)}
            variant="secondary"
            className="mx-auto"
          >
            Add Training +
          </Button>
          {isAdding && <AddTraining closeWindow={setIsAdding} />}
          <h3 className="pt-20">Some training history there : </h3>
        </>
      )}
    </ContentLayout>
  );
};

export default Home;
export function AddTraining({
  closeWindow,
}: {
  closeWindow: (value: boolean) => void;
}) {
  const [exercises, setExercises] = useState<Pick<Exercise, "label">[]>([]);
  const [exerciseName, setExerciseName] = useState("");
  const [trainingName, setTrainingName] = useState("");
  const utils = api.useContext();
  const { mutate } = api.trainings.addTraining.useMutation({
    onSuccess: async () => {
      await utils.trainings.getAll.invalidate();
      toast.success("Training added successfully");
    },
  });

  function exerciseOnChange(event: ChangeEvent<HTMLInputElement>) {
    setExerciseName(event.target.value);
  }
  function trainingOnChange(event: ChangeEvent<HTMLInputElement>) {
    setTrainingName(event.target.value);
  }
  function handleAddingExercise() {
    setExercises([
      ...exercises,
      {
        label: exerciseName,
      },
    ]);
    setExerciseName("");
  }

  function handleAddTraining(event: ChangeEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate({ label: trainingName, exercises });
    closeWindow(false);
  }
  function handleExerciseDelete(index: number) {
    const exercisesAfterDelete = [...exercises];

    exercisesAfterDelete.splice(index, 1);
    setExercises(exercisesAfterDelete);
  }
  return (
    <div className="mx-auto mt-6 max-w-4xl rounded border-4 border-darkCyan p-8 text-center">
      <div className="pb-8">
        <Input
          className="my-2 mx-auto block max-w-sm text-3xl"
          onChange={trainingOnChange}
          type="text"
          value={trainingName}
          placeholder="Nazwa treningu"
          required
        />
        <Input
          className="my-2 mt-4 max-w-xs"
          onChange={exerciseOnChange}
          type="text"
          value={exerciseName}
          placeholder="Nazwa cwiczenia"
          required
        />
        <Button
          onClick={handleAddingExercise}
          className="mx-auto mt-4"
          variant="primary"
          rounded
        >
          Add exercise
        </Button>
      </div>
      {exercises.length > 0 && (
        <form className="mt-10   text-center" onSubmit={handleAddTraining}>
          <div className="flex flex-col items-center ">
            <ShowExercises
              exercises={exercises}
              onDelete={handleExerciseDelete}
            />
          </div>
          <Button
            type="submit"
            variant="success"
            rounded
            className="mx-auto mt-4 text-xl"
          >
            Create training
          </Button>
        </form>
      )}
    </div>
  );
}

import { GoTrashcan } from "react-icons/go";
import { toast } from "react-toastify";
interface Props {
  exercises: Pick<Exercise, "label">[];
  onDelete?: (index: number) => void;
}
export function ShowExercises({ exercises, onDelete }: Props) {
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
}
