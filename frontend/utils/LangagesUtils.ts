import { DirectionType } from "@/types/Direction";
import languages from "@/data/languages.json";

//get the text direction for a given language
export function getDirection(langName: string): DirectionType {
    const lang = languages.find((l) => l.name === langName);
    // default to ltr if not found or direction missing
    return (lang?.direction as DirectionType) || "ltr";
}

//get the placeholders for source and target textareas
export function getPlaceHolders(langName: string, isSource: boolean): string {
    const lang = languages.find((l) => l.name === langName);
    if (!lang) return isSource ? "Enter text to translate..." : "Translation will appear here...";

    return isSource
        ? lang.sourcePlaceholder || "Enter text to translate..."
        : lang.targetPlaceholder || "Translation will appear here...";
}

