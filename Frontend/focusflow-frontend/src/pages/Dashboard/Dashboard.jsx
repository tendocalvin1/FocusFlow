import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsGrid from "@/components/dashboard/StatsGrid";
import ProductivityInsights from "@/components/dashboard/ProductivityInsights";
import WeeklyActivityChart from "@/components/dashboard/WeeklyActivityChart";
import AchievementStreakCard from "@/components/dashboard/AchievementStreakCard";
import UpcomingDeadlines from "@/components/dashboard/UpcomingDeadlines";
import TaskListCard from "@/components/dashboard/TaskListCard";
import GoalProgressCard from "@/components/dashboard/GoalProgressCard";
import FocusTimerCard from "@/components/dashboard/FocusTimerCard";
import RecentSessionsCard from "@/components/dashboard/RecentSessionsCard";
import QuickActions from "@/components/dashboard/QuickActions";
import TodaysGoals from "@/components/dashboard/TodaysGoals";

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Top Welcome Header */}
      <DashboardHeader />

      {/* Primary KPI Stats Grid */}
      <StatsGrid />

      {/* AI Productivity Insights */}
      <ProductivityInsights />

      {/* Row 2: Weekly Activity Chart + Achievement & Streak Card */}
      <div className="grid gap-6 lg:grid-cols-2">
        <WeeklyActivityChart />
        <AchievementStreakCard />
      </div>

      {/* Row 3: Today's Tasks + Goal Progress */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TaskListCard />
        <GoalProgressCard />
      </div>

      {/* Row 4: Focus Timer + Recent Focus Sessions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <FocusTimerCard />
        <RecentSessionsCard />
      </div>

      {/* Row 5: Upcoming Deadlines + Today's Goals */}
      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingDeadlines />
        <TodaysGoals />
      </div>

      {/* Quick Action Dock */}
      <QuickActions />
    </div>
  );
}