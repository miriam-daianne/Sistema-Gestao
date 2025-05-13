import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Calculadora } from "./pages/Calculadora";
import { Pacientes } from "./pages/Pacientes";
import { Cadastro } from "./pages/Cadastro";



function App() {


  return (
  <BrowserRouter>
    <Routes>
      <Route path="/calculadora" element={<Calculadora />} />
      <Route path="/pacientes" element={<Pacientes />}/>
      <Route path="/cadastro" element ={<Cadastro />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
