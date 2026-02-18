import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Calendar,
  Home,
  Briefcase,
  ShieldCheck,
} from "lucide-react";
import logo from "../utils/Suash_Logo.png";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/auth/login";
    switch (user.role) {
      case "admin":
        return "/admin";
      case "staff":
        return "/staff";
      default:
        return "/account";
    }
  };

  const getDashboardIcon = () => {
    if (!user) return <User className="w-4 h-4" />;
    switch (user.role) {
      case "admin":
        return <ShieldCheck className="w-4 h-4" />;
      case "staff":
        return <Briefcase className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const navigationItems = [
    { name: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
    {
      name: "Services",
      href: "/services",
      icon: <Settings className="w-4 h-4" />,
    },
    {
      name: "Book Service",
      href: "/book",
      icon: <Calendar className="w-4 h-4" />,
    },
    { name: "Blog", href: "/blog", icon: <Settings className="w-4 h-4" /> },
    { name: "FAQ", href: "/faq", icon: <Settings className="w-4 h-4" /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <img
                src="../../public/Suash_Logo.png"
                alt="SUASH Logo"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="text-xl font-bold font-heading text-gray-900">
                SUASH
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-emerald-600 capitalize">
                      {user?.role}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to={getDashboardLink()}
                      className="w-full flex items-center"
                    >
                      {getDashboardIcon()}
                      <span className="ml-2">Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/account/profile"
                      className="w-full flex items-center"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="ml-2">Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="ml-2">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Button variant="ghost" asChild>
                  <Link to="/auth/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth/register">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">S</span>
                      </div>
                      <span className="text-xl font-bold font-heading text-gray-900">
                        SUASH
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive(item.href)
                            ? "text-emerald-600 bg-emerald-50"
                            : "text-gray-700 hover:text-emerald-600 hover:bg-gray-50"
                        }`}
                      >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    ))}

                    <div className="pt-4 border-t border-gray-200">
                      {isAuthenticated ? (
                        <div className="space-y-2">
                          <div className="px-4 py-2">
                            <p className="text-sm font-medium text-gray-900">
                              {user?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user?.email}
                            </p>
                            <p className="text-xs text-emerald-600 capitalize">
                              {user?.role}
                            </p>
                          </div>
                          <Link
                            to={getDashboardLink()}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                          >
                            {getDashboardIcon()}
                            <span className="font-medium">Dashboard</span>
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <LogOut className="w-4 h-4" />
                            <span className="font-medium">Log out</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            asChild
                          >
                            <Link
                              to="/auth/login"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Sign In
                            </Link>
                          </Button>
                          <Button className="w-full" asChild>
                            <Link
                              to="/auth/register"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Get Started
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
