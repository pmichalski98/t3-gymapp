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
    <div className="  flex  flex-col gap-2 rounded p-4  ">
      {start && (
        <Button>
          <Link
            href={{
              pathname: "/home/[id]",
              query: { id: training.id },
            }}
          >
            Start
          </Link>
        </Button>
      )}
      {remove && (
        <Button
          onClick={() => deleteTraining(training.id)}
          disabled={deleteLoading}
        >
          Delete
        </Button>
      )}
    </div>
  );
}
