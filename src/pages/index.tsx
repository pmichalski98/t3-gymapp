import React from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

function StartPage() {
  const router = useRouter();
  void router.push("/home");
}

export default StartPage;
