import languages from "@/data/languages.json";

export type TranslationResponseType = {
    translatedText: string;
    score: number; // 0–1
    sourceAudio?: Blob;
    targetAudio?: Blob;
    alternatives?: AlternativeType[];
    meanings: string[];
    suggestedLanguage: Language;
};

export type AlternativeType = {
    alternativeText: string;
    score: number; // 0–1
    id_meaning: number; // corresponds to meanings[index]
    audio?: Blob;
};




export const LanguageEnum = Object.freeze(
    Object.fromEntries(languages.map(l => [
        l.name
            .replace(/\([^)]*\)/g, "")     // remove parentheses
            .replace(/[^a-zA-Z ]/g, "")    // remove weird chars
            .replace(/\s+/g, "")           // remove spaces
            .replace(/^[a-z]/, c => c.toUpperCase()), // PascalCase
        l.name
    ]))
);
export type Language = typeof languages[number]["name"];

