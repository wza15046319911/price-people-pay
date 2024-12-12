export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

interface AverageStats {
    avgKm: number;
    avgAge: {
        years: number;
        months: number;
    };
}

interface Record {
    odometer: number | string;
    year: number;
}

export const calculateAverages = (records: Record[]): AverageStats => {
    if (!records || records.length === 0) {
        return { 
            avgKm: 0, 
            avgAge: { years: 0, months: 0 } 
        };
    }

    const totalKm = records.reduce((sum, record) => {
        const km = parseInt(record.odometer.toString().replace(/,/g, ''), 10);
        return sum + km;
    }, 0);
    const avgKm = Math.round(totalKm / records.length);

    const currentYear = new Date().getFullYear();
    const totalMonths = records.reduce((sum, record) => {
        const monthsDiff = (currentYear - record.year) * 12;
        return sum + monthsDiff;
    }, 0);
    const avgMonths = Math.round(totalMonths / records.length);
    const avgYears = Math.floor(avgMonths / 12);
    const remainingMonths = avgMonths % 12;

    return {
        avgKm,
        avgAge: { years: avgYears, months: remainingMonths }
    };
};