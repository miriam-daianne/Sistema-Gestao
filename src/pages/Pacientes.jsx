import { Nav } from "../components/Nav"
import { Menu } from "../components/Menu"
import { Container } from "../components/Container"
import { GestaoPacientes } from "../components/GestaoPacientes"

export function Pacientes(){

    return(
       <div className="flex" >
                 < Nav />
                <div className=" main ml-64 p-4 bg-[#FBFAF9] h-screen w-dvw flex flex-col ">
                 <h2 className="flex text-[#A28567] font-semibold text-2xl ml-5 m-10"> Sistema de Cálculo de Comissão e Análise de Orçamentos</h2>
                 < Menu />
                <Container>   
                    <GestaoPacientes />      
               </Container>
                </div>
               </div>
           )
       }
