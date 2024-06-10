import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Catalog from './pages/Catalog'
import Scheduler from './pages/Scheduler'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/scheduler" element={<Scheduler />} />
      </Routes>
    </BrowserRouter>
  )
}