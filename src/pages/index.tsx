import { type NextPage } from "next";

import { api } from "~/utils/api";
import { SignInButton, SignOutButton, useSignUp, useUser } from "@clerk/nextjs";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { isLoaded, isSignedIn, user } = useUser();
  console.log(user);

  return (
    <div>
      {isSignedIn ? <SignOutButton /> : <SignInButton />}
    </div>
  );
};

export default Home;
