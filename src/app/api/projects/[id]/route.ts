// app/api/projects/[id]/route.ts
import { db } from '@/db';
import { projects } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

interface ProjectParams {
    id: string;
}

// GET a single project
export async function GET(req: Request, { params }: { params: ProjectParams }) {
    try {
        const projectId = parseInt(params.id);
        if (isNaN(projectId)) {
            return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
        }

        const project = await db.query.projects.findFirst({
            where: eq(projects.id, projectId),
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

// PUT (update) a project
export async function PUT(req: Request, { params }: { params: ProjectParams }) {
    try {
        const projectId = parseInt(params.id);
        if (isNaN(projectId)) {
            return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
        }

        const body = await req.json();
        const { projectName, contractorName, contractorCompany, ward, startDate, endDate, imageUrl, completion, status } = body;

        const updatedProject = await db.update(projects)
            .set({
                projectName,
                contractorName,
                contractorCompany,
                ward,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                imageUrl,
                completion,
                status,
                updatedAt: new Date(),
            })
            .where(eq(projects.id, projectId))
            .returning();

        if (updatedProject.length === 0) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(updatedProject[0]);
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

// DELETE a project
export async function DELETE(req: Request, { params }: { params: ProjectParams }) {
    try {
        const projectId = parseInt(params.id);
        if (isNaN(projectId)) {
            return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
        }

        const deletedProject = await db.delete(projects)
            .where(eq(projects.id, projectId))
            .returning();

        if (deletedProject.length === 0) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}