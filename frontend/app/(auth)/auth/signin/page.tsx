"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/features/components/shared/Logo";

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
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-ring"
            />
        </div>
    );
}

async function loginUser(values: LoginValues) {
    console.log({ email: values.email });
}

export default function Login() {
    const [values, setValues] = useState<LoginValues>(initialValues);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await loginUser(values);
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="flex min-h-screen flex-col p-6">
            <Logo />

            <div className="flex flex-1 items-center justify-center py-10">
                <div className="w-full max-w-md">
                    <h3 className="text-3xl font-semibold text-foreground">
                        Welcome back
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                        Log in to your account to continue.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
                        <Field
                            label="Email"
                            name="email"
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />

                        <Field
                            label="Password"
                            name="password"
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />

                        {error && (
                            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full"
                        >
                            {loading ? "Logging in..." : "Log in"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/signup"
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