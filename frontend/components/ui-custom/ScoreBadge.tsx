import { Badge } from "../ui/badge";

export default function ScoreBadge(score: number, label = "Score") {
    const percentage = Math.round(score * 100);

    let colorClasses = "bg-red-600 dark:bg-red-500"; // default = bad

    if (score >= 0.85) {
        colorClasses = "bg-green-600 dark:bg-green-400"; // good
    } else if (score >= 0.5) {
        colorClasses = "bg-amber-500 dark:bg-amber-400"; // medium / orange
    }

    return (
        <Badge variant="default" className={colorClasses}>
            {label}: {percentage}%
        </Badge>
    );
}