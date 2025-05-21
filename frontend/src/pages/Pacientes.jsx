import { Nav } from "../components/Nav"
import { Menu } from "../components/Menu"
import { Container } from "../components/Container"
import { GestaoPacientes } from "../components/GestaoPacientes"

export function Pacientes(){

    return(
       <div className="flex" >
                 < Nav />
                <div className="main ml-64 p-6 bg-[#FBFAF9] min-h-screen w-full flex flex-col">
        <h2 className="text-[#A28567] font-semibold text-xl mb-4">
          Sistema de Cálculo de Comissão e Análise de Orçamentos
        </h2>
                 < Menu />
                <Container>   
                    <GestaoPacientes />      
               </Container>
                </div>
               </div>
           )
       }
