// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../store/auth";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    if (!isAuthenticated()) {
        console.warn("[ProtectedRoute] access denied, redirect to /login", {
            from: location.pathname,
        });
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return children;
}
