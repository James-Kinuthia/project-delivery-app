"use client";

import { useState } from "react";

const RegisterForm = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Registration failed");
            }

            setSuccess("Registration successful! Redirecting...");
            // redirect or auto-login
            window.location.href="/dashboard";
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="border p-2 rounded"
            />
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="border p-2 rounded"
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border p-2 rounded"
            />
            <input
                type="password"
                placeholder="Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border p-2 rounded"
            />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded">
                Register
            </button>
        </form>
    );
};

export default RegisterForm;
