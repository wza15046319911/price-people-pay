import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Homepage from './pages/Homepage'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Homepage />} />
          </Routes>
        </BrowserRouter>
    </AuthProvider>
  )
}

export default App