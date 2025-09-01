import React from "react";
import { Sun, Moon, Menu, User, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <header className="h-12 border-b px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="h-8 w-8 p-0" onClick={onToggleSidebar}>
          <Menu size={18} />
        </button>

        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border flex items-center justify-center bg-[#171717]">
            <User size={18} className="text-white" />
          </div>
          <span className="text-sm font-medium hidden md:block">
            {user.name}
          </span>

          <div className="px-4 py-1 text-xs text-white font-semibold border rounded-full bg-[#171717]">
            {user.role}
          </div>

          {/* <button 
                className="px-4 py-1 text-xs text-white font-semibold border rounded-full bg-red-500 cursor-pointer"
                onClick={handleLogout}
                >
                    Logout
                </button> */}
          <Tooltip>
            <TooltipTrigger>
              <button onClick={handleLogout} className="cursor-pointer">
                <div className="border py-1 px-4 rounded-full bg-red-500">
                  <LogOut size={16} className="text-white" />
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>

          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
