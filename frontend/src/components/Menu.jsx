import { NavLink } from "react-router-dom";
import { Logo } from "./Logo";

export function Menu() {
  const menuItems = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Calculadora", to: "/calculadora" },
    { label: "Análise de Orçamento", to: "/orcamento" },
    { label: "Pacientes", to: "/pacientes" },
    { label: "Cadastro de Pacientes", to: "/cadastro" },
    { label: "Relatórios", to: "/relatorio" },
  ];

  return (
    <div className="w-full bg-[#A28567] shadow-sm">
      <div className="container m-0  ">
        {/* Cabeçalho com logo e título */}
        <div className="flex items-center gap-4 ">
          <Logo className="h-12 w-auto" /> {/* Ajuste o tamanho conforme necessário */}
                  <nav className="w-full">
          <ul className="flex flex-wrap gap-2 mb-3 ml-20">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-base font-medium transition-colors ${
                      isActive
                        ? "bg-[#826c54] text-[#fff]"
                        : "text-[#fff] hover:bg-[#A28567] hover:text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        </div>

        {/* Menu horizontal */}

      </div>
    </div>
  );
}