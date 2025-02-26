import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const userSchema = z.object({
  user: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    remember_me: z.boolean().optional(),
  }),
});

type UserFormInputs = z.infer<typeof userSchema>;

export default function Login() {
  const form = useForm<UserFormInputs>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (data: UserFormInputs) => {
    router.post("/login", data);
  };

  return (
    <>
      <Head title="Sign in"></Head>
      <div className="flex min-h-screen justify-center bg-gradient-to-b from-white to-gray-300">
        <div className="flex min-h-screen min-w-[30vw] flex-col justify-center gap-3 p-4">
          <div className="my-4 flex flex-col gap-3">
            <h1 className="text-xl leading-none font-semibold">Welcome back</h1>
            <h2 className="text-lg leading-none">Sign in to your account</h2>
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
                      <Input placeholder="david@lynch.com" type="email" {...field} />
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
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user.remember_me"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!m-0">Remember me</FormLabel>
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-4 w-full cursor-pointer" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
