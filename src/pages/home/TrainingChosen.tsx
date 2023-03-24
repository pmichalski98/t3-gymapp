import React from "react";
import { type Training } from ".prisma/client";
import { useRouter } from "next/router";

function TrainingChosen({ training }: { training: Training }) {
  const router = useRouter();
  return (
    <div>
      <button onClick={() => router.back()}>Go back </button>
      {training.label}
    </div>
  );
}

export default TrainingChosen;
