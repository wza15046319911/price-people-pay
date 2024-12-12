import { useState, useMemo } from 'react'
import { FilterSectionProps } from '../../types/props'



function FilterSection({ records, formData, onFilterChange, handleApplyFilters }: FilterSectionProps) {
    const [showMoreFilters, setShowMoreFilters] = useState(false)

    const handleInputChange = (name: string, value: string) => {
        onFilterChange({
            ...formData,
            [name]: value,
            ...(name === 'make' ? { model: '' } : {})
        })
    }


    const handleClearFilters = () => {
        onFilterChange({
            make: '',
            model: '',
            year: '',
            odometer: '',
            condition: '',
            location: '',
            date: '',
            category: '',
            badges: '',
            bodyType: '',
            bodyTypeConfig: '',
            fuelType: '',
            transmission: '',
            engine: '',
            cylinders: '',
            division: '',
            drive: '',
            seat: '',
            doors: '',
            features: ''
        })
    }

    const options = useMemo(() => {
        if (!records) return {
            makes: [],
            models: [],
            years: [],
            conditions: [],
            locations: [],
            categories: []
        }

        return {
            makes: [...new Set(records.map(r => r.make))],
            models: [...new Set(records.map(r => r.model))],
            years: [...new Set(records.map(r => r.year))].sort((a, b) => b - a),
            conditions: [...new Set(records.map(r => r.vehicle_condition))],
            locations: [...new Set(records.map(r => r.sale_location))],
            categories: [...new Set(records.map(r => r.sale_category))]
        }
    }, [records])

    // Calculate available models based on selected make
    const availableModels = useMemo(() => {
        if (!records || !formData.make) return []
        return [...new Set(records
            .filter(r => r.make === formData.make)
            .map(r => r.model))]
    }, [records, formData.make])

    return (
        <div className="bg-gray-100 p-4 rounded-lg mb-6 text-gray-900">
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <select
                        className="p-2 border rounded"
                        value={formData.make}
                        onChange={(e) => handleInputChange('make', e.target.value)}
                    >
                        <option value="">All Makes</option>
                        {options.makes.map(make => (
                            <option key={make} value={make}>{make}</option>
                        ))}
                    </select>
                    <select
                        className="p-2 border rounded"
                        value={formData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                    >
                        <option value="">All Models</option>
                        {availableModels.map(model => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                    <select
                        className="p-2 border rounded"
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                    >
                        <option value="">All Years</option>
                        {options.years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <select
                        className="p-2 border rounded"
                        value={formData.odometer}
                        onChange={(e) => handleInputChange('odometer', e.target.value)}
                    >
                        <option value="">All Odometer</option>
                        <option value="0-50000">0 - 50,000 km</option>
                        <option value="50000-100000">50,000 - 100,000 km</option>
                        <option value="100000-150000">100,000 - 150,000 km</option>
                        <option value="150000+">150,000+ km</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <select
                        className="p-2 border rounded"
                        value={formData.condition}
                        onChange={(e) => handleInputChange('condition', e.target.value)}
                    >
                        <option value="">All Conditions</option>
                        {options.conditions.map(condition => (
                            <option key={condition} value={condition}>{condition}</option>
                        ))}
                    </select>
                    <select
                        className="p-2 border rounded"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                    >
                        <option value="">All Locations</option>
                        {options.locations.map(location => (
                            <option key={location} value={location}>{location}</option>
                        ))}
                    </select>
                    <select
                        className="p-2 border rounded"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                    >
                        <option value="">All Dates</option>
                        <option value="last-week">Last Week</option>
                        <option value="last-month">Last Month</option>
                        <option value="last-3-months">Last 3 Months</option>
                        <option value="last-year">Last Year</option>
                    </select>
                    <select
                        className="p-2 border rounded"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {options.categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                {showMoreFilters && (
                    <>
                        <select
                            className="p-2 border rounded"
                            value={formData.badges}
                            onChange={(e) => handleInputChange('badges', e.target.value)}
                        >
                            <option value="">Badges</option>
                            {/* Options */}
                        </select>
                        <input
                            type="text"
                            className="p-2 border rounded w-full"
                            placeholder="e.g. Metallic Paint, Power front seats, Power Sunroof, ..."
                            value={formData.features}
                            onChange={(e) => handleInputChange('features', e.target.value)}
                        />
                    </>
                )}

                <button
                    className="text-blue-500 hover:text-blue-700 underline"
                    onClick={() => setShowMoreFilters(!showMoreFilters)}
                >
                    {showMoreFilters ? 'Show less filters' : 'Show more filters'}
                </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={handleApplyFilters}
                >
                    Apply
                </button>
                <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={handleClearFilters}
                >
                    Clear
                </button>
            </div>
        </div>
    )
}

export default FilterSection 