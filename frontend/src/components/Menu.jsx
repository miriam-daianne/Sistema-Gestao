import { NavLink } from "react-router-dom";

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
    <ul className="flex gap-3">
      {menuItems.map((item, index) => (
        <li key={index}>
          <NavLink
            to={item.to}
            className={({ isActive }) =>
              `rounded-md px-3 py-1 text-base font-medium transition-colors ${
                isActive
                  ? "bg-[#A28567] text-white"
                  : "text-[#5e4d3b] hover:bg-[#A28567] hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
