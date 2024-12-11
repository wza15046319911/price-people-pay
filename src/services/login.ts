import axios from "axios"

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, {
    username,
    password
  })
  return response.data
}   