import { useMemo } from 'react';
import { StatsSectionProps } from '../../types/props';
import { calculateAverages } from '../../utils/util';

const StatsSection: React.FC<StatsSectionProps> = ({
    records,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder
}) => {
    const averages = useMemo(() => calculateAverages(records || []), [records])
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 rounded-lg mb-6 space-y-2 sm:space-y-0">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <p>Records: <span className="font-bold">{records?.length || 0}</span></p>
                <p>Average KM: <span className="font-bold">{averages.avgKm.toLocaleString()}</span></p>
                <p>Average age: <span className="font-bold">{averages.avgAge.years}yrs {averages.avgAge.months}mos</span></p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center text-white">
                <select
                    className="px-4 py-2 rounded bg-blue-600 "
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value as 'saleDate' | 'age' | 'odometer')}
                >
                    <option value="saleDate">Sort by Sold Date</option>
                    <option value="age">Sort by Age</option>
                    <option value="odometer">Sort by Odometer</option>
                </select>
                <button
                    className={`px-4 py-2 rounded ${sortOrder === 'asc' ? 'bg-blue-600' : 'bg-slate-700'}`}
                    onClick={() => setSortOrder('asc')}
                >
                    ASC
                </button>
                <button
                    className={`px-4 py-2 rounded ${sortOrder === 'desc' ? 'bg-blue-600' : 'bg-slate-700'}`}
                    onClick={() => setSortOrder('desc')}
                >
                    DESC
                </button>
            </div>
        </div>
    )
}

export default StatsSection