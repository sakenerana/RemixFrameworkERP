import { Navigate, Outlet, useLocation, useNavigate } from "@remix-run/react";
import { useAuth } from "~/auth/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    // Redirect to login, preserving the location they came from
    return navigate("/");
  }

  return <Outlet />;
  // return <>{children}</>;
}
// import { useAuth } from '~/auth/AuthContext';
// import { Navigate, Outlet } from 'react-router-dom';
// import { Spin } from 'antd';
// import { useEffect } from 'react';

// export const ProtectedRoute = () => {
//   const { user, loading } = useAuth();

//   useEffect(() => {
//     console.log("user", user);
//   })

//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <Spin />
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   return <Outlet />;
// };

// export const PublicRoute = () => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <Spin />
//       </div>
//     );
//   }

//   if (user) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return <Outlet />;
// };