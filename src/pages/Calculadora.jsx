import { Nav } from "../components/Nav";
import { Logo } from "../components/Logo";
import { Container } from "../components/Container";


export function Calculadora(){

    return(
        <div className="flex" >
          < Nav />
         <div className=" main p-4 bg-[#F5FAFF] h-screen w-dvw flex flex-col ">
          <h2 className="flex text-[#A28567] font-semibold text-2xl m-10"> Sistema de Cálculo de Comissão e Análise de Orçamentos</h2>
          <Container />
         </div>
        </div>
    )
}