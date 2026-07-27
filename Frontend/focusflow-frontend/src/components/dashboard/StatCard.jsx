import { Card, CardContent } from "@/components/ui/card";

function StatCard({
  title,
  value,
  icon: Icon,
  color = "bg-slate-100",
}) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm transition hover:shadow-md">
      <CardContent className="flex items-center justify-between p-6">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}
        >
          <Icon className="h-7 w-7 text-slate-800" />
        </div>

      </CardContent>
    </Card>
  );
}

export default StatCard;