// Centralized definition of navigation menu items to avoid circular dependencies
// between MainLayout and Header.
// Each item includes a text label, MUI icon, path, authorized roles, and grouping label.
import {
  Dashboard,
  ViewKanban,
  Assignment,
  AdminPanelSettings,
  People,
  Groups,
  Handshake,
  Report,
  LibraryBooks,
  Settings,
  Help,
} from "@mui/icons-material";

export const menuItems = [
  // Core Navigation
  {
    text: "Dashboard",
    icon: <Dashboard />,
    path: "/dashboard",
    roles: ["all"],
    group: "Core",
  },
  {
    text: "Task Board",
    icon: <ViewKanban />,
    path: "/board",
    roles: ["all"],
    group: "Core",
  },

  // Management Section
  {
    text: "Programs",
    icon: <Assignment />,
    path: "/programs",
    roles: ["program_manager", "supervisor"],
    group: "Management",
  },
  {
    text: "Roles & Permissions",
    icon: <AdminPanelSettings />,
    path: "/roles",
    roles: ["program_manager"],
    group: "Management",
  },
  {
    text: "Team Members",
    icon: <People />,
    path: "/team-members",
    roles: ["program_manager", "supervisor"],
    group: "Management",
  },
  {
    text: "Road Safety Actors",
    icon: <Groups />,
    path: "/road-safety-actors",
    roles: ["program_manager"],
    group: "Management",
  },
  {
    text: "Stakeholders",
    icon: <Handshake />,
    path: "/stakeholders",
    roles: ["program_manager"],
    group: "Management",
  },

  // Reporting & Resources
  {
    text: "Reporting",
    icon: <Report />,
    path: "/reporting",
    roles: ["supervisor", "team_lead"],
    group: "Operations",
  },
  {
    text: "Approvals",
    icon: <ViewKanban />,
    path: "/approvals",
    roles: ["supervisor", "team_lead", "regional_manager"],
    group: "Operations",
  },
  {
    text: "Resource Centre",
    icon: <LibraryBooks />,
    path: "/resource-centre",
    roles: ["all"],
    group: "Operations",
  },

  // User & System
  {
    text: "Settings",
    icon: <Settings />,
    path: "/settings",
    roles: ["all"],
    group: "System",
  },
  {
    text: "Help & Support",
    icon: <Help />,
    path: "/help",
    roles: ["all"],
    group: "System",
  },
];
