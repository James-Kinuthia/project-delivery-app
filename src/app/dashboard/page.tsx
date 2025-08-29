"use client";

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  AlertTriangle,
  Badge,
  Building,
  Clock,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Users
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';

// Progress component (since it's missing from your imports)
const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div
      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

// Badge component
const BadgeComponent = ({ children, className, variant = "default" }: {
  children: React.ReactNode;
  className?: string;
  variant?: string;
}) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

// Mock authentication context
const useAuth = () => ({
  user: {
    firstName: 'John',
    roles: ['admin']
  },
  loading: false
});

const RBAC = {
  isAdmin: (user: any) => user?.roles?.includes('admin'),
  isManager: (user: any) => user?.roles?.includes('manager'),
  getHighestRole: (user: any) => {
    if (user?.roles?.includes('admin')) return 'admin';
    if (user?.roles?.includes('manager')) return 'manager';
    return 'user';
  }
};

// Chart data
const projectStatusData = [
  { status: 'Ongoing', count: 15, color: '#3B82F6' },
  { status: 'Completed', count: 55, color: '#10B981' },
  { status: 'Halted', count: 12, color: '#EF4444' },
  { status: 'Upcoming', count: 18, color: '#F59E0B' },
];

const expenditureTrendData = [
  { month: 'Jan', expenditure: 2.5 },
  { month: 'Feb', expenditure: 3.2 },
  { month: 'Mar', expenditure: 4.1 },
  { month: 'Apr', expenditure: 3.8 },
  { month: 'May', expenditure: 5.5 },
  { month: 'Jun', expenditure: 6.2 },
  { month: 'Jul', expenditure: 6.8 },
  { month: 'Aug', expenditure: 7.4 },
  { month: 'Sep', expenditure: 6.5 },
];

const projectSectorData = [
  { month: 'Jan', Infrastructure: 25, Education: 18, Agriculture: 12, ICT: 20 },
  { month: 'Feb', Infrastructure: 28, Education: 22, Agriculture: 15, ICT: 18 },
  { month: 'Mar', Infrastructure: 22, Education: 25, Agriculture: 18, ICT: 22 },
  { month: 'Apr', Infrastructure: 30, Education: 28, Agriculture: 20, ICT: 25 },
  { month: 'May', Infrastructure: 35, Education: 32, Agriculture: 25, ICT: 28 },
];

// Sample data for different roles
const sampleData = {
  admin: {
    stats: [
      { label: 'Total Users', value: 1247, change: '+12%', color: 'text-green-600' },
      { label: 'System Health', value: '99.9%', change: '+0.1%', color: 'text-green-600' },
      { label: 'Active Sessions', value: 89, change: '+5%', color: 'text-green-600' },
      { label: 'Storage Used', value: '67%', change: '+3%', color: 'text-yellow-600' },
    ],
    recentActivity: [
      { action: 'User registration spike', time: '2 hours ago', type: 'info' },
      { action: 'Database backup completed', time: '4 hours ago', type: 'success' },
      { action: 'Security scan finished', time: '6 hours ago', type: 'success' },
    ],
  },
  manager: {
    stats: [
      { label: 'Team Members', value: 12, change: '+2', color: 'text-green-600' },
      { label: 'Projects Active', value: 8, change: '+1', color: 'text-green-600' },
      { label: 'Tasks Completed', value: 156, change: '+23%', color: 'text-green-600' },
      { label: 'Budget Used', value: '73%', change: '+5%', color: 'text-yellow-600' },
    ],
    recentActivity: [
      { action: 'Project Alpha completed', time: '1 hour ago', type: 'success' },
      { action: 'New team member onboarded', time: '3 hours ago', type: 'info' },
      { action: 'Weekly report submitted', time: '1 day ago', type: 'info' },
    ],
  },
  user: {
    stats: [
      { label: 'Tasks Assigned', value: 5, change: '+2', color: 'text-green-600' },
      { label: 'Tasks Completed', value: 23, change: '+8', color: 'text-green-600' },
      { label: 'Hours Logged', value: 156, change: '+12%', color: 'text-green-600' },
      { label: 'Current Streak', value: 7, change: '+1', color: 'text-green-600' },
    ],
    recentActivity: [
      { action: 'Completed task: Review UI mockups', time: '30 mins ago', type: 'success' },
      { action: 'Started task: Implement user dashboard', time: '2 hours ago', type: 'info' },
      { action: 'Submitted timesheet', time: '1 day ago', type: 'info' },
    ],
  },
};

