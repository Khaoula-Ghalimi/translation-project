"use client";

import * as React from "react";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(4, "Password must be at least 4 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

function toBasicToken(email: string, password: string) {
    // Basic base64(email:password)
    // btoa expects latin1; emails/passwords usually ok. If you want full unicode support later, tell me.
    return `Basic ${btoa(`${email}:${password}`)}`;
}

export default function LoginPage() {
    const [serverError, setServerError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
        mode: "onSubmit",
    });

    const onSubmit = async (values: LoginValues) => {
        setServerError(null);
        setIsLoading(true);

        try {
            const baseURL =
                process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/backend/api";

            const res = await axios.post(
                `${baseURL}/auth/login`,
                {
                    email: values.email,
                    password: values.password,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            // Save user + Basic token for later requests (simple approach)
            const basicToken = toBasicToken(values.email, values.password);
            localStorage.setItem("auth_basic", basicToken);
            localStorage.setItem("auth_user", JSON.stringify(res.data));
            document.cookie = `auth_basic=${basicToken}; path=/; max-age=604800`;

            // Redirect wherever you want
            window.location.href = "/"; // change to /dashboard if you have one
        } catch (err) {
            const e = err as AxiosError<any>;
            const msg =
                e.response?.data?.message ||
                (typeof e.response?.data === "string" ? e.response?.data : null) ||
                e.message ||
                "Login failed";
            setServerError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const emailError = form.formState.errors.email?.message;
    const passwordError = form.formState.errors.password?.message;

    return (
        <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-2xl border bg-background p-6 shadow-sm">
                <div className="mb-6">
                    <h1 className="text-xl font-semibold">Login</h1>
                    <p className="text-sm text-muted-foreground">
                        Use your email and password.
                    </p>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            autoComplete="current-password"
                            {...form.register("password")}
                        />
                        {passwordError ? (
                            <p className="text-sm text-destructive">{passwordError}</p>
                        ) : null}
                    </div>

                    {serverError ? (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                            {serverError}
                        </div>
                    ) : null}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>

                    <p className="text-xs text-muted-foreground">
                        {/* Sign up */}
                        Don't have an account?{" "}
                        <a href="/signup" className="text-primary hover:underline">
                            Sign up
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}
