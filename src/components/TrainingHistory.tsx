import React, { useState } from "react";
import { api } from "~/utils/api";
import { GoChevronDown, GoChevronLeft } from "react-icons/go";
import TrainingTable from "~/components/TrainingTable";
import { type Exercise } from "@prisma/client";
import { ClipLoader } from "react-spinners";

export const formatDate = (date: Date) => {
  const day = Intl.DateTimeFormat("en-EN", {
    weekday: "long",
  }).format(date);
  return (
    <p className="capitalize">
      {day}
      {", "}
      {date.toLocaleDateString()}
    </p>
  );
};
const TrainingHistory: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState(NaN);
  const { data, isLoading, error } = api.trainings.getTrainingUnits.useQuery();
  if (error) return <div>Something went wrong...</div>;
  if (isLoading)
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <ClipLoader size={100} color="pink" />
      </div>
    );
  const handleExpandClick = (index: number) => {
    index === expandedIndex ? setExpandedIndex(NaN) : setExpandedIndex(index);
  };
  const config = [
    {
      label: "",
      render: (exercise: Exercise, index: number) => index + 1,
    },
    {
      label: "Exercise",
      render: (exercise: Exercise) => exercise.label,
    },
    {
      label: "Sets",
      render: (exercise: Exercise) => exercise.sets,
    },
    {
      label: "Reps",
      render: (exercise: Exercise) => exercise.reps,
    },
    {
      label: "Weight",
      render: (exercise: Exercise) => exercise.weight.toString().concat(" kg"),
    },
  ];
  return (
    <section className="mx-auto flex max-w-5xl flex-col justify-center gap-4 py-4">
      <h1 className="mx-auto mb-4 w-3/4 border-b-2 py-2 text-3xl lg:w-3/4">
        Recent workouts
      </h1>
      {data &&
        data.map((trainingUnit, index) => {
          const isExpanded = index === expandedIndex;
          return (
            <div key={trainingUnit.id} className="container mx-auto  ">
              <div className=" mx-auto max-w-xl  gap-4 rounded border p-2">
                <div
                  onClick={() => handleExpandClick(index)}
                  className={`mx-auto flex cursor-pointer justify-between px-5 py-2 md:text-xl ${
                    isExpanded ? "border-b-2 border-slate-200/20" : ""
                  }`}
                >
                  <div className="flex gap-4">
                    <p className="text-rose-400/90 ">{`${trainingUnit.label} `}</p>
                    <p>{formatDate(trainingUnit.createdAt)}</p>
                  </div>
                  <span className="self-center text-xl">
                    {isExpanded ? <GoChevronDown /> : <GoChevronLeft />}
                  </span>
                </div>
                {isExpanded && (
                  <div className="container mx-auto grid max-w-3xl grid-cols-[0.5fr_1fr_1fr_1fr_1fr] gap-4 px-2 py-6 text-center text-sm md:text-lg">
                    <TrainingTable
                      data={trainingUnit.exercises}
                      config={config}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </section>
  );
};
export default TrainingHistory;
