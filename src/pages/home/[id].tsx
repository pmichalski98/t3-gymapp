import React, { type ChangeEvent, type SyntheticEvent, useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import type { FormData } from "~/types/training";
import Input from "~/components/Input";
import Button from "~/components/Button";
import TrainingTable from "~/components/TrainingTable";
import { type Exercise } from "@prisma/client";
import { ClipLoader } from "react-spinners";

function Id() {
  const [editRow, setEditRow] = useState<number | null>(null);
  const [formData, setFormData] = useState<Exercise>({} as Exercise);
  const { mutate } = api.trainings.editTraining.useMutation();
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") throw new Error("no id");

  const {
    data: training,
    isLoading,
    error,
  } = api.trainings.getChosen.useQuery(id);

  const [updatedTraining, setUpdatedTraining] = useState(training);

  if (error) return <div>Something went wrong ...</div>;
  if (isLoading)
    return <ClipLoader size={150} color="cyan" className="mx-auto mt-20" />;

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
      mutate(updatedTraining);
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
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
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

  const contentBeforeTrainingStarted: JSX.Element = (
    <>
      <div className="container mx-auto my-14 w-fit ">
        <h1 className="mb-10 p-4 text-center text-5xl capitalize">
          {updatedTraining?.label}
        </h1>
        <form
          className="container mx-auto grid inline-grid max-w-3xl grid-cols-6 gap-4 text-center"
          onSubmit={handleSaveBtn}
        >
          <TrainingTable
            config={config}
            data={
              updatedTraining === undefined
                ? training.exercises
                : updatedTraining.exercises
            }
          />
        </form>
        <div className="flex place-content-end ">
          <Button
            className="mt-10"
            variant="primary"
            rounded
            onClick={submitTraining}
          >
            Save training
          </Button>
        </div>
      </div>
      <Button
        variant="primary"
        className="mx-auto mt-10 rounded px-9 py-6 text-6xl"
      >
        START TRAINING
      </Button>
    </>
  );

  return (
    <div className=" container mx-auto grid w-10/12 content-center gap-4 ">
      {contentBeforeTrainingStarted}
    </div>
  );
}

export default Id;
