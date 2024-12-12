import axios from '../lib/requests'

export async function fetchCars(url: string) {
    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        throw new Error('Failed to fetch cars')
    }
}


