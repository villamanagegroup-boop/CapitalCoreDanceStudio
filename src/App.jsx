import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Classes from './pages/Classes'
import About from './pages/About'
import Tuition from './pages/Tuition'
import Camps from './pages/Camps'
import MiniSeries from './pages/MiniSeries'
import Birthdays from './pages/Birthdays'
import BirthdayForm from './pages/BirthdayForm'
import BirthdayPayment from './pages/BirthdayPayment'
import BirthdayThankYou from './pages/BirthdayThankYou'
import Contact from './pages/Contact'
import Recital from './pages/Recital'
import RecitalShirts from './pages/RecitalShirts'
import RecitalShirtThankYou from './pages/RecitalShirtThankYou'
import RecitalShop from './pages/RecitalShop'
import RecitalShopThankYou from './pages/RecitalShopThankYou'
import FAQ from './pages/FAQ'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

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
        <Route path="/birthday-booking" element={<BirthdayForm />} />
        <Route path="/birthday-payment" element={<BirthdayPayment />} />
        <Route path="/birthday-thankyou" element={<BirthdayThankYou />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/recital" element={<Recital />} />
        <Route path="/recital/shirts" element={<RecitalShirts />} />
        <Route path="/recital/shirts/thankyou" element={<RecitalShirtThankYou />} />
        <Route path="/recitalshop" element={<RecitalShop />} />
        <Route path="/recitalshop/thankyou" element={<RecitalShopThankYou />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </BrowserRouter>
  )
}
