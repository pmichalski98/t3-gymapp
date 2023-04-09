import React from "react";
import ContentLayout from "~/components/ContentLayout";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { GoChevronDown } from "react-icons/go";
import { type Kcal, type Weight, type Body } from ".prisma/client";

function Index() {
  const { user } = useUser();
  const { data, isLoading, error } = api.users.getUserMeasurements.useQuery();

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
          <BodyStats config={weightConfig} data={data.weight} title="Weight" />
        </div>
        <div className="container mx-auto grid max-w-3xl grid-cols-[1fr_1fr] gap-4 px-2 py-6 text-center text-sm md:text-lg">
          <BodyStats config={kcalConfig} data={data.kcal} title="Kcal" />
        </div>
        <div className="container mx-auto grid max-w-3xl grid-cols-[1fr_1fr] gap-4 px-2 py-6 text-center text-sm md:text-lg">
          <BodyStats config={bodyConfig} data={data.body} title="Body" />
        </div>
      </div>
    </ContentLayout>
  );
}
export default Index;
//@TODO ogarnac to, zrobic cos na wzor trainingtable tylko ze dla bodystats
interface BodyStatsProps<T> {
  config: {
    label: string;
    render: (data: T) => JSX.Element;
  }[];
  data: T[];
  title: string;
}
export function BodyStats<T extends { id: string }>({
  config,
  data,
  title,
}: BodyStatsProps<T>) {
  const renderedLabels = config.map((column) => {
    return (
      <h2 className="" key={column.label}>
        {column.label}
      </h2>
    );
  });

  const readOnlyRows = data?.map((rowData) => {
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
      {readOnlyRows}
    </>
  );
}
