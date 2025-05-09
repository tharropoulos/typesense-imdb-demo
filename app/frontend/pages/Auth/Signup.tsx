import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const userSchema = z
  .object({
    user: z.object({
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      password_confirmation: z.string().min(6, "Password confirmation is required"),
      username: z.string().min(3, "Username is required"),
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
  const { errors } = usePage().props as PageProps;

  const form = useForm<UserFormInputs>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      user: {
        email: "",
        password: "",
        password_confirmation: "",
        username: "",
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

  const serverError = errors?.base?.[0];

  return (
    <>
      <Head title="Sign up"></Head>
      <div className="flex min-h-screen items-center justify-center space-x-11 bg-gradient-to-b from-zinc-50 to-zinc-300 dark:from-zinc-900 dark:to-black">
        <div className="flex min-h-screen min-w-[30vw] flex-col justify-center gap-3 p-4">
          <div className="my-4 flex flex-col gap-3">
            <h1 className="text-xl leading-none font-semibold">Create an account</h1>
            <h2 className="text-lg leading-none">Sign up to get started</h2>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="user.username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        type="text"
                        {...field}
                        className={errors?.username ? "border-red-500" : ""}
                        // Ensure the value is set in the DOM
                        value={field.value || ""}
                        onChange={(e) => {
                          field.onChange(e);
                          // Log to verify the change is registered
                          console.log("Username changed to:", e.target.value);
                        }}
                      />
                    </FormControl>
                    {errors?.username && <p className="mt-1 text-sm font-medium text-red-500">{errors.username[0]}</p>}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your@email.com"
                        type="email"
                        {...field}
                        className={errors?.email ? "border-red-500" : ""}
                      />
                    </FormControl>
                    {errors?.email && <p className="mt-1 text-sm font-medium text-red-500">{errors.email[0]}</p>}
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
                      <Input
                        type="password"
                        placeholder="Create a password"
                        {...field}
                        className={errors?.password ? "border-red-500" : ""}
                      />
                    </FormControl>
                    {errors?.password && <p className="mt-1 text-sm font-medium text-red-500">{errors.password[0]}</p>}
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
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        {...field}
                        className={errors?.password_confirmation ? "border-red-500" : ""}
                      />
                    </FormControl>
                    {errors?.password_confirmation && (
                      <p className="mt-1 text-sm font-medium text-red-500">{errors.password_confirmation[0]}</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              {serverError && (
                <Alert variant="destructive" className="flex items-center justify-center outline-none">
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )}
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
