import dayjs, { Dayjs } from 'dayjs';
import { DateTimeFormatConfig, DateTimeVariant } from './types';

/**
 * Utility class for datetime operations with unified config and variants.
 */
export class DateTimeUtils {
    private static DEFAULT_LANGUAGE = 'en-US';

    private static getDefaultTimeZone(): string {
        return dayjs.tz.guess();
    }

    /**
     * Normalize input into Dayjs.
     * - String without offset → interpret as UTC
     * - String with offset → keep as-is
     * - Date → keep as-is
     * - Dayjs → keep as-is
     */
    private static normalizeInput(input: string | Date | Dayjs): Dayjs {
        if (dayjs.isDayjs(input)) return input;

        if (typeof input === 'string') {
            // Check if string contains timezone offset (+hh:mm, -hh:mm, or Z)
            const hasOffset = /([Zz]|[+-]\d{2}:?\d{2})$/.test(input);
            return hasOffset ? dayjs(input) : dayjs.utc(input);
        }

        return dayjs(input); // Date
    }

    /**
     * Format a datetime using predefined variants or custom Intl options.
     */
    static format(
        input: string | Date | Dayjs,
        variant: DateTimeVariant = 'datetime-short',
        config?: DateTimeFormatConfig,
        options?: Intl.DateTimeFormatOptions,
    ): string {
        if (!input) return '';

        const date = this.normalizeInput(input);
        const language = config?.languageCode ?? this.DEFAULT_LANGUAGE;
        const tz = config?.timeZone ?? this.getDefaultTimeZone();

        if (variant === 'relative') {
            return this.formatRelative(date, language);
        }

        let intlOptions: Intl.DateTimeFormatOptions;

        switch (variant) {
            case 'date':
                intlOptions = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                };
                break;
            case 'datetime-short':
                intlOptions = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                };
                break;
            case 'datetime-long':
                intlOptions = { dateStyle: 'full', timeStyle: 'long' };
                break;
            case 'custom':
                intlOptions = {};
                break;
            default:
                intlOptions = {};
        }

        // Allow override
        intlOptions = { timeZone: tz, ...intlOptions, ...options };

        return new Intl.DateTimeFormat(language, intlOptions).format(
            date.toDate(),
        );
    }

    /**
     * Check if a UTC datetime has expired (is before now).
     */
    static isExpired(input: string | Date | Dayjs): boolean {
        const target = this.normalizeInput(input);
        const now = dayjs();
        return target.isBefore(now);
    }

    // ---- Private helpers ----
    private static formatRelative(date: Dayjs, language: string): string {
        const now = dayjs();
        const diffMs = date.diff(now);
        const isFuture = diffMs > 0;

        const absSec = Math.abs(diffMs / 1000);
        const absMin = absSec / 60;
        const absHour = absMin / 60;
        const absDay = absHour / 24;
        const absMonth = absDay / 30;
        const absYear = absDay / 365;

        const rtf = new Intl.RelativeTimeFormat(language, { style: 'long' });

        if (absSec < 60)
            return rtf.format(
                isFuture ? Math.round(absSec) : -Math.round(absSec),
                'second',
            );
        if (absMin < 60)
            return rtf.format(
                isFuture ? Math.round(absMin) : -Math.round(absMin),
                'minute',
            );
        if (absHour < 24)
            return rtf.format(
                isFuture ? Math.round(absHour) : -Math.round(absHour),
                'hour',
            );
        if (absDay < 30)
            return rtf.format(
                isFuture ? Math.round(absDay) : -Math.round(absDay),
                'day',
            );
        if (absMonth < 12)
            return rtf.format(
                isFuture ? Math.round(absMonth) : -Math.round(absMonth),
                'month',
            );

        return rtf.format(
            isFuture ? Math.round(absYear) : -Math.round(absYear),
            'year',
        );
    }
}
