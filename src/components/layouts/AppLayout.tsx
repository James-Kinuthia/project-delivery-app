"use client";

import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, Sidebar, SidebarTrigger } from "@/components/ui/sidebar";

import { usePathname } from "next/navigation";
import { AppSidebar } from "./AppSidebar";

interface AppLayoutProps {
    children: React.ReactNode;
}

// Define routes that should not show the sidebar
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/'];

export function AppLayout({ children }: AppLayoutProps) {
    const { user, isLoading } = useAuth();
    const pathname = usePathname();

    // Show loading state while auth is being determined
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Check if current route should show sidebar
    const shouldShowSidebar = user && !PUBLIC_ROUTES.includes(pathname);

    if (!shouldShowSidebar) {
        // Render without sidebar for public routes or unauthenticated users
        return (
            <main className="h-screen overflow-y-auto">
                {children}
            </main>
        );
    }

    // Render with sidebar for authenticated users on protected routes
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                <AppSidebar />
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4">
                        <SidebarTrigger className="mb-4" />
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}