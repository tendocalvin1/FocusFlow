import { Card, CardContent } from "@/components/ui/card";

function AnalyticsCard({
    title,
    value,
    subtitle,
    icon,
}) {
    return (
        <Card className="rounded-2xl shadow-sm border-slate-200 hover:shadow-md transition">

            <CardContent className="p-6">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-sm text-slate-500">
                            {title}
                        </p>

                        <h2 className="mt-2 text-3xl font-bold">
                            {value}
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                            {subtitle}
                        </p>

                    </div>

                    <div className="rounded-xl bg-slate-100 p-3">
                        {icon}
                    </div>

                </div>

            </CardContent>

        </Card>
    );
}

export default AnalyticsCard;