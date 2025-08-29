// types/project.ts

export type ProjectData = {
    projectName: string;
    contractorName: string;
    contractorCompany: string;
    ward: string;
    startDate: string; // ISO date string (YYYY-MM-DD)
    endDate: string;   // ISO date string (YYYY-MM-DD)
    projectImage?: File | string | null; // File object for upload, string for URL if editing
};

// If you have a response type from your API after creating/updating a project
export type ProjectResponse = {
    id: string;
    projectName: string;
    contractorName: string;
    contractorCompany: string;
    ward: string;
    startDate: string;
    endDate: string;
    imageUrl?: string; // The URL of the uploaded image
    createdAt: string;
    updatedAt: string;
};