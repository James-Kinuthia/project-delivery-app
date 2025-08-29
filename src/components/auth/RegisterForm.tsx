"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RegisterData } from "@/types/auth"; // Make sure this path is correct

// Define the validation schema using Zod
const registerSchema = z.object({
    firstName: z.string().min(1, { message: "First Name is required" }),
    lastName: z.string().min(1, { message: "Last Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const RegisterForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError: setFormError, // Alias to avoid conflict with local setError
    } = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerSchema),
    });

    const [apiError, setApiError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const onSubmit = async (data: RegisterFormInputs) => {
        setApiError(null);
        setSuccess(null);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data), // `data` already contains firstName, lastName, email, password
            });

            if (!res.ok) {
                const errorData = await res.json();
                // Check if the error message is specific (e.g., from your API validation)
                if (errorData.message) {
                    setApiError(errorData.message);
                } else {
                    setApiError("Registration failed. Please try again.");
                }
                throw new Error(errorData.message || "Registration failed");
            }

            setSuccess("Registration successful! Redirecting to dashboard...");
            // Optionally, you might want to wait a bit before redirecting
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1500); // Redirect after 1.5 seconds
        } catch (err: any) {
            console.error("Client-side registration error:", err);
            // If the error was already set by `setApiError`, we don't need to do it again
            if (!apiError) {
                setApiError(err.message || "An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {apiError && <p className="text-red-600 text-sm mb-2">{apiError}</p>}
                {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        {...register("firstName")}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.firstName.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        {...register("lastName")}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.lastName.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        {...register("email")}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...register("password")}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
                >
                    {isSubmitting ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;