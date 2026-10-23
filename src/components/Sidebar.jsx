import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ScanLine,
  History,
  Activity,
  User,
  LogOut,
  Eye
} from "lucide-react";

function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Eye size={22} />
        </div>

        <span>
          Ocular<span>AI</span>
        </span>
      </div>

      <div className="sidebar-menu">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/screening"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <ScanLine size={20} />
          New Screening
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <History size={20} />
          Analysis History
        </NavLink>

        <NavLink
          to="/diseases"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <Activity size={20} />
          Diseases
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <User size={20} />
          Profile
        </NavLink>

      </div>

      <button
        className="logout-button"
        onClick={handleLogout}
      >
        <LogOut size={20} />
        Logout
      </button>

    </aside>
  );
}

export default Sidebar;