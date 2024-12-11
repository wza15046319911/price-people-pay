import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Homepage from './pages/Homepage'
import axios from './lib/requests'
import { SWRConfig } from 'swr'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <SWRConfig 
        value={{
          // @ts-ignore
          fetcher: (url: string) => axios.get(url).then(res => res.data)
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Homepage />} />
          </Routes>
        </BrowserRouter>
      </SWRConfig>
    </AuthProvider>
  )
}

export default App