import {
  CheckCircle2,
  Target,
  Clock3,
  Flame,
} from "lucide-react";

import StatCard from "./StatCard";

function StatsGrid() {
  const stats = [
    {
      title: "Today's Tasks",
      value: 8,
      icon: CheckCircle2,
      color: "bg-blue-100",
    },
    {
      title: "Goals",
      value: 3,
      icon: Target,
      color: "bg-green-100",
    },
    {
      title: "Focus Time",
      value: "4h 20m",
      icon: Clock3,
      color: "bg-orange-100",
    },
    {
      title: "Current Streak",
      value: "14 Days",
      icon: Flame,
      color: "bg-red-100",
    },
  ];

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </section>
  );
}

export default StatsGrid;