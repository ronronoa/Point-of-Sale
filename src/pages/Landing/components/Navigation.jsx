import React from "react";
import { HomeIcon } from "lucide-react";
import { NavLink } from "react-router";
import { Users, Phone } from "lucide-react";
import ThemeToggle from "../../../components/Layout/ThemeToggle";

export default function Navigation() {
  const navigation = [
    { name: "Home", link: "#home", icon: <HomeIcon size={20} /> },
    { name: "About Us", link: "#about", icon: <Users size={20} /> },
  ];
  return (
    <div>
      <div className="flex items-center justify-between border fixed top-0 w-full border-b-gray-300 p-4 z-10 backdrop-blur-md">
        <div className="flex">
          <img src="/posimlogo.png" alt="" className="w-40 object-cover h-10" />
        </div>
        <header className="flex gap-2">
          {navigation.map((nav) => (
            <a
              key={nav.name}
              href={nav.link}
              onClick={(e) => {
                e.preventDefault();
                const section = document.querySelector(nav.link);
                if (!section) return;

                const inner = section.querySelector('.max-w-3xl') || section;
                inner.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className={`flex items-center p-2 gap-1 rounded-md text-sm font-medium transition-colors duration-200
                            hover:bg-[#032f30] hover:text-white`}
            >
              {nav.icon} <span className="text-sm">{nav.name}</span>
            </a>
          ))}
        </header>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <NavLink
            to="/login"
            className="border py-1 px-4 font-semibold rounded-full bg-gradient-to-br from-[#032f30] to-[#036c6e] text-white cursor-pointer hover:scale-105 transition duration-200"
          >
            Login
          </NavLink>
        </div>
      </div>
    </div>
  );
}
