import QuickActions from "../../components/dashboard/QuickActions";
import FocusTimerCard from "../../components/dashboard/FocusTimerCard";
import RecentSessionsCard from "../../components/dashboard/RecentSessionsCard";
import TaskListCard from "../../components/dashboard/TaskListCard";
import StatsGrid from "../../components/dashboard/StatsGrid";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import GoalProgressCard from "@/components/dashboard/GoalProgressCard";

function Dashboard() {
    return (
        <>
            <DashboardHeader />

            {/* Top Analytics Cards */}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                {/* Your AnalyticsCard components */}

            </div>

            {/* Second Row */}

           <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <TaskListCard />

                <GoalProgressCard />
                

            </div> 

            <div className="mt-6 grid gap-6 lg:grid-cols-2">

                <FocusTimerCard />

                <RecentSessionsCard />

            </div>

            <div className="mt-6">

                <QuickActions />

            </div>

            <div className="space-y-8">

                <DashboardHeader />

                <StatsGrid />

    
            </div>

        </>
    );
}

export default Dashboard;