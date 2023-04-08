import React, { type FC } from "react";
import { useRouter } from "next/router";
import { api, type RouterOutputs } from "~/utils/api";
import { ClipLoader } from "react-spinners";
import ContentLayout from "~/components/ContentLayout";
import { Exercise } from "@prisma/client";

const Id = () => {
  const router = useRouter();
  const { id } = router.query;
  if (typeof id !== "string") throw new Error("no id");

  const { error, data, isLoading } = api.trainings.getById.useQuery(id);

  if (error) return <div>Something went wrong ...</div>;
  if (!data) return <div>Something went wrong ...</div>;

  return (
    <ContentLayout>
      {isLoading && !data ? (
        <ClipLoader size={150} color="cyan" className="mx-auto mt-20" />
      ) : (
        <EditPanel training={data} />
      )}
    </ContentLayout>
  );
};

export default Id;
export function EditPanel({
  training,
}: {
  training: RouterOutputs["trainings"]["getById"];
}) {
  const filteredExercises = [
    ...new Set(training.exercises.map((e) => e.label)),
  ];
  console.log(filteredExercises);
  return (
    <div>
      <>{filteredExercises.map((exercise) => exercise)}</>
    </div>
  );
}
