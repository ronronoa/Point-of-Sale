import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Menu, User, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink, useLocation, useNavigate } from "react-router";
import { Separator } from "@/components/ui/separator";
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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";

const navigation = [
  { name: "Dashboard", href: "/dashboard", roles: ["admin"] },
  { name: "POS", href: "/pos", roles: ["admin", "cashier"] },
  { name: "Products", href: "/products", roles: ["admin"] },
  { name: "User", href: "/user", roles: ["admin"] },
];

export default function Header({ onToggleSidebar }) {
  const { user, logout, updateUserData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileModal, setProfileModal] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    address: user?.address || "",
    username: user?.username || "",
  });
  
  useEffect(() => {
    setProfileData({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      address: user?.address || "",
      username: user?.username || "",
    })
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!user || !user.user_id) {
    toast.error("No user selected or missing user ID.");
    return;
  }
  console.log("Current user from context:", user);
    try {
      const userId = user.id ?? user.user_id;

      if (!userId) {
        toast.error("Unable to determine user id for update.");
        return;
      }

      const payload = { username: profileData.username };

      const res = await axios.put(
        `http://localhost:5000/api/users/update-username/${userId}`,
        payload
      );

      updateUserData({ username: profileData.username });
      toast.success("Profile updated successfully!");
      setProfileDialogOpen(false);
      setProfileModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(user.role)
  );

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
                <img
                  src="/public/posimlogo.png"
                  alt=""
                  className="w-40 h-10 object-cover"
                />
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
          <div className="relative" ref={dropdownRef}>
            <div
              className="w-8 h-8 rounded-full border flex items-center justify-center bg-[#171717] cursor-pointer"
              onClick={() => setProfileModal(!profileModal)}
            >
              <User size={18} className="text-white" />
            </div>

            {profileModal && (
              <div className="border absolute top-10 right-0 p-2 flex flex-col items-center space-y-2 z-50 dark:bg-white/10 bg-black/10 backdrop-blur-md rounded">
                <button
                  className="border px-4 py-2 rounded bg-[#032122] flex items-center gap-2 text-white cursor-pointer hover:bg-[#000101] transition"
                  onClick={() => {
                    setProfileDialogOpen(true);
                    setProfileModal(false);
                  }}
                >
                  <User size={20} /> <span>Profile</span>
                </button>

                <button
                  className="border px-4 py-2 rounded bg-red-500 flex items-center gap-2 text-white cursor-pointer"
                  onClick={() => {
                    setLogoutDialogOpen(true);
                    setProfileModal(false);
                  }}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
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

      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleProfileUpdate}
            className="space-y-3 mt-2"
          >
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                name="username"
                value={profileData.username}
                onChange={handleInputChange}
                required
                placeholder="Enter new username"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setProfileDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Logout</DialogTitle>
          </DialogHeader>
          <div className="p-2 space-y-3">
            <p>Are you sure you want to log out of this account?</p>
            <div className="flex justify-end gap-2 mt-3">
              <Button
                variant="outline"
                onClick={() => setLogoutDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white"
                onClick={() => {
                  setLogoutDialogOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}