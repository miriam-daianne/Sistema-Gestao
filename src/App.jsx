import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Calculadora } from "./pages/Calculadora"
import { Pacientes } from "./pages/Pacientes"


function App() {


  return (
  <BrowserRouter>
    <Routes>
      <Route path="/calculadora" element={<Calculadora />} />
      <Route path="/pacientes" element={<Pacientes />}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App
