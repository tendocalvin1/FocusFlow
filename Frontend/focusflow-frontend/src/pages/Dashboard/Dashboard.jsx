import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AnalyticsCard from "@/components/dashboard/AnalyticsCard";

import {
    CheckCircle,
    Target,
    Timer,
    Flame,
} from "lucide-react";

function Dashboard() {

    return (

        <>

            <DashboardHeader />

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                <AnalyticsCard
                    title="Today's Tasks"
                    value="8"
                    subtitle="2 completed"
                    icon={<CheckCircle />}
                />

                <AnalyticsCard
                    title="Goals"
                    value="4"
                    subtitle="1 completed"
                    icon={<Target />}
                />

                <AnalyticsCard
                    title="Focus Time"
                    value="3h 20m"
                    subtitle="Today's total"
                    icon={<Timer />}
                />

                <AnalyticsCard
                    title="Current Streak"
                    value="14"
                    subtitle="Keep it going!"
                    icon={<Flame />}
                />

            </div>

        </>

    );
}

export default Dashboard;