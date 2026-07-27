import StatsGrid from "../../components/dashboard/StatsGrid";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";
import GoalProgressCard from "@/components/dashboard/GoalProgressCard";
import FocusTimerCard from "@/components/dashboard/FocusTimerCard";

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

                <GoalProgressCard />

                <FocusTimerCard />

            </div> 


            <div className="space-y-8">

                <DashboardHeader />

                <StatsGrid />

    
            </div>

        </>
    );
}

export default Dashboard;