import { Volume2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Tooltip } from "../ui/tooltip";
import { TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";

type AlternativeBadgeProps = {
    text: string;
    score: number;
    onClick?: () => void;
};

export default function AlternativeBadge({ text, score, onClick }: AlternativeBadgeProps) {
    const percentage = Math.round(score * 100);

    let bg = "bg-red-100 dark:bg-red-900/30";
    let textColor = "text-red-700 dark:text-red-300";
    let border = "border-red-700 dark:border-red-300";

    if (score >= 0.85) {
        bg = "bg-green-100 dark:bg-green-900/30";
        textColor = "text-green-700 dark:text-green-300";
        border = "border-green-700 dark:border-green-300";
    } else if (score >= 0.5) {
        bg = "bg-amber-100 dark:bg-amber-900/30";
        textColor = "text-amber-700 dark:text-amber-300";
        border = "border-amber-700 dark:border-amber-300";
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Badge
                    variant="secondary"
                    onClick={onClick}
                    className={`border ${bg} ${textColor} ${border} font-medium cursor-pointer px-3 py-1`}
                >
                    {text} 
                    <Volume2 className="inline-block ml-2 w-4 h-4" />
                </Badge>
            </TooltipTrigger>

            <TooltipContent>
                <div className="flex gap-5 items-center text-xs">
                    <p>Confidence Score:</p>
                    <p>{percentage}%</p>
                </div>
            </TooltipContent>
        </Tooltip>
    );
}
