import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Classes from './pages/Classes'
import Camps from './pages/Camps'
import Birthdays from './pages/Birthdays'
import Contact from './pages/Contact'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/camps" element={<Camps />} />
        <Route path="/birthdays" element={<Birthdays />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}
