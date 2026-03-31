import React from "react";
import { Navigate } from "react-router-dom";
import Dashboard from "../Screens/Admin/Dashboard";
import Login from "../Screens/Auth/Login";
import SignUp from "../Screens/Auth/SignUp";
import Client from "../Screens/Admin/Client";
import Membership from "../Screens/Admin/Membership";

const userRoutes = [
  { path: "/admin/dashboard", component: <Dashboard /> },

  // this route should be at the end of all other routes
  {
    path: "/admin/",
    exact: true,
    component: <Navigate to="/admin/dashboard" />,
  },
  { path: "/admin/client", component: <Client /> },
  { path: "/admin/membership", component: <Membership /> },
];

const authRoutes = [
  { path: "/", component: <Login /> },
  { path: "/sign-up", component: <SignUp /> },
];

export { userRoutes, authRoutes };
