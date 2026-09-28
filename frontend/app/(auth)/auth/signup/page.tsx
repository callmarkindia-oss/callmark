"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/app/components/shared/Logo";
import { useApiCall } from "@/hooks/useApiCall";
import { APIENDPOINT } from "@/config/Backend";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type SignupValues = {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const initialValues: SignupValues = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
};

type FieldProps = {
    label: string;
    name: keyof SignupValues;
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

export default function Signup() {
    const [values, setValues] = useState<SignupValues>(initialValues);
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

        if (values.password !== values.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const payload = {
            fname: values.firstName,
            lname: values.lastName,
            phoneNumber: values.phone,
            email: values.email,
            password: values.password,
        };

        setLoading(true);

        try {
            const res = await makeApiCall("POST", APIENDPOINT.SignUp, payload);

            if (res.success) {
                toast.success(res.message);
                router.push("/auth/signin");
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
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
                        Create an account
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                        Enter your details to get started.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field
                                label="First name"
                                name="firstName"
                                value={values.firstName}
                                onChange={handleChange}
                                autoComplete="given-name"
                                placeholder="John"
                            />
                            <Field
                                label="Last name"
                                name="lastName"
                                value={values.lastName}
                                onChange={handleChange}
                                autoComplete="family-name"
                                placeholder="Doe"
                            />
                        </div>

                        <Field
                            label="Phone number"
                            name="phone"
                            type="tel"
                            value={values.phone}
                            onChange={handleChange}
                            autoComplete="tel"
                            placeholder="+91 98765 43210"
                        />

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
                            autoComplete="new-password"
                            placeholder="At least 8 characters"
                        />

                        <Field
                            label="Confirm password"
                            name="confirmPassword"
                            type="password"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            placeholder="Re-enter your password"
                        />

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
                            {loading ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted">
                        Already have an account?{" "}
                        <Link
                            href="/auth/signin"
                            className="font-medium text-foreground underline underline-offset-4"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}