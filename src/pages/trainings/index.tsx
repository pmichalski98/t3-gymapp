import React, { useState } from "react";
import ContentLayout from "~/components/ContentLayout";
import { AddTraining, TrainingList } from "~/pages/home";
import Button from "~/components/Button";
import { api } from "~/utils/api";
import { ClipLoader } from "react-spinners";
import TrainingHistory from "~/components/TrainingHistory";

function Index() {
  const [isAdding, setIsAdding] = useState(false);
  const { error, isLoading, data } = api.trainings.getAll.useQuery();

  return (
    <ContentLayout>
      {isLoading ? (
        <ClipLoader size={150} color="cyan" className="mx-auto mt-20" />
      ) : (
        <>
          <h1 className="mb-4 text-3xl">Training list: </h1>
          {data && <TrainingList data={data} edit={true} remove={true} />}
          <Button
            onClick={() => setIsAdding(!isAdding)}
            variant="accent"
            className="mx-auto my-10 text-2xl"
          >
            Add Training +
          </Button>
          {isAdding && <AddTraining closeWindow={setIsAdding} />}
        </>
      )}
    </ContentLayout>
  );
}

export default Index;
