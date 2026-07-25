import { Search, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "focusflow-frontend/src/components/ui/avatar";


function Navbar() {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-8">

            {/* Search */}

            <div className="relative w-96">

                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                />

            </div>

            {/* Right Section */}

            <div className="flex items-center gap-6">

                <button className="relative rounded-xl p-2 transition hover:bg-slate-100">

                    <Bell size={20} />

                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>

                </button>

                <div className="flex items-center gap-3">

                    <Avatar>

                        <AvatarFallback className="bg-slate-900 text-white">
                            TC
                        </AvatarFallback>

                    </Avatar>

                    <div>

                        <p className="text-sm font-semibold">
                            Tendo Calvin
                        </p>

                        <p className="text-xs text-slate-500">
                            Software Engineer
                        </p>

                    </div>

                </div>

            </div>

        </header>
    );
}

export default Navbar;