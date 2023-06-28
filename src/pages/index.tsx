import { type NextPage } from "next";

import { api, type RouterOutputs } from "~/utils/api";
import { ClipLoader } from "react-spinners";
import Button from "~/components/Button";
import React, { type ChangeEvent, useState } from "react";
import { type Exercise } from "@prisma/client";
import Input from "~/components/Input";
import { GiCancel } from "react-icons/gi";
import { ShowExercises } from "~/components/trainings/ShowExercises";
import { toast } from "react-toastify";
import TrainingHistory from "~/components/TrainingHistory";
import ExpandablePanel from "~/components/trainings/ExpandablePanel";
import ErrorMsg from "~/components/ErrorMsg";

const Index: NextPage = () => {
  api.users.login.useQuery();
  const { data, isLoading, error } = api.trainings.getAll.useQuery();
  const [isAdding, setIsAdding] = useState(false);
  if (error) return <div>Something went wrong...</div>;

  return (
    <>
      {isLoading ? (
        <div className="flex min-h-screen items-center justify-center">
          <ClipLoader size={200} color="pink" className=" " />
        </div>
      ) : (
        <section className="text-center">
          <h1 className="mb-10 text-5xl ">Choose training:</h1>
          {data && <TrainingList data={data} remove start />}
          <Button
            onClick={() => setIsAdding(!isAdding)}
            className="mx-auto my-10 text-2xl"
          >
            Add Training +
          </Button>
          {isAdding && <AddTraining closeWindow={setIsAdding} />}
          <TrainingHistory />
        </section>
      )}
    </>
  );
};
export default Index;

interface TrainingListProps {
  data: RouterOutputs["trainings"]["getAll"];
  remove?: boolean;
  start?: boolean;
  editPanel?: (value: boolean) => void;
}
export function TrainingList({ data, remove, start }: TrainingListProps) {
  const [expandedIndex, setExpandedIndex] = useState(NaN);
  const handleTrainingClick = (index: number) =>
    index === expandedIndex ? setExpandedIndex(NaN) : setExpandedIndex(index);
  const renderedTrainings = data.map((training, index) => {
    return (
      <div key={training.id} className=" flex justify-center">
        <span
          onClick={() => handleTrainingClick(index)}
          className="
           flex-1- my-4 flex-1 basis-1/3 cursor-pointer
                    justify-center rounded bg-gradient-to-r from-gray-500 to-neutral-600 py-4 px-3
                    text-4xl font-medium text-white shadow-md shadow-gray-600 outline-none
                    transition hover:from-neutral-700 hover:to-neutral-700 md:py-9 md:px-6 "
        >
          {training.label}
        </span>

        {expandedIndex === index && (
          <ExpandablePanel training={training} remove={remove} start={start} />
        )}
      </div>
    );
  });
  return (
    <div className="mx-auto max-w-2xl flex-wrap justify-around gap-6 md:flex">
      {renderedTrainings}
    </div>
  );
}
export function AddTraining({
  closeWindow,
}: {
  closeWindow: (value: boolean) => void;
}) {
  const [exercises, setExercises] = useState<Pick<Exercise, "label">[]>([]);
  const [exerciseName, setExerciseName] = useState("");
  const [trainingName, setTrainingName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
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
    if (exerciseName === "") {
      setErrorMsg("Exercise name cannot be empty");
      return;
    }
    setErrorMsg("");
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
    if (trainingName === "") {
      setErrorMsg("Training name cannot be empty");
      return;
    }
    mutate({ label: trainingName, exercises });
    closeWindow(false);
  }
  function handleExerciseDelete(index: number) {
    const exercisesAfterDelete = [...exercises];

    exercisesAfterDelete.splice(index, 1);
    setExercises(exercisesAfterDelete);
  }
  return (
    <div className="mx-auto mt-6 max-w-md rounded bg-slate-400/10 p-8  text-center">
      <GiCancel
        className=" h-6 w-6 cursor-pointer"
        onClick={() => closeWindow(false)}
      />
      <div className="flex justify-center gap-4 pb-8">
        <div>
          {errorMsg && <ErrorMsg message={errorMsg} />}
          <Input
            className="my-2 mx-auto block max-w-sm text-xl"
            onChange={trainingOnChange}
            type="text"
            value={trainingName}
            placeholder="Training name"
            required
          />
          <Input
            className="my-2  max-w-xs text-sm"
            onChange={exerciseOnChange}
            type="text"
            value={exerciseName}
            placeholder="Exercise name"
            required
          />
        </div>
        <Button onClick={handleAddingExercise} className=" self-start">
          Add exercise
        </Button>
      </div>
      {exercises.length > 0 && (
        <form className=" flex justify-between" onSubmit={handleAddTraining}>
          <div className="">
            <ShowExercises
              exercises={exercises}
              onDelete={handleExerciseDelete}
            />
          </div>
          <Button type="submit" className="h-fit text-lg">
            Create training
          </Button>
        </form>
      )}
    </div>
  );
}