const projects = [
  {
    id: 1,
    name: "Upgrading of Meru Level 5 to 6",
    contractor: "ABC Construction",
    budget: "4,500,000 KSH",
    completion: 100,
    status: "completed"
  },
  {
    id: 2,
    name: "Road improvement project halted",
    contractor: "Road Masters Ltd",
    budget: "15,000,000",
    completion: 40,
    status: "halted"
  },
  {
    id: 3,
    name: "Water Borehole drilling",
    contractor: "AquaTech Solutions",
    budget: "Not set",
    completion: 0,
    status: "pending"
  },
  {
    id: 4,
    name: "Construction of ECD classes",
    contractor: "BuildPro Kenya",
    budget: "20,500,000",
    completion: 90,
    status: "ongoing"
  },
  {
    id: 5,
    name: "ICT hub Construction",
    contractor: "TechBuild Co",
    budget: "2,000,000",
    completion: 75,
    status: "ongoing"
  }
];

const recentActivities = [
  {
    title: "Upgrading of Meru Level 5 to 6",
    time: "22 Aug 10:15 AM",
    type: "completion"
  },
  {
    title: "Road improvement project halted",
    time: "18 July 11 PM",
    type: "alert"
  },
  {
    title: "Water Borehole drilling approved",
    time: "21 March 9:34 PM",
    type: "approval"
  },
  {
    title: "Construction of ECD classes",
    time: "16 April 2:00 AM",
    type: "update"
  }
];

