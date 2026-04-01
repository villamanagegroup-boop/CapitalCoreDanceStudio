import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Classes from './pages/Classes'
import About from './pages/About'
import Tuition from './pages/Tuition'
import Camps from './pages/Camps'
import MiniSeries from './pages/MiniSeries'
import Birthdays from './pages/Birthdays'
import Contact from './pages/Contact'
import Recital from './pages/Recital'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/tuition" element={<Tuition />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/camps" element={<Camps />} />
        <Route path="/mini-series" element={<MiniSeries />} />
        <Route path="/birthdays" element={<Birthdays />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/recital" element={<Recital />} />
      </Routes>
    </BrowserRouter>
  )
}
