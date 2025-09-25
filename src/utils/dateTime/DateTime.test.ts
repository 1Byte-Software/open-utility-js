import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { DateTimeFormatConfig } from './types';
import { DateTimeUtils } from './DateTime';

dayjs.extend(utc);
dayjs.extend(timezone);

describe('DateTimeUtils', () => {
    const SAMPLE_DATE = '2023-08-28T23:57:23Z'; // UTC ISO string

    describe('format()', () => {
        it("should format date with variant = 'date'", () => {
            const result = DateTimeUtils.format(SAMPLE_DATE, 'date', {
                languageCode: 'en-US',
                timeZone: 'UTC',
            });
            expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/); // e.g. 08/28/2023
        });

        it("should format datetime with variant = 'datetime-short'", () => {
            const result = DateTimeUtils.format(SAMPLE_DATE, 'datetime-short', {
                languageCode: 'en-US',
                timeZone: 'UTC',
            });
            expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{1,2}:\d{2}/);
        });

        it("should format datetime with variant = 'datetime-long'", () => {
            const result = DateTimeUtils.format(SAMPLE_DATE, 'datetime-long', {
                languageCode: 'en-US',
                timeZone: 'UTC',
            });
            expect(typeof result).toBe('string');
            expect(result.length).toBeGreaterThan(10);
        });

        it("should format datetime with variant = 'relative' (past)", () => {
            const pastDate = dayjs().subtract(2, 'days');
            const result = DateTimeUtils.format(pastDate, 'relative', {
                languageCode: 'en-US',
            });
            expect(result).toContain('ago');
        });

        it("should format datetime with variant = 'custom' and override options", () => {
            const config: DateTimeFormatConfig = {
                languageCode: 'en-GB',
                timeZone: 'UTC',
            };
            const result = DateTimeUtils.format(SAMPLE_DATE, 'custom', config, {
                weekday: 'long',
            });
            expect(['Monday', 'Tuesday']).toContain(result);
        });

        it('should normalize string without offset as UTC', () => {
            const noOffset = '2023-08-28T23:57:23'; // no Z, no +hh:mm
            const result = DateTimeUtils.format(noOffset, 'datetime-short', {
                languageCode: 'en-US',
                timeZone: 'UTC',
            });
            expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
        });

        it('should accept Dayjs as input', () => {
            const d = dayjs(SAMPLE_DATE);
            const result = DateTimeUtils.format(d, 'date', {
                languageCode: 'en-US',
                timeZone: 'UTC',
            });
            expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
        });
    });

    describe('isExpired()', () => {
        it('should return true for past dates', () => {
            const past = dayjs().subtract(1, 'day');
            expect(DateTimeUtils.isExpired(past)).toBe(true);
        });

        it('should return false for future dates', () => {
            const future = dayjs().add(1, 'day');
            expect(DateTimeUtils.isExpired(future)).toBe(false);
        });
    });
});
