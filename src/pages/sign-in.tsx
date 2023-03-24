import { SignIn } from "@clerk/nextjs";

const SignInpage = () => {
  return <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />;
};

export default SignInpage;
