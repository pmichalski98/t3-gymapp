import React, { useState } from "react";
import ContentLayout from "~/components/ContentLayout";
import { AddTraining } from "~/pages/home";
import Button from "~/components/Button";

function Index() {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <ContentLayout>
      <Button
        onClick={() => setIsAdding(!isAdding)}
        variant="secondary"
        className="mx-auto"
      >
        Add Training +
      </Button>
      {isAdding && <AddTraining closeWindow={setIsAdding} />}{" "}
    </ContentLayout>
  );
}

export default Index;
