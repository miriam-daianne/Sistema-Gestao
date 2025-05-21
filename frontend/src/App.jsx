import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Calculadora } from "./pages/Calculadora";
import { Pacientes } from "./pages/Pacientes";
import { Cadastro } from "./pages/Cadastro";
import { Relatorio } from "./pages/Relatorio";
import { Orcamento } from "./pages/Orcamento";
import Dashboard  from "./pages/Dashboard";



function App() {


  return (
  <BrowserRouter>
    <Routes>
      <Route path="/calculadora" element={<Calculadora />} />
      <Route path="/pacientes" element={<Pacientes />}/>
      <Route path="/cadastro" element ={<Cadastro />} />
      <Route path="/relatorio" element={<Relatorio />}/>
      <Route path="/orcamento" element={<Orcamento />}/>
      <Route path="/dashboard" element ={<Dashboard />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App