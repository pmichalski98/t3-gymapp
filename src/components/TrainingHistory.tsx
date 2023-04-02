import React, { useState } from "react";
import { api } from "~/utils/api";
import { GoChevronDown, GoChevronLeft } from "react-icons/go";
import TrainingTable from "~/components/TrainingTable";
import { type Exercise } from "@prisma/client";

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
  if (isLoading) return <div>Loading...</div>;
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
      render: (exercise: Exercise) => exercise.weight,
    },
  ];
  return (
    <div className="flex flex-col justify-center gap-4 py-4">
      <h1 className="mx-auto w-full border-b-4 border-lightCyan py-1 text-3xl lg:w-3/4">
        Recent workouts
      </h1>
      {data &&
        data.map((trainingUnit, index) => {
          const isExpanded = index === expandedIndex;
          return (
            <div
              onClick={() => handleExpandClick(index)}
              key={trainingUnit.id}
              className="mx-auto cursor-pointer gap-4 rounded border p-2"
            >
              <div
                className={`mx-auto flex gap-2 border-darkOcean py-2 px-10 md:text-xl ${
                  isExpanded ? "border-b-4" : ""
                }`}
              >
                <p className="text-lightCyan ">{`${trainingUnit.label} `}</p>
                {formatDate(trainingUnit.createdAt)}
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
          );
        })}
    </div>
  );
};
export default TrainingHistory;
