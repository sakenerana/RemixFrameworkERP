import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { useAuth } from "~/auth/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login");
        } 
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="flex flex-col items-center">
                    <svg
                        className="animate-spin h-8 w-8 text-indigo-600 mb-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        />
                    </svg>
                    <p className="text-gray-600 text-sm">Checking authentication...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
