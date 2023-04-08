import React from "react";
import ContentLayout from "~/components/ContentLayout";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { GoArrowDown } from "react-icons/all";
import { GoChevronDown } from "react-icons/go";
import { allowedDisplayValues } from "next/dist/compiled/@next/font/dist/constants";
import TrainingTable from "~/components/TrainingTable";
import { type Weight } from ".prisma/client";

function Index() {
  const { user } = useUser();
  const { data, isLoading, error } = api.users.getUserMeasurements.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  if (!data) return <div>No data</div>;
  const config = [];
  return (
    <ContentLayout>
      <h1 className="my-10 text-3xl text-cyan-400">{user?.fullName}</h1>
      <div className="flex flex-col justify-center gap-10 md:flex-row ">
        <BodyStats config={} data={data.weight} />
        <div>
          <h2>Body measurements</h2>
          <div className="flex items-center justify-between">
            {data.body.map((body) => (
              <div key={body.id}>
                <span>{body.createdAt.toLocaleDateString()}</span>
              </div>
            ))}
            <GoChevronDown className="h-6" />
          </div>
        </div>{" "}
        <div>
          <h2>Kcal</h2>
          <div>content</div>
        </div>
      </div>
    </ContentLayout>
  );
}
export default Index;
//@TODO ogarnac to, zrobic cos na wzor trainingtable tylko ze dla bodystats
interface BodyStatsProps {
  config: {
    label: string;
    render: (weight: Weight[], index: number) => React.ReactNode;
  };
  data: Weight[];
}
export function BodyStats({ config, data }: BodyStatsProps) {
  const renderedLabels = config.map((column) => {
    return (
      <h2 className="" key={column.label}>
        {column.label}
      </h2>
    );
  });

  const readOnlyRows = data?.map((rowData, index) => {
    const renderedCells = config.map((column) => {
      return (
        <div key={column.label} className="flex justify-center ">
          {column.render(rowData, index)}
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
      <div className="contents">{renderedLabels}</div>
      {readOnlyRows}
    </>
  );
}
