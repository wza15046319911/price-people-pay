import useSWR from 'swr'
import { useState, useMemo, useEffect } from 'react'
import axios from '../lib/requests'
import { useNavigate } from 'react-router-dom'
interface CarRecord {
  make: string;
  model: string;
  year: number;
  description: string;
  odometer: number;
  vehicle_condition: string;
  sale_location: string;
  sale_category: string;
  salvage_vehicle: boolean;
  sale_date: string;
  price: number;
}

// 添加日期格式化函数
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });
}

// 定义请求函数
async function fetchCars(url: string) {
  try {
    const response = await axios.get(url)
    // axios 直接返回数据在 response.data 中
    return response.data
  } catch (error) {
    throw new Error('获取车辆数据失败')
  }
}

// 添加 token 检查函数
const checkToken = () => {
  const token = localStorage.getItem('token')
  if (!token) return false

  try {
    // 解析 token（假设是 JWT 格式）
    const tokenData = JSON.parse(atob(token.split('.')[1]))
    const expirationTime = tokenData.exp * 1000 // 转换为毫秒
    
    // 检查是否过期
    return Date.now() < expirationTime
  } catch (error) {
    console.error('Token 验证失败:', error)
    return false
  }
}

function Homepage() {
  // 修改登录状态初始化
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()
  // 添加 useEffect 进行 token 检查
  useEffect(() => {
    const isValidToken = checkToken()
    setIsLoggedIn(isValidToken)

    // 可选：添加定时检查
    const checkInterval = setInterval(() => {
      const isStillValid = checkToken()
      if (!isStillValid && isLoggedIn) {
        setIsLoggedIn(false)
      }
    }, 60000) // 每分钟检查一次

    return () => clearInterval(checkInterval)
  }, [])

  // 添加状态管理
  const [displayCount, setDisplayCount] = useState(10)
  const [sortField, setSortField] = useState<'saleDate' | 'age' | 'odometer'>('saleDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')


  // Add filter states
  const [selectedMake, setSelectedMake] = useState<string>('')
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [selectedCondition, setSelectedCondition] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedOdometer, setSelectedOdometer] = useState<string>('')
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [selectedBadges, setSelectedBadges] = useState<string>('')
  const [selectedBodyType, setSelectedBodyType] = useState<string>('')
  const [selectedBodyTypeConfig, setSelectedBodyTypeConfig] = useState<string>('')
  const [selectedFuelType, setSelectedFuelType] = useState<string>('')
  const [selectedTransmission, setSelectedTransmission] = useState<string>('')
  const [selectedEngine, setSelectedEngine] = useState<string>('')
  const [selectedCylinders, setSelectedCylinders] = useState<string>('')
  const [selectedDivision, setSelectedDivision] = useState<string>('')
  const [selectedDrive, setSelectedDrive] = useState<string>('')
  const [selectedSeat, setSelectedSeat] = useState<string>('')
  const [selectedDoors, setSelectedDoors] = useState<string>('')
  const [selectedFeatures, setSelectedFeatures] = useState<string>('')


  const { data: records, error, isLoading } = useSWR<CarRecord[]>(
    `/car?maker=${selectedMake}&model=${selectedModel}&year=${selectedYear}`,
    fetchCars
  )

  // Calculate available models based on selected make
  const availableModels = useMemo(() => {
    if (!records || !selectedMake) return []
    return [...new Set(records
      .filter(r => r.make === selectedMake)
      .map(r => r.model))]
  }, [records, selectedMake])

  // 添加选项计算逻辑
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

  // Combine filtering, sorting, and pagination
  const processedRecords = useMemo(() => {
    if (!records) return []

    // First apply filters
    const filtered = records.filter(record => {
      const odometerValue = parseInt(record.odometer.toString().replace(/,/g, ''), 10)

      // Odometer range filtering
      if (selectedOdometer) {
        const [min, max] = selectedOdometer.split('-').map(v =>
          v.endsWith('+') ? Infinity : parseInt(v, 10)
        )
        if (odometerValue < min || (max !== Infinity && odometerValue > max)) return false
      }

      // Date filtering
      if (selectedDate) {
        const saleDate = new Date(record.sale_date)
        const now = new Date()
        const timeRanges = {
          'last-week': 7,
          'last-month': 30,
          'last-3-months': 90,
          'last-year': 365
        }
        const days = timeRanges[selectedDate as keyof typeof timeRanges]
        if (days && (now.getTime() - saleDate.getTime()) > days * 24 * 60 * 60 * 1000) {
          return false
        }
      }

      return (
        (!selectedCondition || record.vehicle_condition === selectedCondition) &&
        (!selectedLocation || record.sale_location === selectedLocation) &&
        (!selectedCategory || record.sale_category === selectedCategory)
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
    selectedCondition,
    selectedLocation,
    selectedCategory,
    selectedDate,
    selectedOdometer,
    sortField,
    sortOrder,
    displayCount
  ])

  // Handle load more
  const handleLoadMore = () => {
    if (!isLoggedIn) {
      // 如果未登录，导航到登录页面
      navigate('/login')
      return
    }
    setDisplayCount(prev => prev + 10)
  }

  const handleApplyFilters = () => {
    // 不需要手动触发请求，useSWR 会自动处理
    setDisplayCount(10)
  }

  const handleClearFilters = () => {
    setSelectedMake('')
    setSelectedModel('')
    setSelectedYear('')
    setSelectedCondition('')
    setSelectedLocation('')
    setSelectedCategory('')
    setSelectedDate('')
    setSelectedOdometer('')
    setSelectedBadges('')
    setSelectedBodyType('')
    setSelectedBodyTypeConfig('')
    setSelectedFuelType('')
    setSelectedTransmission('')
    setSelectedEngine('')
    setSelectedCylinders('')
    setSelectedDivision('')
    setSelectedDrive('')
    setSelectedSeat('')
    setSelectedDoors('')
    setSelectedFeatures('')
  }

  // 添加平均值计算
  const averages = useMemo(() => {
    if (!records || records.length === 0) return { avgKm: 0, avgAge: { years: 0, months: 0 } }

    // 计算平均里程
    const totalKm = records.reduce((sum, record) => {
      const km = parseInt(record.odometer.toString().replace(/,/g, ''), 10)
      return sum + km
    }, 0)
    const avgKm = Math.round(totalKm / records.length)

    // 计算平均年龄
    const currentYear = new Date().getFullYear()
    const totalMonths = records.reduce((sum, record) => {
      const monthsDiff = (currentYear - record.year) * 12
      return sum + monthsDiff
    }, 0)
    const avgMonths = Math.round(totalMonths / records.length)
    const avgYears = Math.floor(avgMonths / 12)
    const remainingMonths = avgMonths % 12

    return {
      avgKm,
      avgAge: { years: avgYears, months: remainingMonths }
    }
  }, [records])

  // 加载状态检查
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#001219] flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    )
  }

  // 处理错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-[#001219] flex items-center justify-center">
        <div className="text-red-500 text-xl">加载失败，请稍后重试</div>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-6xl mx-auto m-16">
        <h1 className="text-3xl font-bold mb-6 text-center px-4">Used car sales for Audi A5</h1>
        <div className=" -mx-[max(0px,calc((100%-72rem)/2))] px-[max(0px,calc((100%-72rem)/2))]">
          <div className="bg-gray-100 p-4 rounded-lg mb-6 text-gray-900">
            <div className="flex flex-col gap-4">
              {/* 筛选器第一行 - 改为移动端2列 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <select
                  className="p-2 border rounded"
                  value={selectedMake}
                  onChange={(e) => {
                    setSelectedMake(e.target.value)
                    setSelectedModel('')
                  }}
                >
                  <option value="">All Makes</option>
                  {options.makes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
                <select
                  className="p-2 border rounded"
                  value={selectedModel}
                  onChange={}
                >
                  <option value="">All Models</option>
                  {availableModels.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
                <select
                  className="p-2 border rounded"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">All Years</option>
                  {options.years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <select
                  className="p-2 border rounded"
                  value={selectedOdometer}
                  onChange={(e) => setSelectedOdometer(e.target.value)}
                >
                  <option value="">All Odometer</option>
                  <option value="0-50000">0 - 50,000 km</option>
                  <option value="50000-100000">50,000 - 100,000 km</option>
                  <option value="100000-150000">100,000 - 150,000 km</option>
                  <option value="150000+">150,000+ km</option>
                </select>
              </div>

              {/* 筛选器第二行 - 改为移动端2列 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <select
                  className="p-2 border rounded"
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                >
                  <option value="">All Conditions</option>
                  {options.conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
                <select
                  className="p-2 border rounded"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {options.locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <select
                  className="p-2 border rounded"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  <option value="">All Dates</option>
                  <option value="last-week">Last Week</option>
                  <option value="last-month">Last Month</option>
                  <option value="last-3-months">Last 3 Months</option>
                  <option value="last-year">Last Year</option>
                </select>
                <select
                  className="p-2 border rounded"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {options.categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* 显示/隐藏更多筛选器的按钮 */}
              <button
                className="text-blue-500 hover:text-blue-700 underline"
                onClick={() => setShowMoreFilters(!showMoreFilters)}
              >
                {showMoreFilters ? 'Show less filters' : 'Show more filters'}
              </button>

              {/* 更多筛选器选项 */}
              {showMoreFilters && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <select
                      className="p-2 border rounded"
                      value={selectedBadges}
                      onChange={(e) => setSelectedBadges(e.target.value)}
                    >
                      <option value="">Badges</option>
                      {/* 添加选项 */}
                    </select>
                    <select
                      className="p-2 border rounded"
                      value={selectedBodyType}
                      onChange={(e) => setSelectedBodyType(e.target.value)}
                    >
                      <option value="">Body Type</option>
                      {/* 添加选项 */}
                    </select>
                    <select
                      className="p-2 border rounded"
                      value={selectedBodyTypeConfig}
                      onChange={(e) => setSelectedBodyTypeConfig(e.target.value)}
                    >
                      <option value="">Body Type Config</option>
                      {/* 添加选项 */}
                    </select>
                    <select
                      className="p-2 border rounded"
                      value={selectedFuelType}
                      onChange={(e) => setSelectedFuelType(e.target.value)}
                    >
                      <option value="">Fuel Type</option>
                      {/* 添加选项 */}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <select
                      className="p-2 border rounded"
                      value={selectedTransmission}
                      onChange={(e) => setSelectedTransmission(e.target.value)}
                    >
                      <option value="">Transmission</option>
                      {/* 添加选项 */}
                    </select>
                    <select
                      className="p-2 border rounded"
                      value={selectedEngine}
                      onChange={(e) => setSelectedEngine(e.target.value)}
                    >
                      <option value="">Engine</option>
                      {/* 添加选项 */}
                    </select>
                    <select
                      className="p-2 border rounded"
                      value={selectedCylinders}
                      onChange={(e) => setSelectedCylinders(e.target.value)}
                    >
                      <option value="">Cylinders</option>
                      {/* 添加选项 */}
                    </select>
                    <select
                      className="p-2 border rounded"
                      value={selectedDivision}
                      onChange={(e) => setSelectedDivision(e.target.value)}
                    >
                      <option value="">Division</option>
                      {/* 添加选项 */}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <select
                      className="p-2 border rounded"
                      value={selectedDrive}
                      onChange={(e) => setSelectedDrive(e.target.value)}
                    >
                      <option value="">Drive</option>
                      {/* 添加选项 */}
                    </select>
                    <select
                      className="p-2 border rounded"
                      value={selectedSeat}
                      onChange={(e) => setSelectedSeat(e.target.value)}
                    >
                      <option value="">Seat</option>
                      {/* 添加选项 */}
                    </select>
                    <select
                      className="p-2 border rounded"
                      value={selectedDoors}
                      onChange={(e) => setSelectedDoors(e.target.value)}
                    >
                      <option value="">Doors</option>
                      {/* 添加选项 */}
                    </select>
                  </div>

                  {/* 特征搜索输入框 */}
                  <input
                    type="text"
                    className="p-2 border rounded w-full"
                    placeholder="e.g. Metallic Paint, Power front seats, Power Sunroof, ..."
                    value={selectedFeatures}
                    onChange={(e) => setSelectedFeatures(e.target.value)}
                  />
                </>
              )}
            </div>

            {/* 按钮组响应式布局 */}
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

          {/* 统计信息响应式布局 */}
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
        </div>

        {/* 表格容器添加水平滚动 */}
        <div className="bg-gray-100 rounded-lg overflow-x-auto text-gray-900">
          <div className="min-w-[1000px]">
            <table className="table-auto w-full text-left">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-2">Make</th>
                  <th className="p-2">Model</th>
                  <th className="p-2">Year</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Odometer (km)</th>
                  <th className="p-2">Condition</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Salvage</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {processedRecords.map((record, index) => (
                  <tr
                    key={index}
                    className={`
                    border-b hover:bg-gray-50 transition-colors
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  `}
                  >
                    <td className="p-5">{record.make}</td>
                    <td className="p-5">{record.model}</td>
                    <td className="p-5">{record.year}</td>
                    <td className="p-5">{record.description}</td>
                    <td className="p-5">{record.odometer}</td>
                    <td className="p-5">{record.vehicle_condition}</td>
                    <td className="p-5">{record.sale_location}</td>
                    <td className="p-5">{record.sale_category}</td>
                    <td className="p-5">{record.salvage_vehicle === true ? 'Yes' : 'No'}</td>
                    <td className="p-5">{formatDate(record.sale_date)}</td>
                    <td className="p-5">
                      {isLoggedIn 
                        ? (record.price === undefined ? 'N/A' : `$${record.price.toLocaleString()}`)
                        : (
                          <div className="flex flex-col items-start gap-2">
                            <span className="text-gray-400">Login to see</span>
                            <button 
                              className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                              onClick={() => {navigate('/login')}}
                            >
                              Login
                            </button>
                          </div>
                        )
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
    </>
  )
}

export default Homepage