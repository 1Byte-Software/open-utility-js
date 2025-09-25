/**
 * Configuration options for controlling date and time formatting behavior.
 *
 * This configuration allows you to specify a locale (`languageCode`)
 * and a time zone (`timeZone`) to ensure consistent formatting across the application.
 * It is especially useful when you want to enforce a common display format
 * for internationalized applications or shared utilities.
 */
export interface DateTimeFormatConfig {
    /**
     * A [BCP 47 language tag](https://www.rfc-editor.org/rfc/bcp/bcp47.txt)
     * that specifies the locale used for formatting.
     * Language tags are constructed from subtags defined in the
     * [IANA Language Subtag Registry](https://www.iana.org/assignments/language-subtag-registry).
     *
     * Examples:
     * - `"en-US"` → English (United States)
     * - `"fr-FR"` → French (France)
     * - `"ja-JP"` → Japanese (Japan)
     */
    languageCode?: string;

    /**
     * An [IANA time zone identifier](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
     * that specifies which time zone to apply when formatting.
     *
     * Examples:
     * - `"America/New_York"`
     * - `"Europe/Paris"`
     * - `"Asia/Tokyo"`
     */
    timeZone?: string;
}

/**
 * Predefined formatting variants to ensure consistency across the app.
 */
export type DateTimeVariant =
    | 'date'
    | 'datetime-short'
    | 'datetime-long'
    | 'relative'
    | 'custom';
