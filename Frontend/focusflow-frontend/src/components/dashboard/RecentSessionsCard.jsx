import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sessions = [
    {
        id: 1,
        title: "Deep Work",
        duration: "45 min",
        date: "Today",
    },
    {
        id: 2,
        title: "Reading",
        duration: "30 min",
        date: "Yesterday",
    },
    {
        id: 3,
        title: "Coding",
        duration: "60 min",
        date: "Monday",
    },
];

export default function RecentSessionsCard() {
    return (
        <Card className="rounded-2xl shadow-sm">

            <CardHeader>
                <CardTitle>
                    Recent Sessions
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

                {sessions.map((session) => (

                    <div
                        key={session.id}
                        className="flex items-center justify-between rounded-xl border p-3 hover:bg-slate-50"
                    >

                        <div>

                            <p className="font-medium">
                                {session.title}
                            </p>

                            <p className="text-sm text-slate-500">
                                {session.date}
                            </p>

                        </div>

                        <span className="font-semibold">
                            {session.duration}
                        </span>

                    </div>

                ))}

            </CardContent>

        </Card>
    );
}