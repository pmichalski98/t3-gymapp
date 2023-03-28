import { type NextPage } from "next";

import { api } from "~/utils/api";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import ContentLayout from "~/components/ContentLayout";
import Button from "~/components/Button";
import ButtonStyleWrapper from "~/components/ButtonStyleWrapper";
import React, { type ChangeEvent, DOMElement, useState } from "react";
import { type Exercise } from "@prisma/client";
import Input from "~/components/Input";
import { GiCancel } from "react-icons/gi";

const Home: NextPage = () => {
  const utils = api.useContext();
  const { data, isLoading, error } = api.trainings.getAll.useQuery();
  const { mutate: deleteTraining, isLoading: deleteLoading } =
    api.trainings.deleteByid.useMutation({
      onSuccess: async () => {
        await utils.trainings.invalidate();
        toast("Training deleted", { type: "success" });
      },
    });
  const [isAdding, setIsAdding] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(NaN);
  const handleTrainingClick = (index: number) =>
    index === expandedIndex ? setExpandedIndex(NaN) : setExpandedIndex(index);

  if (error) return <div>Something went wrong...</div>;

  //auto-cols-fr
  return (
    <ContentLayout>
      {isLoading ? (
        <ClipLoader size={150} color="cyan" className="mx-auto mt-20" />
      ) : (
        <>
          <h1 className="text-3xl">Choose training:</h1>
          <div className="">
            {data &&
              data.map((training, index) => {
                return (
                  <>
                    <div
                      onClick={() => handleTrainingClick(index)}
                      key={training.id}
                      className="text-backgroundBlue focus:outline-cyan border-cyan my-4 flex basis-1/3 cursor-pointer
                    justify-center rounded bg-gradient-to-r from-darkOcean to-lightCyan
                    py-4 px-3 text-6xl text-white shadow-2xl
                    outline-none hover:text-bg hover:outline-slate-400"
                    >
                      {training.label}
                    </div>
                    {expandedIndex === index && (
                      <div className="flex justify-around">
                        <Button
                          onClick={() => deleteTraining(training.id)}
                          variant="success"
                          disabled={deleteLoading}
                        >
                          Usun
                        </Button>
                        <Button variant="success">Rozpocznij</Button>
                      </div>
                    )}
                  </>
                );
              })}
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
