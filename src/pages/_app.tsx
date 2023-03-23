import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "~/pages/Navbar";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="h-screen bg-primary text-slate-200">
      <ClerkProvider>
        <Navbar />
        <Component {...pageProps} />
      </ClerkProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
