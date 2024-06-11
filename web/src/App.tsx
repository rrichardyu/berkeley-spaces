import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Catalog from './pages/Catalog'
import Scheduler from './pages/Scheduler'
import NavigationBar from './components/NavigationBar'
import Home from './pages/Home'
import Update from './pages/Update'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen">
        <NavigationBar />
        <div className="flex-grow overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/scheduler" element={<Scheduler />} />
            <Route path="/update" element={<Update />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}