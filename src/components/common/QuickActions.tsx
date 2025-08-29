import { Link } from "lucide-react";

const QuickActions = ({ userRole }: { userRole: string }) => {
    const actions = {
        admin: [
            { label: 'Manage Users', href: '/admin/users', color: 'bg-blue-600 hover:bg-blue-700' },
            { label: 'System Settings', href: '/admin/settings', color: 'bg-green-600 hover:bg-green-700' },
            { label: 'View Analytics', href: '/analytics', color: 'bg-purple-600 hover:bg-purple-700' },
            { label: 'Manage Roles', href: '/admin/roles', color: 'bg-red-600 hover:bg-red-700' },
        ],
        manager: [
            { label: 'Team Overview', href: '/team', color: 'bg-blue-600 hover:bg-blue-700' },
            { label: 'Project Status', href: '/projects', color: 'bg-green-600 hover:bg-green-700' },
            { label: 'View Reports', href: '/reports', color: 'bg-purple-600 hover:bg-purple-700' },
            { label: 'Schedule Meeting', href: '/calendar', color: 'bg-yellow-600 hover:bg-yellow-700' },
        ],
        user: [
            { label: 'View Tasks', href: '/tasks', color: 'bg-blue-600 hover:bg-blue-700' },
            { label: 'Time Tracking', href: '/time', color: 'bg-green-600 hover:bg-green-700' },
            { label: 'My Projects', href: '/my-projects', color: 'bg-purple-600 hover:bg-purple-700' },
            { label: 'Submit Report', href: '/reports/new', color: 'bg-indigo-600 hover:bg-indigo-700' },
        ],
    }[userRole] || [];

    return (
        <>
            {actions.map((action, index) => (
                <Link
                    key={index}
                    href={action.href}
                    className={`${action.color} text-white rounded-lg p-4 text-center hover:shadow-lg transition-all`}
                >
                    {action.label}
                </Link>
            ))}
        </>
    );
};