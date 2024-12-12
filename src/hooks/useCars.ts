import useSWR from 'swr'
import { fetchCars } from '../services/cars'
import { CarRecord } from '../types/car'
import { FilterFormData } from '../types/props'

const buildCarUrl = (filterData: FilterFormData) => {
  return `/car?maker=${filterData.make}&model=${filterData.model}&year=${filterData.year}`
}

export const useCars = (filterData: FilterFormData) => {
  const { data: records, error, isLoading } = useSWR<CarRecord[]>(
    buildCarUrl(filterData),
    fetchCars
  )

  return { records, error, isLoading }
} 