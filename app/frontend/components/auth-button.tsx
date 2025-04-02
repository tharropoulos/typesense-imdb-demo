import type { PageProps } from "@/pages/Home";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { router, usePage } from "@inertiajs/react";

interface AuthButtonProps extends React.ComponentProps<typeof Button>, PageProps {
  authVariants?: {
    signIn?: React.ComponentProps<typeof Button>["variant"];
    signOut?: React.ComponentProps<typeof Button>["variant"];
  };
}

function AuthButton({
  className,
  variant,
  authVariants = { signIn: "outline", signOut: "link" },
  ...rest
}: AuthButtonProps) {
  const { props } = usePage<AuthButtonProps>();
  const isLoggedIn = Boolean(props.auth);

  const buttonVariant = variant ?? (isLoggedIn ? authVariants.signOut : authVariants.signIn);

  const handleClick = () => {
    if (isLoggedIn) {
      router.delete("/logout");
    } else {
      router.get("/login");
    }
  };

  return (
    <Button variant={buttonVariant} onClick={handleClick} className={cn(className)} {...rest}>
      {isLoggedIn ? "Sign out" : "Sign in"}
    </Button>
  );
}

export { AuthButton };
