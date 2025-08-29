"use client";

import ProjectForm from "@/components/forms/ProjectForm";

const NewProjectPage = () => {
    const handleProjectCreated = (newProject: any) => {
        console.log("New project created:", newProject);
        // You might want to redirect the user or show a success message
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <ProjectForm onSubmitSuccess={handleProjectCreated} />
        </div>
    );
};

export default NewProjectPage;