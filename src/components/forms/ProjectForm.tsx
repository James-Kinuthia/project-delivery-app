// components/forms/ProjectForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// Utility function for conditional class names (if you don't have it)
// lib/utils.ts
// import { type ClassValue, clsx } from "clsx"
// import { twMerge } from "tailwind-merge"
// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

const projectFormSchema = z.object({
    id: z.number().optional(), // Added for update operations
    projectName: z.string().min(2, { message: "Project name must be at least 2 characters." }),
    contractorName: z.string().min(2, { message: "Contractor name must be at least 2 characters." }),
    contractorCompany: z.string().optional(),
    ward: z.string().optional(),
    startDate: z.date().optional().nullable(),
    endDate: z.date().optional().nullable(),
    imageUrl: z.string().url({ message: "Invalid URL" }).optional().or(z.literal("")),
    completion: z.number().min(0).max(100).optional().default(0),
    status: z.enum(["ongoing", "completed", "halted", "pending"]).optional().default("pending"),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
    initialData?: ProjectFormValues | null;
    onSubmitSuccess: (data: ProjectFormValues) => void;
}

const ProjectForm = ({ initialData, onSubmitSuccess }: ProjectFormProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: initialData || {
            projectName: "",
            contractorName: "",
            contractorCompany: "",
            ward: "",
            startDate: undefined,
            endDate: undefined,
            imageUrl: "",
            completion: 0,
            status: "pending",
        },
        mode: "onChange",
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                ...initialData,
                // Convert string dates from API to Date objects for react-hook-form
                startDate: initialData.startDate ? new Date(initialData.startDate) : undefined,
                endDate: initialData.endDate ? new Date(initialData.endDate) : undefined,
            });
        }
    }, [initialData, form]);

    const onSubmit = async (values: ProjectFormValues) => {
        setLoading(true);
        try {
            const method = values.id ? "PUT" : "POST";
            const url = values.id ? `/api/projects/${values.id}` : "/api/projects";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            onSubmitSuccess(result);
            router.push("/dashboard"); // Redirect to dashboard or projects list
        } catch (error) {
            console.error("Error submitting project:", error);
            // You might want to display an error message to the user
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{initialData ? "Edit Project" : "Create New Project"}</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="projectName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Construct new bridge" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contractorName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contractor Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contractorCompany"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contractor Company</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., BuildIt Inc." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ward"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ward/Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Central Ward" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Start Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value || undefined}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>End Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value || undefined}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL (Optional)</FormLabel>
                                    <FormControl>
                                        <Input type="url" placeholder="e.g., https://example.com/project.jpg" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="completion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Completion (%)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select project status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="ongoing">Ongoing</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="halted">Halted</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {initialData ? "Update Project" : "Create Project"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default ProjectForm;