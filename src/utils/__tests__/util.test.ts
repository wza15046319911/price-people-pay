import { describe, expect, it } from '@jest/globals';
import { calculateAverages } from '../util';

describe('calculateAverages', () => {
    it('should return zero values for empty records', () => {
        const result = calculateAverages([]);
        expect(result).toEqual({
            avgKm: 0,
            avgAge: { years: 0, months: 0 }
        });
    });

    it('should calculate correct averages for single record', () => {
        const currentYear = new Date().getFullYear();
        const records = [{
            odometer: '50000',
            year: currentYear - 2
        }];

        const result = calculateAverages(records);
        expect(result).toEqual({
            avgKm: 50000,
            avgAge: { years: 2, months: 0 }
        });
    });

    it('should handle comma-separated odometer values', () => {
        const currentYear = new Date().getFullYear();
        const records = [{
            odometer: '50,000',
            year: currentYear - 1
        }];

        const result = calculateAverages(records);
        expect(result).toEqual({
            avgKm: 50000,
            avgAge: { years: 1, months: 0 }
        });
    });

    it('should calculate correct averages for multiple records', () => {
        const currentYear = new Date().getFullYear();
        const records = [
            {
                odometer: '50000',
                year: currentYear - 2
            },
            {
                odometer: '30000',
                year: currentYear - 1
            }
        ];

        const result = calculateAverages(records);
        expect(result).toEqual({
            avgKm: 40000,
            avgAge: { years: 1, months: 6 }
        });
    });
});
