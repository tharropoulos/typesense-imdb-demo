// app/frontend/Pages/Home.tsx
import React from "react";
import { usePage } from "@inertiajs/react";

interface PageProps {
  auth?: {
    user: string;
  };
  [key: string]: unknown;
}

export default function Home() {
  const { props } = usePage<PageProps>();
  const isLoggedIn = Boolean(props.auth);
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Welcome to your app</h1>

        {isLoggedIn ?
          <div className="mt-4">
            <p className="text-green-600 font-medium">You are successfully logged in!</p>
            <p className="mt-2">Logged in as: {props.auth?.user}</p>
          </div>
        : <div className="mt-4">
            <p className="text-amber-600 font-medium">You are not logged in.</p>
            <p className="mt-2">
              Please{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                sign in
              </a>{" "}
              to access all features.
            </p>
          </div>
        }
      </div>
    </div>
  );
}
