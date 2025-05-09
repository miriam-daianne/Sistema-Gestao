import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Calculadora } from "./pages/Calculadora"


function App() {


  return (
  <BrowserRouter>
    <Routes>
      <Route path="/calculadora" element={<Calculadora />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
