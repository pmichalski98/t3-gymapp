import { type Exercise } from ".prisma/client";

interface Props {
  config: {
    label: string;
    render: (
      exercise: Exercise,
      index: number
    ) => string | number | JSX.Element | null;
  }[];
  data: Exercise[] | undefined;
}
function TrainingTable({ config, data }: Props) {
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
export default TrainingTable;
