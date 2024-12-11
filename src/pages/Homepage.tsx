import useSWR from 'swr'
import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../components/homepage/DataTable';
import StatsSection from '../components/homepage/StatsSection';
import FilterSection from '../components/homepage/FilterSection';
import { CarRecord } from '../types/car';
import { FilterFormData } from '../types/props';
import { useAuth } from '../contexts/AuthContext';
import { fetchCars } from '../services/cars';
import Loading from '../components/homepage/Loading';
import Error from '../components/homepage/Error';

function Homepage() {
  // 修改登录状态初始化
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
    }
  }, [isLoggedIn, navigate])

  const [displayCount, setDisplayCount] = useState(10)
  const [sortField, setSortField] = useState<'saleDate' | 'age' | 'odometer'>('saleDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const [filterData, setFilterData] = useState<FilterFormData>({
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

  // 处理筛选更新
  const handleFilterChange = (newFilterData: FilterFormData) => {
    setFilterData(newFilterData)
  }

  const { data: records, error, isLoading } = useSWR<CarRecord[]>(
    `/car?maker=${filterData.make}&model=${filterData.model}&year=${filterData.year}`,
    fetchCars
  )



  // Combine filtering, sorting, and pagination
  const processedRecords = useMemo(() => {
    if (!records) return []

    // First apply filters
    const filtered = records.filter(record => {
      const odometerValue = parseInt(record.odometer.toString().replace(/,/g, ''), 10)

      // Odometer range filtering
      if (filterData.odometer) {
        const [min, max] = filterData.odometer.split('-').map(v =>
          v.endsWith('+') ? Infinity : parseInt(v, 10)
        )
        if (odometerValue < min || (max !== Infinity && odometerValue > max)) return false
      }

      // Date filtering
      if (filterData.date) {
        const saleDate = new Date(record.sale_date)
        const now = new Date()
        const timeRanges = {
          'last-week': 7,
          'last-month': 30,
          'last-3-months': 90,
          'last-year': 365
        }
        const days = timeRanges[filterData.date as keyof typeof timeRanges]
        if (days && (now.getTime() - saleDate.getTime()) > days * 24 * 60 * 60 * 1000) {
          return false
        }
      }

      return (
        (!filterData.condition || record.vehicle_condition === filterData.condition) &&
        (!filterData.location || record.sale_location === filterData.location) &&
        (!filterData.category || record.sale_category === filterData.category)
      )
    })

    // Then apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortField) {
        case 'saleDate':
          return sortOrder === 'asc'
            ? new Date(a.sale_date).getTime() - new Date(b.sale_date).getTime()
            : new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime()
        case 'age':
          return sortOrder === 'asc'
            ? a.year - b.year
            : b.year - a.year
        case 'odometer':
          const aValue = parseInt(a.odometer.toString().replace(/,/g, ''), 10)
          const bValue = parseInt(b.odometer.toString().replace(/,/g, ''), 10)
          return sortOrder === 'asc'
            ? aValue - bValue
            : bValue - aValue
        default:
          return 0
      }
    })

    // Finally apply pagination
    return sorted.slice(0, displayCount)
  }, [
    records,
    filterData,
    sortField,
    sortOrder,
    displayCount
  ])

  // Handle load more
  const handleLoadMore = () => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    setDisplayCount(prev => prev + 10)
  }

  const handleApplyFilters = () => {
    setDisplayCount(10)
  }


  const mainContent = (
    <div className="max-w-6xl mx-auto m-16">
      <h1 className="text-3xl font-bold mb-6 text-center px-4">Used car sales for Audi A5</h1>
      <div className="-mx-[max(0px,calc((100%-72rem)/2))] px-[max(0px,calc((100%-72rem)/2))]">
        <FilterSection
          records={processedRecords}
          formData={filterData}
          onFilterChange={handleFilterChange}
          handleApplyFilters={handleApplyFilters}
        />
        <StatsSection
          records={processedRecords}
          sortField={sortField}
          setSortField={setSortField}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      </div>
      <DataTable records={processedRecords} isLoggedIn={isLoggedIn} navigate={navigate} />
      {records && displayCount < records.length && (
        <div className="m-16 flex justify-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleLoadMore}
          >
            {isLoggedIn ? 'Load More' : 'Login to See More'}
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="relative">
      {mainContent}
      
      {isLoading && (
        <Loading />
      )}

      {error && (
        <Error />
      )}
    </div>
  )
}

export default Homepage