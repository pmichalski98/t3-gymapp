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
    <div className="mt-10 flex flex-col justify-center gap-4 py-4">
      <h1 className="mx-auto w-1/2 border-b-4 border-lightCyan py-1 text-3xl">
        Last done trainings
      </h1>
      {data &&
        data.map((trainingUnit, index) => {
          const isExpanded = index === expandedIndex;
          return (
            <div
              onClick={() => handleExpandClick(index)}
              key={trainingUnit.id}
              className="mx-auto flex cursor-pointer flex-wrap gap-4 rounded border p-2"
            >
              <div className="mx-auto flex gap-2">
                {`${trainingUnit.label} `}
                {formatDate(trainingUnit.createdAt)}
                <span className="content-end">
                  {isExpanded ? <GoChevronDown /> : <GoChevronLeft />}
                </span>
              </div>
              {isExpanded && (
                <div className="container mx-auto grid max-w-3xl grid-cols-[0.5fr_1fr_1fr_1fr_1fr] gap-4 px-2 text-center text-sm">
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
