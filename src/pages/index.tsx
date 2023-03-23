import { type NextPage } from "next";

import { api } from "~/utils/api";
import { SignInButton, SignOutButton, useSignUp, useUser } from "@clerk/nextjs";
import ButtonStyleWrapper from "~/components/ButtonStyleWrapper";
import Navbar from "~/pages/Navbar";

const Home: NextPage = () => {
  // const { data } = api.trainings.getAll.useQuery();

  return <div className="mx-auto flex w-3/4 justify-end pt-6"></div>;
};

export default Home;
