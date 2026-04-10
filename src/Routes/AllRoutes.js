import React from "react";
import { Navigate } from "react-router-dom";
import Dashboard from "../Screens/Admin/Dashboard";
import Login from "../Screens/Auth/Login";
import SignUp from "../Screens/Auth/SignUp";
import Master from "../Screens/Admin/Master";
import Report from "../Screens/Admin/Report";

const userRoutes = [
  { path: "/admin/dashboard", component: <Dashboard /> },

  // this route should be at the end of all other routes
  { path: "/admin/", exact: true, component: <Navigate to="/admin/dashboard" /> },
  { path: "/admin/data", component: <Master /> },
  { path: "/admin/report", component: <Report /> },
];

const authRoutes = [
  { path: "/", component: <Login /> },
  { path: "/sign-up", component: <SignUp /> },
];

export { userRoutes, authRoutes };
