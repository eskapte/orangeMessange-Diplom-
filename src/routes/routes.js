import React from "react";
import { Redirect, Link } from "react-router-dom";

// lazy load all the views
const Dashboard = React.lazy(() => import("../pages/dashboard/index"));
// import Dashboard from "../pages/dashboard/index";
const StarterPage = React.lazy(() => import("../pages/StarterPage/index"));

// auth
const Login = React.lazy(() => import("../pages/Auth/Login"));
const Logout = React.lazy(() => import("../pages/Auth/Logout"));
const ForgetPassword = React.lazy(() => import("../pages/Auth/ForgetPassword"));
const Register = React.lazy(() => import("../pages/Auth/Register"));
const LockScreen = React.lazy(() => import("../pages/Auth/LockScreen"));

// My pages
const WelcomePage = React.lazy(() => import("../pages/WelcomePage"));
const AuthPage = React.lazy(() => import("../pages/AuthPage"));
const RegPage = React.lazy(() => import("../pages/RegPage"));

// declare all routes
const authProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/pages-starter", component: StarterPage },

  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/dashboard"/>,
  },
];

const publicRoutes = [
  { path: "/logout", component: Logout },
  // { path: "/login", component: Login },
  { path: "/login", component: AuthPage},
  { path: "/registration", component: RegPage},
  { path: "/forget-password", component: ForgetPassword },
  // { path: "/register", component: Register },
  { path: "/lock-screen", component: LockScreen},
  { path: "/welcome", component: WelcomePage},
];

const routes = [...authProtectedRoutes, ...publicRoutes];

export { authProtectedRoutes, publicRoutes, routes};
