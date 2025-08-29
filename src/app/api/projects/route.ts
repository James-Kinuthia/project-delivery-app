// app/api/projects/route.ts
import { db } from '@/db';
import { projects } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

// GET all projects
export async function GET() {
    try {
        const allProjects = await db.query.projects.findMany();
        return NextResponse.json(allProjects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

// POST a new project
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { projectName, contractorName, contractorCompany, ward, startDate, endDate, imageUrl, completion, status } = body;

        if (!projectName || !contractorName) {
            return NextResponse.json({ error: 'Project name and contractor name are required' }, { status: 400 });
        }

        const newProject = await db.insert(projects).values({
            projectName,
            contractorName,
            contractorCompany,
            ward,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            imageUrl,
            completion,
            status,
        }).returning(); // Use .returning() to get the inserted data

        return NextResponse.json(newProject[0], { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}