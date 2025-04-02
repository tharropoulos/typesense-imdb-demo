// app/frontend/Pages/Home.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Link, usePage } from "@inertiajs/react";
import { PersonIcon } from "@radix-ui/react-icons";

type AuthUser = {
  user: {
    id: number;
    email: string;
  };
} | null;

export interface PageProps {
  auth?: AuthUser;
  [key: string]: unknown;
}

export default function Home() {
  const { props } = usePage<PageProps>();
  const isLoggedIn = Boolean(props.auth);
  return (
    <div className="container mx-auto mt-24">
      <div className="bg-grid-white/[0.2] absolute inset-0 bg-[size:16px_16px]" />
      <div className="relative px-6 py-12 text-center text-white md:px-12 md:py-20">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Typesense Recommendations Demo
        </h1>
        <p className="text-muted-foreground leading-7 [&:not(:first-child)]:mt-6">
          Discover personalized movie and TV show recommendations powered by Typesense and Ruby on Rails. Our AI-driven
          search helps you find exactly what you're looking for.
        </p>

        {!isLoggedIn ?
          <div className="mt-16 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3">
              <PersonIcon className="h-5 w-5" />
              <p className="text-sm font-semibold md:text-base">
                Sign in to unlock personalized recommendations -{" "}
                <span className="font-normal">Discover content tailored to your taste and viewing history.</span>
              </p>
            </div>
          </div>
        : <>
            <div className="mt-16 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 flex-shrink-0"
                >
                  <path d="M20 7h-9" />
                  <path d="M14 17H5" />
                  <circle cx="17" cy="17" r="3" />
                  <circle cx="7" cy="7" r="3" />
                </svg>
                <p className="text-sm font-medium md:text-base">
                  <span className="font-semibold">Welcome back!</span> - Your personalized recommendations are ready for
                  you.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button className="rounded-full">
                <Link href="/movies">Go to Movies</Link>
              </Button>
              <Button className="rounded-full">
                <Link href="/tv_shows">Go to TV Shows</Link>
              </Button>
            </div>
          </>
        }

        {!isLoggedIn && (
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button className="rounded-full">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" className="rounded-full">
                Create Account
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
