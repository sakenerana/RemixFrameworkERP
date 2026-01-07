import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
  }, [navigate]);

  return null; // or a loading spinner
}
