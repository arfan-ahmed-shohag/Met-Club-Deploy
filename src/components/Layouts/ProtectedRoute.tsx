import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const location = useLocation();
    const token = localStorage.getItem("token");

    if (!token) {
        const loginPath = location.pathname.startsWith("/en/") ? "/en/login" : "/login";
        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }
    return children;
};

export default ProtectedRoute;
