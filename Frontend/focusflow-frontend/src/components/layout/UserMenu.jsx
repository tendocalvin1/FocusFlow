import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

export default function UserMenu() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  function handleLogout() {
    logout();

    navigate("/login");
  }

  return (
    <div
      className="relative"
      ref={menuRef}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-100"
      >
        <Avatar>

          <AvatarFallback className="bg-slate-900 text-white">

            {user?.name
              ?.split(" ")
              .map((word) => word[0])
              .join("")}

          </AvatarFallback>

        </Avatar>

        <div className="hidden text-left md:block">

          <p className="text-sm font-semibold">

            {user?.name}

          </p>

          <p className="text-xs text-slate-500">

            {user?.role}

          </p>

        </div>

        <ChevronDown
          size={16}
          className={`transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 rounded-2xl border bg-white shadow-xl">

          <div className="border-b p-5">

            <p className="font-semibold">

              {user?.name}

            </p>

            <p className="mt-1 text-sm text-slate-500">

              {user?.email}

            </p>

          </div>

          <button
            onClick={() => {
              navigate("/profile");
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 px-5 py-3 text-sm hover:bg-slate-50"
          >
            <User size={18} />

            My Profile

          </button>

          <button
            onClick={() => {
              navigate("/settings");
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 px-5 py-3 text-sm hover:bg-slate-50"
          >
            <Settings size={18} />

            Settings

          </button>

          <hr />

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />

            Logout

          </button>

        </div>
      )}
    </div>
  );
}