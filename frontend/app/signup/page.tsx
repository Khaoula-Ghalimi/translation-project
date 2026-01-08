"use client";

import * as React from "react";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const signupSchema = z
    .object({
        username: z.string().min(3, "Username must be at least 3 characters"),
        email: z.string().email("Enter a valid email"),
        password: z.string().min(4, "Password must be at least 4 characters"),
        confirmPassword: z.string().min(4, "Confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const [serverError, setServerError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<SignupValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
        mode: "onSubmit",
    });

    const onSubmit = async (values: SignupValues) => {
        setServerError(null);
        setIsLoading(true);

        try {
            const baseURL =
                process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/backend/api";

            // ✅ We only send ONE password to the backend (password)
            const res = await axios.post(
                `${baseURL}/auth/register`, // adjust to your backend route
                {
                    username: values.username,
                    email: values.email,
                    password: values.password,
                },
                { headers: { "Content-Type": "application/json" } }
            );

            // Optional: store created user or redirect
            localStorage.setItem("auth_user", JSON.stringify(res.data));
            
            
            window.location.href = "/login"; // or "/"
        } catch (err) {
            const e = err as AxiosError<any>;
            const msg =
                e.response?.data?.message ||
                (typeof e.response?.data === "string" ? e.response?.data : null) ||
                e.message ||
                "Signup failed";
            setServerError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const usernameError = form.formState.errors.username?.message;
    const emailError = form.formState.errors.email?.message;
    const passwordError = form.formState.errors.password?.message;
    const confirmPasswordError = form.formState.errors.confirmPassword?.message;

    return (
        <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-2xl border bg-background p-6 shadow-sm">
                <div className="mb-6">
                    <h1 className="text-xl font-semibold">Sign up</h1>
                    <p className="text-sm text-muted-foreground">
                        Create your account with username, email, and password.
                    </p>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Username</label>
                        <Input
                            placeholder="sleepyraccoon"
                            autoComplete="username"
                            {...form.register("username")}
                        />
                        {usernameError ? (
                            <p className="text-sm text-destructive">{usernameError}</p>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            placeholder="user@test.com"
                            type="email"
                            autoComplete="email"
                            {...form.register("email")}
                        />
                        {emailError ? (
                            <p className="text-sm text-destructive">{emailError}</p>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input
                            placeholder="••••••••"
                            type="password"
                            autoComplete="new-password"
                            {...form.register("password")}
                        />
                        {passwordError ? (
                            <p className="text-sm text-destructive">{passwordError}</p>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Confirm Password</label>
                        <Input
                            placeholder="••••••••"
                            type="password"
                            autoComplete="new-password"
                            {...form.register("confirmPassword")}
                        />
                        {confirmPasswordError ? (
                            <p className="text-sm text-destructive">{confirmPasswordError}</p>
                        ) : null}
                    </div>

                    {serverError ? (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                            {serverError}
                        </div>
                    ) : null}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Creating account..." : "Create account"}
                    </Button>

                    <p className="text-xs text-muted-foreground">
                        Already have an account?{" "}
                        <a className="text-primary hover:underline" href="/login">
                            Login
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}
