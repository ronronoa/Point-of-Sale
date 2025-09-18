import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  ShoppingCart,
  User,
} from "lucide-react";
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink, useLocation } from "react-router";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin"] },
  {
    name: "POS",
    href: "/pos",
    icon: ShoppingCart,
    roles: ["admin", "cashier"],
  },
  { name: "Products", href: "/products", icon: Package, roles: ["admin"] },
  { name: "Reports", href: "/reports", icon: BarChart3, roles: ["admin"] },
  { name: "User", href: "/add-user", icon: User, roles: ["admin"]}
];

export default function Sidebar({ collapsed, onCollapsedChange }) {
  const { user } = useAuth();
  const location = useLocation()

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <div
      className={`border-r hidden md:flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 border-b flex items-center justify-between">
        {/* {!collapsed && <h1 className="text-lg font-semibold">ROPOS</h1>} */}

        {/* {!collapsed && <img src="/public/RonixLogo.png" alt="Logo" className="w-10 h-10"/>} */}

        <button
          className="p-2 hover:bg-gray-100 dark:hover:bg-[#1e1e1e] transiton duration-200 rounded cursor-pointer"
          onClick={() => onCollapsedChange(!collapsed)}
        >
          <ChevronRight size={18} className={`transition duration-300 ${!collapsed ? '-rotate-180' : 'rotate-0'}`}/>
        </button>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
            {filteredNavigation.map((item) => {
                const isActive = location.pathname === item.href

                return (
                    <li key={item.name}>
                       <NavLink
                       to={item.href}
                       className={`flex items-center p-2 rounded-md text-sm font-medium transition-colors group relative
                                  ${isActive ? 'bg-[#032f30] text-white' : 'hover:bg-muted'}`}
                       >
                          <item.icon className={`h-4 w-4 ${collapsed ? "" : "mr-3"}`}/>
                          {!collapsed && item.name}

                        {collapsed && (
                          <div className="absolute left-full bg-zinc-900 dark:bg-gray-100 rounded-md px-2 py-1 ml-6 invisible group-hover:visible -translate-x-3 group-hover:translate-x-0 
                                        text-white text-x dark:text-black border opacity-20 group-hover:opacity-100 transition-all duration-300 z-50">
                            {item.name}
                          </div>
                        )}
                       </NavLink>
                    </li>
                )
            })}
        </ul>
      </nav>
    </div>
  );
}
