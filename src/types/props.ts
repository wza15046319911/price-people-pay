import { CarRecord } from "./car"

export interface FilterFormData {
    // Basic Filters
    make: string
    model: string
    year: string
    odometer: string
    condition: string
    location: string
    date: string
    category: string

    // Vehicle Characteristics
    badges: string
    bodyType: string
    bodyTypeConfig: string
    fuelType: string
    transmission: string

    // Engine Related
    engine: string
    cylinders: string

    // Other Specifications
    division: string    // Division/Section
    drive: string      // Drive Type
    seat: string       // Number of Seats
    doors: string      // Number of Doors

    // Additional Features
    features: string   // Special Features/Configuration
}

export interface StatsSectionProps {
    records: CarRecord[] | undefined
    sortField: 'saleDate' | 'age' | 'odometer'
    setSortField: (field: 'saleDate' | 'age' | 'odometer') => void
    sortOrder: 'asc' | 'desc'
    setSortOrder: (order: 'asc' | 'desc') => void
}

export interface FilterSectionProps {
    records: CarRecord[] | undefined
    formData: FilterFormData  // Form data as prop
    onFilterChange: (formData: FilterFormData) => void  // State update function
    handleApplyFilters: () => void
}