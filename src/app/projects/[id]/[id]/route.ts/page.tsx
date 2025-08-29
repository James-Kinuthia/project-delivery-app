import ProjectForm from "@/components/forms/ProjectForm";

interface EditProjectPageProps {
    params: {
        id: string;
    };
}

const EditProjectPage = async ({ params }: EditProjectPageProps) => {
    const projectId = params.id;

    // In a real application, you'd fetch the project data from your API
    // const project = await fetch(`/api/projects/${projectId}`).then(res => res.json());

    // Mock initial data for demonstration
    const initialProjectData = {
        id: projectId,
        projectName: "Old Project Name",
        contractorName: "Old Contractor",
        contractorCompany: "Old Co.",
        ward: "Ward 1",
        startDate: "2023-01-15",
        endDate: "2023-12-31",
        imageUrl: "https://via.placeholder.com/150/0000FF/FFFFFF?text=Existing+Image", // Example existing image URL
    };

    const handleProjectUpdated = (updatedProject: any) => {
        console.log("Project updated:", updatedProject);
        // You might want to refresh data, show success, or redirect
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <ProjectForm initialData={initialProjectData} onSubmitSuccess={handleProjectUpdated} />
        </div>
    );
};

export default EditProjectPage;