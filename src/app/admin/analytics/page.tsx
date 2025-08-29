"use client";

import React from 'react';
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

// TypeScript interfaces for data structures
interface ProjectStatusData {
    status: string;
    count: number;
    color: string;
}

interface ExpenditureTrendData {
    month: string;
    expenditure: number;
}

interface ProjectSectorData {
    month: string;
    Infrastructure: number;
    Education: number;
    Agriculture: number;
    ICT: number;
}

interface TooltipPayload {
    color: string;
    dataKey: string;
    value: number | string;
    payload?: any;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
}

// Dummy data matching your dashboard
const projectStatusData: ProjectStatusData[] = [
    { status: 'Ongoing', count: 15, color: '#3B82F6' },
    { status: 'Completed', count: 55, color: '#10B981' },
    { status: 'Halted', count: 12, color: '#EF4444' },
    { status: 'Upcoming', count: 18, color: '#F59E0B' },
];

const expenditureTrendData: ExpenditureTrendData[] = [
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

const projectSectorData: ProjectSectorData[] = [
    { month: 'Jan', Infrastructure: 25, Education: 18, Agriculture: 12, ICT: 20 },
    { month: 'Feb', Infrastructure: 28, Education: 22, Agriculture: 15, ICT: 18 },
    { month: 'Mar', Infrastructure: 22, Education: 25, Agriculture: 18, ICT: 22 },
    { month: 'Apr', Infrastructure: 30, Education: 28, Agriculture: 20, ICT: 25 },
    { month: 'May', Infrastructure: 35, Education: 32, Agriculture: 25, ICT: 28 },
];

// Custom tooltip components
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="text-sm font-medium text-gray-900">{`${label}`}</p>
                {payload.map((entry: TooltipPayload, index: number) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {`${entry.dataKey}: ${entry.value}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// Individual Chart Components
const ProjectsByStatusChart: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Projects by Status</h3>
            <p className="text-sm text-gray-600 mb-4">Current portfolio distribution</p>

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

            <div className="flex items-center text-sm text-gray-500 mt-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>updated today</span>
            </div>
        </div>
    );
};

const ExpenditureTrendChart: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Expenditure Trend</h3>
            <p className="text-sm text-gray-600 mb-4">Budget utilization over time</p>

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

            <div className="flex items-center text-sm text-gray-500 mt-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                <span>last updated this month</span>
            </div>
        </div>
    );
};

const ProjectsBySectorChart: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Projects by Sector</h3>
            <p className="text-sm text-gray-600 mb-4">Sector allocation of projects</p>

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

            <div className="flex items-center text-sm text-gray-500 mt-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span>just updated</span>
            </div>
        </div>
    );
};




const AnalyticsPage = () => {
  return (
      <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Project Dashboard Charts</h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                      <ProjectsByStatusChart />
                  </div>

                  <div className="lg:col-span-1">
                      <ExpenditureTrendChart />
                  </div>

                  <div className="lg:col-span-2 xl:col-span-1">
                      <ProjectsBySectorChart />
                  </div>
              </div>

              {/* Integration Guide */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-blue-900 mb-3">Integration with Drizzle ORM & Next.js</h2>
                  <div className="text-sm text-blue-800 space-y-2">
                      <p><strong>1. Data Fetching:</strong> Replace dummy data with your Drizzle queries</p>
                      <p><strong>2. Server Components:</strong> Fetch data in server components and pass as props</p>
                      <p><strong>3. Real-time Updates:</strong> Use React Query or SWR for real-time data updates</p>
                      <p><strong>4. TypeScript:</strong> The interfaces are already defined for type safety</p>
                  </div>
              </div>
          </div>
      </div>
  )
}

export default AnalyticsPage;