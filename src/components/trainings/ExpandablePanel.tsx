import Button from "~/components/Button";
import Link from "next/link";
import { FC } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { toast } from "react-toastify";
import { type Training } from "@prisma/client";

interface ExpandableProps {
  remove?: boolean;
  edit?: boolean;
  start?: boolean;
  training: Training;
}
export default function ExpandablePanel({
  remove,
  start,
  edit,
  training,
}: ExpandableProps) {
  const utils = api.useContext();
  const { mutate: deleteTraining, isLoading: deleteLoading } =
    api.trainings.deleteByid.useMutation({
      onSuccess: async () => {
        await utils.trainings.invalidate();
        toast("Training deleted", { type: "success" });
      },
    });
  return (
    <div className="flex justify-around pb-4">
      {remove && (
        <Button
          onClick={() => deleteTraining(training.id)}
          variant="success"
          disabled={deleteLoading}
        >
          Usuń
        </Button>
      )}
      {start && (
        <Button variant="success">
          <Link
            href={{
              pathname: "/home/[id]",
              query: { id: training.id },
            }}
          >
            Rozpocznij
          </Link>
        </Button>
      )}
      {edit && (
        <Button variant="success">
          <Link
            href={{
              pathname: "/trainings/[id]",
              query: { id: training.id },
            }}
          >
            Edit
          </Link>
        </Button>
      )}
    </div>
  );
}
