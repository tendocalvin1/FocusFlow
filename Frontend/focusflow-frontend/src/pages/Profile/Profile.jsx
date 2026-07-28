import { useAuth } from "@/context/AuthContext";

import {
    Mail,
    Award,
    Flame,
    Target,
    CheckCircle2,
    Clock3,
    Pencil,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar";

export default function Profile() {

    const { user } = useAuth();

    return (

        <div className="mx-auto max-w-6xl space-y-8">

            {/* Header */}

            <div>

                <h1 className="text-3xl font-bold">

                    Profile

                </h1>

                <p className="mt-2 text-slate-500">

                    Manage your account and productivity information.

                </p>

            </div>

            {/* Hero */}

            <Card className="rounded-3xl p-8">

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-6">

                        <Avatar className="h-24 w-24">

                            <AvatarFallback className="bg-slate-900 text-3xl text-white">

                                {user?.name
                                    ?.split(" ")
                                    .map(word => word[0])
                                    .join("")}

                            </AvatarFallback>

                        </Avatar>

                        <div>

                            <h2 className="text-3xl font-bold">

                                {user?.name}

                            </h2>

                            <p className="mt-2 text-slate-500">

                                {user?.role}

                            </p>

                            <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">

                                <Mail size={16} />

                                {user?.email}

                            </div>

                        </div>

                    </div>

                    <Button className="rounded-xl">

                        <Pencil className="mr-2 h-4 w-4" />

                        Edit Profile

                    </Button>

                </div>

            </Card>

            {/* Statistics */}

            <div>

                <h2 className="mb-4 text-xl font-semibold">

                    Productivity Statistics

                </h2>

                <div className="grid gap-6 md:grid-cols-4">

                    <Card className="rounded-2xl p-6">

                        <Flame className="mb-4 text-orange-500" />

                        <p className="text-3xl font-bold">

                            {user?.streak}

                        </p>

                        <p className="text-sm text-slate-500">

                            Day Streak

                        </p>

                    </Card>

                    <Card className="rounded-2xl p-6">

                        <Target className="mb-4 text-blue-500" />

                        <p className="text-3xl font-bold">

                            12

                        </p>

                        <p className="text-sm text-slate-500">

                            Goals Completed

                        </p>

                    </Card>

                    <Card className="rounded-2xl p-6">

                        <CheckCircle2 className="mb-4 text-green-500" />

                        <p className="text-3xl font-bold">

                            96

                        </p>

                        <p className="text-sm text-slate-500">

                            Tasks Finished

                        </p>

                    </Card>

                    <Card className="rounded-2xl p-6">

                        <Clock3 className="mb-4 text-purple-500" />

                        <p className="text-3xl font-bold">

                            148h

                        </p>

                        <p className="text-sm text-slate-500">

                            Focus Hours

                        </p>

                    </Card>

                </div>

            </div>

            {/* Achievements */}

            <Card className="rounded-3xl p-8">

                <h2 className="mb-6 text-xl font-semibold">

                    Achievements

                </h2>

                <div className="space-y-5">

                    <div className="flex items-center gap-4">

                        <Award className="text-yellow-500" />

                        <div>

                            <p className="font-semibold">

                                14 Day Streak

                            </p>

                            <p className="text-sm text-slate-500">

                                Stayed productive for two consecutive weeks.

                            </p>

                        </div>

                    </div>

                    <div className="flex items-center gap-4">

                        <Award className="text-green-500" />

                        <div>

                            <p className="font-semibold">

                                Goal Crusher

                            </p>

                            <p className="text-sm text-slate-500">

                                Completed 10 goals.

                            </p>

                        </div>

                    </div>

                    <div className="flex items-center gap-4">

                        <Award className="text-purple-500" />

                        <div>

                            <p className="font-semibold">

                                Focus Master

                            </p>

                            <p className="text-sm text-slate-500">

                                Logged over 100 focus hours.

                            </p>

                        </div>

                    </div>

                </div>

            </Card>

            {/* Account */}

            <Card className="rounded-3xl p-8">

                <h2 className="mb-6 text-xl font-semibold">

                    Account Information

                </h2>

                <div className="grid gap-6 md:grid-cols-2">

                    <div>

                        <p className="text-sm text-slate-500">

                            Email

                        </p>

                        <p className="font-medium">

                            {user?.email}

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">

                            Role

                        </p>

                        <p className="font-medium">

                            {user?.role}

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">

                            Member Since

                        </p>

                        <p className="font-medium">

                            July 2026

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">

                            Account Status

                        </p>

                        <p className="font-medium text-green-600">

                            Active

                        </p>

                    </div>

                </div>

            </Card>

        </div>

    );

}