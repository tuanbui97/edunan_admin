import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import DashboardLayout from "./pages/DashboardLayout";
import SchoolDashboard from "./pages/SchoolDashboard";
import PrincipalDashboard from "./pages/PrincipalDashboard";
import CreateSuggestion from "./pages/CreateSuggestion";
import MySuggestions from "./pages/MySuggestions";
import DepartmentLeaderDashboard from "./pages/DepartmentLeaderDashboard";
import SpecialistDashboard from "./pages/SpecialistDashboard";
import OfficeDashboard from "./pages/OfficeDashboard";
import DirectorDashboard from "./pages/DirectorDashboard";
import SuggestionDetail from "./pages/SuggestionDetail";
import Statistics from "./pages/Statistics";
import FAQ from "./pages/FAQ";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    element: <DashboardLayout />,
    children: [
      // School routes
      { path: "/school", Component: SchoolDashboard },
      { path: "/principal", Component: PrincipalDashboard },
      { path: "/create-suggestion", Component: CreateSuggestion },
      { path: "/my-suggestions", Component: MySuggestions },
      
      // Department Leader routes
      { path: "/department-leader", Component: DepartmentLeaderDashboard },
      
      // Specialist routes
      { path: "/specialist", Component: SpecialistDashboard },
      
      // Office routes
      { path: "/office", Component: OfficeDashboard },
      
      // Director routes
      { path: "/director", Component: DirectorDashboard },
      
      // Shared routes
      { path: "/suggestion/:id", Component: SuggestionDetail },
      { path: "/statistics", Component: Statistics },
      { path: "/faq", Component: FAQ },
    ],
  },
]);