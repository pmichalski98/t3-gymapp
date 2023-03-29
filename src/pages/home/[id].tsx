import React, { type ChangeEvent, type SyntheticEvent, useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import type { FormData } from "~/types/training";
import Input from "~/components/Input";
import Button from "~/components/Button";
import TrainingTable from "~/components/TrainingTable";
import {
  type Exercise,
  type Training,
  type TrainingUnit,
} from "@prisma/client";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

function Id() {
  const [editRow, setEditRow] = useState<number | null>(null);
  const [formData, setFormData] = useState<Exercise>({} as Exercise);
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") throw new Error("no id");

  const {
    data: training,
    isLoading,
    error,
  } = api.trainings.startTraining.useQuery(id);

  const utils = api.useContext();
  const { mutate, isLoading: editTrainingLoading } =
    api.trainings.finishTrainingUnit.useMutation({
      onSuccess: async () => {
        toast.success("Training updated successfully");
        await utils.trainings.invalidate();
      },
    });

  const [updatedTraining, setUpdatedTraining] = useState<
    | (Training & { exercises: Exercise[] })
    | (TrainingUnit & { exercises: Exercise[] })
  >();

  const [expandedIndex, setExpandedIndex] = useState(false);

  if (error) return <div>Something went wrong ...</div>;

  if (training && updatedTraining === undefined) setUpdatedTraining(training);
  console.log(training);

  function handleEditFormChange(
    event: ChangeEvent<HTMLInputElement>,
    fieldName: keyof FormData
  ) {
    event.preventDefault();

    const fieldValue = event.target.value;

    setFormData({
      ...formData,
      [fieldName]: fieldName === "label" ? fieldValue : Number(fieldValue),
    });
  }
  function handleEditBtn(exercise: Exercise, index: number): void {
    setEditRow(index);
    setFormData({ ...exercise });
  }

  function handleSaveBtn(event: SyntheticEvent): void {
    event.preventDefault();
    if (updatedTraining) {
      const updatedExercises = updatedTraining.exercises.map((exercise) =>
        exercise.id === formData.id
          ? { ...exercise, ...formData }
          : { ...exercise }
      );
      setUpdatedTraining({
        ...updatedTraining,
        exercises: updatedExercises,
      });
    }
    setEditRow(null);
  }

  function submitTraining() {
    if (updatedTraining) {
      // trzeba najprawdopodobniej dodac createdAt i endedAt
      mutate(updatedTraining);
      setExpandedIndex(false);
    }
  }

  function showInputOrLabel(
    index: number,
    name: keyof FormData,
    label: string | number,
    value: string | number
  ) {
    return editRow === index ? (
      <Input
        type={typeof value === "number" ? "number" : "text"}
        name={name}
        value={value}
        onChange={(event) => handleEditFormChange(event, name)}
      />
    ) : name === "weight" ? (
      `${label} kg`
    ) : (
      label
    );
  }

  const config = [
    {
      label: "",
      render: (exercise: Exercise, index: number) => index + 1,
    },
    {
      label: "Exercise",
      render: (exercise: Exercise, index: number) =>
        showInputOrLabel(index, "label", exercise.label, formData.label),
    },
    {
      label: "Sets",
      render: (exercise: Exercise, index: number) =>
        showInputOrLabel(index, "sets", exercise.sets, formData.sets),
    },
    {
      label: "Reps",
      render: (exercise: Exercise, index: number) =>
        showInputOrLabel(index, "reps", exercise.reps, formData.reps),
    },
    {
      label: "Weight",
      render: (exercise: Exercise, index: number) =>
        showInputOrLabel(index, "weight", exercise.weight, formData.weight),
    },
    {
      label: "Actions",
      render: (exercise: Exercise, index: number) =>
        index !== editRow ? (
          <Button
            variant="success"
            rounded
            key={`${index}edit`}
            onClick={() => handleEditBtn(exercise, index)}
          >
            Edit
          </Button>
        ) : (
          <Button variant="primary" key={`${index}save`} type="submit">
            Save
          </Button>
        ),
    },
  ];
  return (
    <div className="m-auto mt-20 max-w-3xl rounded bg-slate-100/5 py-10 px-2 text-center  ">
      {isLoading ? (
        <ClipLoader size={150} color="cyan" className="mx-auto mt-20" />
      ) : (
        <>
          <TrainingTimeTicker />
          <h1 className="my-6 p-4 text-center text-5xl capitalize">
            {training.label}
          </h1>
          <form
            className="container mx-auto grid max-w-3xl grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-2 text-center text-sm"
            onSubmit={handleSaveBtn}
          >
            <>
              <TrainingTable
                config={config}
                data={updatedTraining && updatedTraining.exercises}
              />
            </>
          </form>
          <Button
            className="mx-auto mt-10"
            variant="primary"
            hidden={expandedIndex}
            rounded
            onClick={() => setExpandedIndex(!expandedIndex)}
            disabled={editTrainingLoading}
          >
            {editTrainingLoading ? <ClipLoader size={20} /> : "Zakończ trening"}
          </Button>
          {expandedIndex && (
            <div className="flex flex-wrap">
              <h2 className="w-full ">
                Czy napewno chcesz zakonczyc trening ?
              </h2>
              <Button
                onClick={() => submitTraining()}
                variant="success"
                className="mx-auto"
              >
                Tak
              </Button>
              <Button
                onClick={() => setExpandedIndex(false)}
                variant="primary"
                className="mx-auto"
              >
                Nie
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Id;

export const TrainingTimeTicker = () => {
  const [startTime, setStartTime] = useState(new Date());

  let endTime: Date;
  const handleEndTraining = () => {
    endTime = new Date();
    const num = Math.abs(endTime.getTime() - startTime.getTime());
    console.log(Math.floor(num / 1000));
    const dd = new Date().setTime(num);
    // to mi zwraca ile czasu upłyneło tylko w GMT +1 (czyli w Polsce)
  };

  return <div>{startTime.toLocaleTimeString()}</div>;
  // const [time, setTime] = useState(0);
  //
  // useEffect(() => {
  //   const intervalId = setInterval(() => setTime(time + 1), 10);
  //   return () => clearInterval(intervalId);
  // }, [time]);
  //
  // const hours = Math.floor(time / 360000);
  // const minutes = Math.floor((time % 360000) / 6000);
  // const seconds = Math.floor((time % 6000) / 100);
  //
  // return (
  //   <div>{`${hours.toString().padStart(2, "0")} : ${minutes
  //     .toString()
  //     .padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`}</div>
  // );
};
