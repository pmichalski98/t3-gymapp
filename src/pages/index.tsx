import { useRouter } from "next/router";

function StartPage() {
  const router = useRouter();
  void router.push("/home");
}

export default StartPage;