// Chart Components
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ProjectsByStatusChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>Projects by Status</CardTitle>
      <CardDescription>Current portfolio distribution</CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={projectStatusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="status"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="count"
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const ExpenditureTrendChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>Expenditure Trend</CardTitle>
      <CardDescription>Budget utilization over time</CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={expenditureTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="expenditure"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#ffffff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const ProjectsBySectorChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>Projects by Sector</CardTitle>
      <CardDescription>Sector allocation of projects</CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={projectSectorData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            iconType="circle"
          />
          <Line
            type="monotone"
            dataKey="Infrastructure"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="Education"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="Agriculture"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="ICT"
            stroke="#EF4444"
            strokeWidth={2}
            dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const StatsCard = ({ stat }: { stat: any }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="flex items-center">
            <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
          </div>
        </div>
      </div>
      <div className="mt-1 flex items-baseline">
        <dd className="text-2xl font-semibold text-gray-900">{stat.value}</dd>
        <dd className={`ml-2 text-sm font-medium ${stat.color}`}>{stat.change}</dd>
      </div>
    </div>
  </div>
);

const ActivityFeed = ({ activities }: { activities: any[] }) => (
  <div className="bg-white shadow overflow-hidden sm:rounded-md">
    <div className="px-4 py-5 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
    </div>
    <ul className="divide-y divide-gray-200">
      {activities.map((activity, index) => (
        <li key={index} className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`flex-shrink-0 w-2 h-2 rounded-full mr-3 ${activity.type === 'success' ? 'bg-green-400' :
                activity.type === 'info' ? 'bg-blue-400' : 'bg-gray-400'
                }`} />
              <p className="text-sm text-gray-900">{activity.action}</p>
            </div>
            <div className="text-sm text-gray-500">{activity.time}</div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const QuickActions = ({ userRole }: { userRole: string }) => {
  const actions = {
    admin: [
      { label: 'Home', href: '/admin/home', color: 'bg-blue-600 hover:bg-blue-700' },
      { label: 'Projects', href: '/admin/projects', color: 'bg-blue-600 hover:bg-blue-700' },
      { label: 'Contractors', href: '/admin/contractors', color: 'bg-green-600 hover:bg-green-700' },
      { label: 'Notifications', href: '/admin/notifications', color: 'bg-purple-600 hover:bg-purple-700' },
      { label: 'Diary', href: '/admin/diary', color: 'bg-red-600 hover:bg-red-700' },
      { label: 'Settings', href: '/admin/settings', color: 'bg-red-600 hover:bg-red-700' },
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
        <div
          key={index}
          className={`${action.color} text-white rounded-lg p-4 text-center hover:shadow-lg transition-all cursor-pointer`}
        >
          {action.label}
        </div>
      ))}
    </>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800";
    case "ongoing": return "bg-blue-100 text-blue-800";
    case "halted": return "bg-red-100 text-red-800";
    case "pending": return "bg-yellow-100 text-yellow-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Role-specific panels
const AdminPanel = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900 mb-4">System Overview</h3>

    {/* Stats Cards */}
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          <Building className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">128</div>
          <div className="flex items-center text-xs text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            +12 new this quarter
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
          <Users className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">107</div>
          <div className="flex items-center text-xs text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            +8% completion rate vs last quarter
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Halted Projects</CardTitle>
          <AlertTriangle className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">11</div>
          <div className="flex items-center text-xs text-red-600">
            <TrendingDown className="h-4 w-4 mr-1" />
            +3 stalled this month
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenditure</CardTitle>
          <DollarSign className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">112.4M</div>
          <div className="flex items-center text-xs text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            78% budget utilization
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Charts Section */}
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
      <ProjectsByStatusChart />
      <ExpenditureTrendChart />
      <ProjectsBySectorChart />
    </div>

    {/* Projects Table and Recent Activities */}
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>● 30 done this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
              <div>PROJECT</div>
              <div>CONTRACTOR</div>
              <div>BUDGET</div>
              <div>COMPLETION</div>
              <div></div>
            </div>
            {projects.map((project) => (
              <div key={project.id} className="grid grid-cols-5 gap-4 items-center">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{project.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{project.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{project.contractor.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-500">{project.contractor}</span>
                </div>
                <div className="text-sm">{project.budget}</div>
                <div className="space-y-1">
                  <div className="text-sm">{project.completion}%</div>
                  <Progress value={project.completion} className="h-2" />
                </div>
                <div>
                  <BadgeComponent className={getStatusColor(project.status)} variant="secondary">
                    {project.status}
                  </BadgeComponent>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projects Overview</CardTitle>
          <CardDescription>📺 24% this month</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

const ManagerPanel = () => (
  <div>
    <h3 className="text-lg font-medium text-gray-900 mb-4">Team Performance</h3>
    <div className="space-y-4">
      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
        <span>Team Productivity</span>
        <span className="text-green-600">92%</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
        <span>Project Status</span>
        <span className="text-blue-600">On Track</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
        <span>Upcoming Deadlines</span>
        <span>3 this week</span>
      </div>
    </div>
  </div>
);

const UserPanel = () => (
  <div>
    <h3 className="text-lg font-medium text-gray-900 mb-4">My Progress</h3>
    <div className="space-y-4">
      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
        <span>Tasks Completed</span>
        <span className="text-green-600">8/10</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
        <span>Current Project</span>
        <span>Dashboard UI</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
        <span>Next Review</span>
        <span>In 2 days</span>
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      // Determine user role and set appropriate data
      let role = 'user';
      if (RBAC.isAdmin(user)) {
        role = 'admin';
      } else if (RBAC.isManager(user)) {
        role = 'manager';
      }
      setUserData(sampleData[role as keyof typeof sampleData]);
    }
  }, [user]);

  if (loading || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
        <p className="text-gray-600">Here&apos;s what&apos;s happening in your workspace</p>
      </div>

      {/* Role-Specific Panel */}
      <div className="bg-white shadow rounded-lg p-6">
        {RBAC.isAdmin(user) && (
          <AdminPanel />
        )}
        {RBAC.isManager(user) && !RBAC.isAdmin(user) && (
          <ManagerPanel />
        )}
        {!RBAC.isManager(user) && !RBAC.isAdmin(user) && (
          <UserPanel />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;