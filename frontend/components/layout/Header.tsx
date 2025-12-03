"use client"

import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { CircleCheck, CircleX, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios-client";



export default function Header() {

    const [apiUp, setApiUp] = useState<boolean | null>(null);
    useEffect(() => {
        async function checkApi() {
            try {
                const response = await api.get("/isup");
                setApiUp(response.data.status === "UP");
            }catch (error) {
                console.error("API is down:", error);
                setApiUp(false);
            }
        }
        checkApi();

    }, []);


    
    return (
        <header className="w-full border-b bg-background/50 backdrop-blur-sm">
            <div className="mx-auto flex items-center justify-between py-4 px-6 max-w-7xl">

                <div className="flex items-baseline gap-4">
                    <h2 className="text-xl font-semibold">Gemini Translation App</h2>
                    <ApiStateBadge state={apiUp} />
                </div>

                <div className="flex items-center gap-4">
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}


function ApiStateBadge({ state }: { state: boolean | null }) {
    if (state === null) {
        return (
            <Badge variant="default">
                <Loader2 className="mr-1 h-4 w-4 animate-spin" strokeWidth={3} />
                Checking API...
            </Badge>
        );
    }

    if (state === true) {
        return (
            <Badge variant="default">
                <CircleCheck className="mr-1 h-4 w-4 text-green-500" strokeWidth={3} />
                API is up
            </Badge>
        );
    }

    return (
        <Badge variant="default">
            <CircleX className="mr-1 h-4 w-4 text-red-500" strokeWidth={3} />
            API is down
        </Badge>
    );
}
