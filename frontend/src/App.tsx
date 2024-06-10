import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import './App.css'
import Catalog from './pages/Catalog'
import Scheduler from './pages/Scheduler'
import NavigationBar from './components/NavigationBar'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen">
        <NavigationBar />
        <div className="flex-grow overflow-hidden">
          <Routes>
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/scheduler" element={<Scheduler />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}