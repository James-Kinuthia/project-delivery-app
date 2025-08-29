import { AlertTriangle, Building, DollarSign, DollarSignIcon, TrendingDown, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";


const AdminDashboard = () => {
    const statusData = [
        { name: "Ongoing", value: 45, color: "#3b82f6" },
        { name: "Completed", value: 60, color: "#10b981" },
        { name: "Halted", value: 15, color: "#ef4444" },
        { name: "Upcoming", value: 25, color: "#f59e0b" }
    ];

    const expenditureData = [
        { month: "Jan", value: 2.5 },
        { month: "Feb", value: 3.2 },
        { month: "Mar", value: 4.1 },
        { month: "Apr", value: 3.8 },
        { month: "May", value: 5.2 },
        { month: "Jun", value: 6.1 },
        { month: "Jul", value: 6.8 },
        { month: "Aug", value: 7.2 },
        { month: "Sep", value: 6.9 }
    ];

    const sectorData = [
        { month: "Infrastructure", value: 25 },
        { month: "Education", value: 18 },
        { month: "Agriculture", value: 30 },
        { month: "ICT", value: 20 }
    ];

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "bg-dashboard-success/10 text-dashboard-success";
            case "ongoing": return "bg-dashboard-accent/10 text-dashboard-accent";
            case "halted": return "bg-dashboard-danger/10 text-dashboard-danger";
            case "pending": return "bg-dashboard-warning/10 text-dashboard-warning";
            default: return "bg-secondary text-secondary-foreground";
        }
    };


    return (
        <div className="flex-1 space-y-6 p-6">
            <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with your projects.</p>
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">128</div>
                        <div className="flex items-center text-xs text-dashboard-success">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            +12 new this quarter
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">107</div>
                        <div className="flex items-center text-xs text-dashboard-success">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            +8% completion rate vs last quarter
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Halted Projects</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">11</div>
                        <div className="flex items-center text-xs text-dashboard-danger">
                            <TrendingDown className="h-4 w-4 mr-1" />
                            +3 stalled this month
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenditure</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">112.4M</div>
                        <div className="flex items-center text-xs text-dashboard-success">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            78% budget utilization
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AdminDashboard;