import React, { useState } from "react";
import { Menu, User, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink, useLocation, useNavigate } from "react-router";
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

const navigation = [
    { name: "Dashboard", href: "/dashboard", roles: ["admin"] },
    {
      name: "POS",
      href: "/pos",
      roles: ["admin", "cashier"],
    },
    { name: "Products", href: "/products", roles: ["admin"] },
    { name: "User", href: "/user", roles: ["admin"] },
  ];

export default function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileModal, setProfileModal] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

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
              <SheetTitle>
                <img src="/public/POSIMLOGO.png" alt="" className="w-40 h-10 object-cover"/>
              </SheetTitle>
              <Separator />
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
          <div 
          className="w-8 h-8 rounded-full border flex items-center justify-center bg-[#171717] relative cursor-pointer" 
          onClick={() => setProfileModal(!profileModal)}
          >
            <User size={18} className="text-white" />

            {profileModal && (
        <div className="border absolute top-10 right-0 p-2 flex flex-col items-center space-y-2 z-50 dark:bg-white/10 bg-black/10 backdrop-blur-md rounded">
          <button className="px-4 py-2 border rounded flex gap-1 text-white bg-[#032f30]">
            <User size={20} /> <span>Profile</span>
          </button>

          <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
            <DialogTrigger asChild>
              <button
                className="border px-4 py-2 rounded bg-red-500 flex items-center gap-2 text-white cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Logout</DialogTitle>
              </DialogHeader>
              <div className="p-2 space-y-3">
                <p>Are you sure you want to log out of this account?</p>
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    className="px-3 py-1 border rounded text-sm font-semibold cursor-pointer hover:bg-gray-100 transition duration-200"
                    onClick={() => setLogoutDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-red-600 text-white text-sm font-semibold cursor-pointer hover:bg-red-700 transition duration-200"
                    onClick={() => {
                      setLogoutDialogOpen(false);
                      setProfileModal(false);
                      handleLogout()
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
          </div>
          <span className="text-sm font-medium hidden md:block">
            {user.name}
          </span>

          <div className="px-4 py-1 text-xs text-white font-semibold border rounded-full bg-[#171717]">
            {user.role}
          </div>

          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
