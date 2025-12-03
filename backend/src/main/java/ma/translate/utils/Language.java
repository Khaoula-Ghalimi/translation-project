package ma.translate.utils;
public enum Language {

    ARABIC("ar-XA", "Arabic"),
    BENGALI("bn-IN", "Bengali"),
    BULGARIAN("bg-BG", "Bulgarian"), // Not in Gemini → closest BCP47
    CATALAN("ca-ES", "Catalan"),     // Not in Gemini → fallback to Google TTS standard
    CHINESE("zh-CN", "Chinese (Mandarin)"),
    CROATIAN("hr-HR", "Croatian"),   // Not in Gemini → closest proper code
    CZECH("cs-CZ", "Czech"),
    DANISH("da-DK", "Danish"),
    DUTCH("nl-NL", "Dutch"),
    ENGLISH("en-US", "English"),
    ESTONIAN("et-EE", "Estonian"),   // Not in Gemini → standard code
    FINNISH("fi-FI", "Finnish"),
    FRENCH("fr-FR", "French"),
    GERMAN("de-DE", "German"),
    GREEK("el-GR", "Greek"),         // Not in Gemini → closest
    HEBREW("he-IL", "Hebrew"),       // Not officially supported → closest
    HINDI("hi-IN", "Hindi"),
    HUNGARIAN("hu-HU", "Hungarian"), // Not in Gemini → fallback
    INDONESIAN("id-ID", "Indonesian"),
    ITALIAN("it-IT", "Italian"),
    JAPANESE("ja-JP", "Japanese"),
    KOREAN("ko-KR", "Korean"),
    LATVIAN("lv-LV", "Latvian"),     // Not in Gemini → fallback
    LITHUANIAN("lt-LT", "Lithuanian"), // Not in Gemini → fallback
    MALAY("ms-MY", "Malay"),
    MOROCCAN_DARIJA("ar-XA", "Moroccan Darija (Fallback)"),
    NORWEGIAN("no-NO", "Norwegian"),
    POLISH("pl-PL", "Polish"),
    PORTUGUESE("pt-PT", "Portuguese"),
    ROMANIAN("ro-RO", "Romanian"),   // Not in Gemini → fallback
    RUSSIAN("ru-RU", "Russian"),
    SLOVAK("sk-SK", "Slovak"),
    SLOVENIAN("sl-SI", "Slovenian"), // Not in Gemini → fallback
    SPANISH("es-ES", "Spanish"),
    SWEDISH("sv-SE", "Swedish"),
    THAI("th-TH", "Thai"),
    TURKISH("tr-TR", "Turkish"),
    UKRAINIAN("uk-UA", "Ukrainian"), // Not in Gemini → fallback
    URDU("ur-PK", "Urdu"),           // Not fully supported → fallback
    VIETNAMESE("vi-VN", "Vietnamese");

    private final String code;
    private final String displayValue;

    Language(String code, String displayValue) {
        this.code = code;
        this.displayValue = displayValue;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayValue() {
        return displayValue;
    }

    public static Language fromCode(String code) {
        for (Language lang : values()) {
            if (lang.code.equalsIgnoreCase(code)) {
                return lang;
            }
        }
        return null;
    }
}
