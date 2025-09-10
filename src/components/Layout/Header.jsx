import React from "react";
import { Menu, User, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink, useLocation, useNavigate } from "react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navigation = [
    { name: "Dashboard", href: "/dashboard", roles: ["admin"] },
    {
      name: "POS",
      href: "/pos",
      roles: ["admin", "cashier"],
    },
    { name: "Products", href: "/products", roles: ["admin"] },
    { name: "Reports", href: "/reports", roles: ["admin"] },
    { name: "User", href: "/add-user", roles: ["admin"] },
  ];

export default function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredNavigation = navigation.filter((item) => {
    return item.roles.includes(user.role);
  });

  return (
    <header className="h-12 border-b px-6 flex items-center justify-between">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button className="h-8 w-8 p-0">
              <Menu size={18} />
            </button>
          </SheetTrigger>

          <SheetContent side="left" className="w-52">
            <SheetHeader>
              <SheetTitle>MRN POS</SheetTitle>
            </SheetHeader>
            <ul className="space-y-2 p-2">
              {filteredNavigation.map((item) => {
                const isActive = location.pathname === item.href;

                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={`flex items-center p-3 rounded-md text-sm font-medium transition-colors group relative
                                  ${
                                    isActive
                                      ? "bg-primary text-primary-foreground"
                                      : "hover:bg-muted"
                                  }`}
                    >
                      <p>{item.name}</p>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="h-8 w-8 p-0 hidden md:block"
          onClick={onToggleSidebar}
        >
          <Menu size={18} />
        </button>

        <div className="text-xs md:text-sm text-muted-foreground">
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
