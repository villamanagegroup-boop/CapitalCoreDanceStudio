import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="p-8 text-navy-dark font-black">Home — coming soon</div>} />
      </Routes>
    </BrowserRouter>
  )
}
