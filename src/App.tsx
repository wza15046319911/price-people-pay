import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Homepage from './pages/Homepage'
import axios from './lib/requests'
import { SWRConfig } from 'swr'

function App() {
  return (
    <SWRConfig 
      value={{
        // @ts-ignore
        fetcher: (url: string) => axios.get(url).then(res => res.data)
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Homepage />} />
        </Routes>
      </BrowserRouter>
    </SWRConfig>
  )
}

export default App