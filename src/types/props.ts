import { CarRecord } from "./car"

export interface FilterFormData {
    // 基础筛选
    make: string
    model: string
    year: string
    odometer: string
    condition: string
    location: string
    date: string
    category: string

    // 车辆特征
    badges: string
    bodyType: string
    bodyTypeConfig: string
    fuelType: string
    transmission: string

    // 发动机相关
    engine: string
    cylinders: string

    // 其他规格
    division: string    // 部门/分区
    drive: string      // 驱动方式
    seat: string       // 座位数
    doors: string      // 车门数

    // 额外功能
    features: string   // 特殊功能/配置
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
    formData: FilterFormData  // 添加formData作为prop
    onFilterChange: (formData: FilterFormData) => void  // 添加状态更新函数
    handleApplyFilters: () => void
}