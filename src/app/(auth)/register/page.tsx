"use client";

import Register from "@/components/auth/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";
import { HardHat } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";


const RegisterPage = () => {
    const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const { login } = useAuth();
      const router = useRouter();
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          await login(email, password);
          router.push('/dashboard');
        } catch (error) {
          console.error('Registration failed:', error);
        }
      };
    
      return (
        <div className="grid min-h-svh overflow-hidden lg:grid-cols-2">
          <div className="flex flex-col gap-4 p-6 md:p-10">
            <div className="flex justify-center gap-2 md:justify-start">
              <a href="#" className="flex items-center gap-2 font-medium">
                <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                  <HardHat className="size-8 font-bold" />
                </div>
                Project Delivery System
              </a>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <div className="w-full max-w-md">
                <Register />
              </div>
            </div>
          </div>
          <div className="bg-muted relative hidden lg:block">
            <img
              src="/placeholder.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </div>
      );
};

export default RegisterPage;