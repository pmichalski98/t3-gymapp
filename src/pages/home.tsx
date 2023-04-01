import { type NextPage } from "next";

import { api, type RouterOutputs } from "~/utils/api";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import ContentLayout from "~/components/ContentLayout";
import Button from "~/components/Button";
import ButtonStyleWrapper from "~/components/ButtonStyleWrapper";
import React, { type ChangeEvent, DOMElement, useState } from "react";
import { type Exercise, type Training } from "@prisma/client";
import Input from "~/components/Input";
import { GiCancel } from "react-icons/gi";

const Home: NextPage = () => {
  const { data, isLoading, error } = api.trainings.getAll.useQuery();
  const [isAdding, setIsAdding] = useState(false);
  if (error) return <div>Something went wrong...</div>;

  //auto-cols-fr
  return (
    <ContentLayout>
      {isLoading ? (
        <ClipLoader size={150} color="cyan" className="mx-auto mt-20" />
      ) : (
        <>
          <h1 className="text-3xl">Choose training:</h1>
          <div className="">{data && <TrainingList data={data} />}</div>
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
export function TrainingList({
  data,
}: {
  data: RouterOutputs["trainings"]["getAll"];
}) {
  const utils = api.useContext();
  const { mutate: deleteTraining, isLoading: deleteLoading } =
    api.trainings.deleteByid.useMutation({
      onSuccess: async () => {
        await utils.trainings.invalidate();
        toast("Training deleted", { type: "success" });
      },
    });
  const [expandedIndex, setExpandedIndex] = useState(NaN);
  const handleTrainingClick = (index: number) =>
    index === expandedIndex ? setExpandedIndex(NaN) : setExpandedIndex(index);
  const renderedTrainings = data.map((training, index) => {
    return (
      <div key={training.id}>
        <div
          onClick={() => handleTrainingClick(index)}
          className="text-backgroundBlue
          focus:outline-cyan border-cyan my-4 flex basis-1/3
                    cursor-pointer justify-center rounded bg-gradient-to-r from-darkOcean
                    to-lightCyan py-4 px-3 text-6xl text-white
                    outline-none transition hover:text-bg hover:outline-slate-400"
        >
          {training.label}
        </div>
        {expandedIndex === index && (
          <div className="flex justify-around pb-4">
            <Button
              onClick={() => deleteTraining(training.id)}
              variant="success"
              disabled={deleteLoading}
            >
              Usuń
            </Button>
            <Button variant="success">
              <Link
                href={{
                  pathname: "/home/[id]",
                  query: { id: training.id },
                }}
              >
                Rozpocznij
              </Link>
            </Button>
          </div>
        )}
      </div>
    );
  });
  return <>{renderedTrainings}</>;
}
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
      <GiCancel
        className="relative bottom-4 h-6 w-6"
        onClick={() => closeWindow(false)}
      >
        Cancel
      </GiCancel>
      <div className="pb-8">
        <Input
          className="my-2 mx-auto block max-w-sm text-xl"
          onChange={trainingOnChange}
          type="text"
          value={trainingName}
          placeholder="Nazwa treningu"
          required
        />
        <Input
          className="my-2 mt-4 max-w-xs text-sm"
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
        <form className=" text-center" onSubmit={handleAddTraining}>
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
import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";
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
