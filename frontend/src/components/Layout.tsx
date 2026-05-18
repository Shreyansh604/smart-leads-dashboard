import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-blue-600">Smart Leads</h1>
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
              {isAdmin ? "Admin" : "Sales"}
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Hey, <span className="font-medium">{user?.name}</span>
            </span>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-600 dark:text-gray-300"
            >
              {isDark ? "☀️ Light" : "🌙 Dark"}
            </button>

            <button
              onClick={handleLogout}
              className="text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition font-medium"
            >
              Logout
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden flex flex-col gap-1.5 p-2"
          >
            <span className={`block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="sm:hidden mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Hey, <span className="font-medium">{user?.name}</span>
            </span>
            <button
              onClick={toggleTheme}
              className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 w-full text-left"
            >
              {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-100 transition font-medium w-full text-left"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
};

export default Layout;