import React, { type ChangeEvent, useState } from "react";
import ContentLayout from "~/components/ContentLayout";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { GoChevronDown } from "react-icons/go";
import { type Body, type Kcal, type Weight } from ".prisma/client";
import Button from "~/components/Button";
import { BsPlusCircle } from "react-icons/all";
import { toast } from "react-toastify";
import { func } from "prop-types";

function Index() {
  const utils = api.useContext();
  const { user } = useUser();
  const { data, isLoading, error } = api.users.getUserMeasurements.useQuery();
  const { mutate: setWeight } = api.users.updateWeight.useMutation({
    onSuccess: async () => {
      toast.success("Pomyślnie dodano");
      await utils.users.getUserMeasurements.invalidate();
    },
  });
  const { mutate: setKcal } = api.users.updateKcal.useMutation({
    onSuccess: async () => {
      toast.success("Pomyślnie dodano");
      await utils.users.getUserMeasurements.invalidate();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  if (!data) return <div>No data</div>;

  const kcalConfig = [
    {
      label: "Data",
      render: (kcal: Kcal) => (
        <span>{kcal.createdAt.toLocaleDateString()}</span>
      ),
    },
    {
      label: "Pomiary",
      render: (kcal: Kcal) => <span>{`${kcal.kcal} kcal`}</span>,
    },
  ];

  const weightConfig = [
    {
      label: "Data",
      render: (weight: Weight) => (
        <span>{weight.createdAt.toLocaleDateString()}</span>
      ),
    },
    {
      label: "Pomiary",
      render: (weight: Weight) => <span>{`${weight.weight} kg`}</span>,
    },
  ];
  const bodyConfig = [
    {
      label: "Data",
      render: (body: Body) => (
        <span>{body.createdAt.toLocaleDateString()}</span>
      ),
    },
    {
      label: "Pomiary",
      render: () => <GoChevronDown />,
    },
  ];

  return (
    <ContentLayout>
      <h1 className="my-10 text-3xl text-cyan-400">{user?.fullName}</h1>
      <div className="flex">
        <div className="container mx-auto grid max-w-3xl grid-cols-[1fr_1fr] gap-4 px-2 py-6 text-center text-sm md:text-lg">
          <BodyStats
            setter={setWeight}
            config={weightConfig}
            data={data.weight.sort(
              (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
            )}
            title="Weight"
          />
        </div>
        <div className="container mx-auto grid max-w-3xl grid-cols-[1fr_1fr] gap-4 px-2 py-6 text-center text-sm md:text-lg">
          <BodyStats
            setter={setKcal}
            config={kcalConfig}
            data={data.kcal.sort(
              (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
            )}
            title="Kcal"
          />
        </div>
        {/*<div className="container mx-auto grid max-w-3xl grid-cols-[1fr_1fr] gap-4 px-2 py-6 text-center text-sm md:text-lg">*/}
        {/*  <BodyStats config={bodyConfig} data={data.body} title="Body" />*/}
        {/*</div>*/}
      </div>
    </ContentLayout>
  );
}
export default Index;

interface BodyStatsProps<T> {
  config: {
    label: string;
    render: (data: T) => JSX.Element;
  }[];
  data: T[];
  title: string;
  setter: (value: number) => void;
}
export function BodyStats<T extends { id: string }>({
  config,
  data,
  title,
  setter,
}: BodyStatsProps<T>) {
  const [expanded, setExpanded] = useState(false);
  const renderedLabels = config.map((column) => {
    return (
      <h2 className="" key={column.label}>
        {column.label}
      </h2>
    );
  });

  const rows = data?.map((rowData) => {
    const renderedCells = config.map((column) => {
      return (
        <div key={column.label} className="flex justify-center ">
          {column.render(rowData)}
        </div>
      );
    });
    return (
      <div className="contents" key={rowData.id}>
        {renderedCells}
      </div>
    );
  });

  return (
    <>
      <h2 className="col-span-2">{title}</h2>
      <div className="contents">{renderedLabels}</div>
      {rows}
      <Button
        onClick={() => setExpanded(!expanded)}
        variant="primary"
        className="col-span-2 "
      >
        Add new value
      </Button>
      {expanded && (
        <AddNewMeasurement setter={setter} closeWindow={setExpanded} />
      )}
    </>
  );
}

interface Props {
  setter: (value: number) => void;
  closeWindow: (value: boolean) => void;
}
export function AddNewMeasurement({ setter, closeWindow }: Props) {
  const [value, setValue] = useState(0);

  function handleSave() {
    setter(value);
    closeWindow(false);
  }

  return (
    <div className="col-span-2 flex w-full items-center justify-between">
      <input
        className="border-b border-cyan-400 bg-inherit text-center text-cyan-400 outline-none"
        type="number"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setValue(Number(e.target.value))
        }
      />
      <Button onClick={handleSave} variant="primary" className="mr-10">
        Save
      </Button>
    </div>
  );
}
