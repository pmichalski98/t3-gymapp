import React, { type ReactNode } from "react";
import Head from "next/head";
import Navbar from "~/components/Navbar";
import { ToastContainer } from "react-toastify";

function ContentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Head>
        <title>Training manager</title>
        <meta name="description" content="Training Manager" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <header className="min-w-[400px] bg-neutral-900/50 shadow-md shadow-gray-500">
        <Navbar />
      </header>
      <main className=" mx-auto mt-10 w-11/12  ">{children}</main>
      <ToastContainer
        position="top-center"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnFocusLoss={false}
        pauseOnHover
        theme="light"
        autoClose={2000}
      />
    </div>
  );
}

export default ContentLayout;
