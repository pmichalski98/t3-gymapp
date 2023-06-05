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
    <div className="  rounded  p-4 ">
      {start && (
        <Button className="mb-4 ">
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
          className=" flex"
          onClick={() => deleteTraining(training.id)}
          disabled={deleteLoading}
        >
          Delete
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
