"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/loading-button";

import Link from "next/link";

import { signUpSchema } from "@/lib/auth/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth/client";
import { useState } from "react";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";

export default function SignUp() {
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(true);

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
      },
      {
        onRequest: () => {
          setPending(true);
        },
        onSuccess: () => {
          toast.success("Account created successfully");
        },
        onError: (ctx) => {
          console.log("error", ctx);
          toast.error(ctx.error.message || "Something went wrong.");
        },
      },
    );
    setPending(false);
  };

  return (
    <div className="flex grow items-center justify-center p-4">
      <Card className="w-full max-w-sm rounded-2xl shadow-xl">
        <CardHeader>
          <Logo className="mx-auto my-4 h-10" />
          <CardTitle className="text-center text-xl font-semibold">
            Create an account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              {["name", "email", "password", "confirmPassword"].map((field) => (
                <FormField
                  control={form.control}
                  key={field}
                  name={field as keyof z.infer<typeof signUpSchema>}
                  render={({ field: fieldProps }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-600">
                        {field === "confirmPassword"
                          ? "Confirm Password"
                          : field.charAt(0).toUpperCase() + field.slice(1)}
                      </FormLabel>
                      <FormControl>
                        {field === "password" || field === "confirmPassword" ? (
                          <div className="relative">
                            <Input
                              type={isPasswordVisible ? "password" : "text"}
                              placeholder={`Enter your ${
                                field === "confirmPassword"
                                  ? "password again"
                                  : field
                              }`}
                              {...fieldProps}
                              autoComplete="off"
                            />
                            <span
                              className="absolute inset-y-0 right-0 flex items-center pr-3"
                              onClick={() => {
                                setIsPasswordVisible((prev) => !prev);
                              }}
                            >
                              {!isPasswordVisible ? (
                                <EyeIcon className="h-4 w-4" />
                              ) : (
                                <EyeOffIcon className="h-4 w-4" />
                              )}
                            </span>
                          </div>
                        ) : (
                          <Input
                            type={field === "email" ? "email" : "text"}
                            placeholder={`Enter your ${field}`}
                            {...fieldProps}
                            autoComplete="off"
                          />
                        )}
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              ))}
              <LoadingButton pending={pending}>Sign up</LoadingButton>
            </form>
          </Form>
          <Button
            variant="outline"
            className="mt-4 w-full justify-center"
            onClick={async () => {
              await authClient.signIn.social({
                provider: "google",
                callbackURL: "/dashboard",
                newUserCallbackURL: "/role-selection",
              });
            }}
          >
            <FaGoogle className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="text-primary hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
