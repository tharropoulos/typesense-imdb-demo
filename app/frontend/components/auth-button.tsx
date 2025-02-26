import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";

type AuthUser = { user: string } | null;

interface AuthButtonProps extends React.ComponentProps<typeof Button> {
  auth?: AuthUser;
  authVariants?: {
    signIn?: React.ComponentProps<typeof Button>["variant"];
    signOut?: React.ComponentProps<typeof Button>["variant"];
  };
}

const AuthButton: React.FC<AuthButtonProps> = ({
  auth,
  className,
  variant,
  authVariants = { signIn: "outline", signOut: "link" },
  ...props
}) => {
  const isLoggedIn = !!auth;

  const buttonVariant = variant ?? (isLoggedIn ? authVariants.signOut : authVariants.signIn);

  const handleClick = () => {
    if (isLoggedIn) {
      router.delete("/logout");
    } else {
      router.get("/login");
    }
  };

  return (
    <Button variant={buttonVariant} onClick={handleClick} className={cn(className)} {...props}>
      {isLoggedIn ? "Sign out" : "Sign in"}
    </Button>
  );
};

export default AuthButton;
