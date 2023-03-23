import { type NextPage } from "next";

import { api } from "~/utils/api";
import { ClipLoader } from "react-spinners";
import { useUser } from "@clerk/nextjs";
import Button from "~/components/Button";

const Home: NextPage = () => {
  const { user } = useUser();

  if (!user) return <div>you need to sign in</div>;

  const { data, isLoading, error } = api.trainings.getAll.useQuery({
    content: user.id,
  });

  if (error) return <div>Something went wrong ...</div>;

  return (
    <div className="mx-auto pt-4 text-center">
      {isLoading && (
        <ClipLoader size={150} color="cyan" className="mx-auto mt-20" />
      )}
      <h1 className="text-3xl">{user?.firstName} choose training:</h1>
      <div className="p-120 grid grid-flow-row gap-16 p-20 md:grid-flow-col">
        {data &&
          data.map((training) => (
            <Button
              variant="primary"
              className="mx-auto rounded px-10 py-10 text-6xl font-bold"
              key={training.id}
              onClick={() => console.log("chosen training")}
            >
              {training.label}
            </Button>
          ))}
      </div>
    </div>
  );
};

export default Home;
