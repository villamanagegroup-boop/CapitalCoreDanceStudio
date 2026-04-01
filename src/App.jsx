import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Classes from './pages/Classes'
import About from './pages/About'
import Tuition from './pages/Tuition'
import Camps from './pages/Camps'
import MiniSeries from './pages/MiniSeries'
import Birthdays from './pages/Birthdays'
import Contact from './pages/Contact'
import Recital from './pages/Recital'

export default function App() {
  return (
    <BrowserRouter>
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
