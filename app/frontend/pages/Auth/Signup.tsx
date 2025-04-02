import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, Link, router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const userSchema = z
  .object({
    user: z.object({
      email: z.string().email("Invalid email address"),
      password: z.string().min(1, "Password must be at least 1 character"),
      password_confirmation: z.string().min(1, "Password confirmation must be at least 1 character"),
    }),
  })
  .refine((data) => data.user.password === data.user.password_confirmation, {
    message: "Passwords do not match",
    path: ["user.password_confirmation"],
  });

type UserFormInputs = z.infer<typeof userSchema>;

interface PageProps {
  errors?: {
    email?: string[];
    password?: string[];
    password_confirmation?: string[];
    username?: string[];
    base?: string[];
  };
}

export default function SignUp() {
  const form = useForm<UserFormInputs>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      user: {
        email: "",
        password: "",
        password_confirmation: "",
      },
    },
  });

  const onSubmit = (data: UserFormInputs) => {
    router.post("/signup", data, {
      forceFormData: true,
      onError: (errors) => {
        console.error("Signup errors:", errors);
      },
    });
  };

  return (
    <>
      <Head title="Sign up"></Head>
      <div className="flex min-h-screen justify-center bg-gradient-to-b from-white to-gray-300">
        <div className="flex min-h-screen min-w-[30vw] flex-col justify-center gap-3 p-4">
          <div className="my-4 flex flex-col gap-3">
            <h1 className="text-xl leading-none font-semibold">Create an account</h1>
            <h2 className="text-lg leading-none">Sign up to get started</h2>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="user.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user.password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Create a password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user.password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-4 w-full cursor-pointer" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating account..." : "Sign up"}
              </Button>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
