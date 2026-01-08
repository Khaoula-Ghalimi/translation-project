"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";


export default function LogoutButton() {
    const logout = () => {
        // Kill the Basic auth cookie
        document.cookie = "auth_basic=; path=/; max-age=0";

        // Optional: remove cached user info
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_basic");

        // Hard redirect so proxy.ts re-runs
        window.location.href = "/login";
    };

    return (
        <Button variant="ghost" onClick={logout}>
            {/* lucide icon for logout */}
            <LogOut className="w-4 h-4" />

        </Button>
    );
}
