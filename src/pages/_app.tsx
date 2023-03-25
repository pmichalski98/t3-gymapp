import { type AppType } from "next/app";

import { api } from "~/utils/api";
import "react-toastify/dist/ReactToastify.css";
import "~/styles/globals.css";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import Navbar from "~/components/Navbar";
import { useRouter } from "next/router";
import { dark } from "@clerk/themes";
import { ToastContainer } from "react-toastify";
import React from "react";

const publicPages: Array<string> = [];

const MyApp: AppType = ({ Component, pageProps }) => {
  const { pathname } = useRouter();

  // Check if the current route matches a public page
  const isPublicPage = publicPages.includes(pathname);

  // Maybe I will add some public pages
  return (
    <div className="min-h-screen bg-primary text-slate-200">
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
      >
        {isPublicPage ? (
          <>
            <Component {...pageProps} />
          </>
        ) : (
          <>
            <SignedIn>
              <Navbar />
              <Component {...pageProps} />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        )}
        <ToastContainer autoClose={1000} />
      </ClerkProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
