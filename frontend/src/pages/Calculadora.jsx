import { useState } from "react";
import { Menu } from "../components/Menu";
import { Calc } from "../components/Calc";
import { formatarMoeda } from "../utils/formatadores";

export function Calculadora() {
  const [resultados, setResultados] = useState({
    comissao: 0,
    valorFinal: 0,
    lucro: 0
  });

  const handleCalcular = (valores) => {
    const comissao = valores.valor * (valores.percentual / 100);
    const valorFinal = valores.valor + comissao;
    const lucro = valorFinal - (valores.custos || 0);
    
    setResultados({
      comissao,
      valorFinal,
      lucro
    });
  };

  return (
    <div className="flex">
      <div className="main  min-h-screen w-full flex flex-col">
        <Menu />
        
        <div className="ml-10 mt-5.5">
          <h3 className="text-lg font-medium text-[#A28567] mb-2">Calculadora de Comissões</h3>
          <p className="text-sm text-gray-400 mb-6">Calcule comissões e analise a viabilidade de orçamentos</p>

          {/* Cards de Resultados */}
        
          {/* Componente de Cálculo */}
          <div>
            <Calc onCalcular={handleCalcular} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calculadora;