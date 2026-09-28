"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/app/components/shared/Logo";
import { useApiCall } from "@/hooks/useApiCall";
import { APIENDPOINT } from "@/config/Backend";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type LoginValues = {
    email: string;
    password: string;
};

const initialValues: LoginValues = {
    email: "",
    password: "",
};

type FieldProps = {
    label: string;
    name: keyof LoginValues;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    autoComplete?: string;
    placeholder?: string;
};

function Field({
    label,
    name,
    type = "text",
    value,
    onChange,
    autoComplete,
    placeholder,
}: FieldProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={name} className="text-sm font-medium text-foreground">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                placeholder={placeholder}
                required
                className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
        </div>
    );
}

export default function Login() {
    const [values, setValues] = useState<LoginValues>(initialValues);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { makeApiCall } = useApiCall();
    const router = useRouter();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        const payload = { ...values };

        setLoading(true);
        try {
            const res = await makeApiCall("POST", APIENDPOINT.Login, payload);
            if (res.success) {
                toast.success(res.message);
                router.push("/dashboard/home");
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(
                err instanceof Error ? err.message : "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="flex min-h-screen flex-col p-6">
            <header className="pb-6">
                <Logo />
            </header>

            <div className="flex flex-1 justify-center pb-10 pt-2 sm:pt-8">
                <div className="w-full max-w-md">
                    <h3 className="text-3xl font-semibold text-foreground">
                        Welcome back
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                        Log in to your account to continue.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                        <Field
                            label="Email"
                            name="email"
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            autoComplete="email"
                            placeholder="you@example.com"
                        />

                        <Field
                            label="Password"
                            name="password"
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            placeholder="Enter your password"
                        />

                        <div className="flex justify-end">
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm font-medium text-muted underline underline-offset-4 hover:text-foreground"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {error && (
                            <p role="alert" className="text-sm text-red-500">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Logging in..." : "Log in"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/auth/signup"
                            className="font-medium text-foreground underline underline-offset-4"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}