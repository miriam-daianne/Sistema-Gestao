
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { GestaoPacientes } from "../components/GestaoPacientes";

export function Pacientes() {
  return (
    <div className="flex">
 
      <div className="main bg-[#FBFAF9] min-h-screen w-full flex flex-col">
        <Menu />
        
          <GestaoPacientes />
        
      </div>
    </div>
  );
}
