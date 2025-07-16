import { Outlet } from "@remix-run/react";
import ProtectedRoute from "~/components/ProtectedRoute";

export default function Route() {
  return <Outlet />;
}
