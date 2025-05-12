import { NavLink } from 'react-router-dom';

export function Menu() {
    const menuItems = [
        { label: 'Calculadora', to: '/calculadora' }, 
        { label: 'Análise de Orçamento', to: '/analise' }, 
        { label: 'Pacientes', to: '/pacientes' },
        { label: 'Cadastro de Pacientes', to: '/cadastro' }, 
    ];

    return (
        <div className="bg-[#ECE6DF] rounded-md ml-4 p-2 w-fit">
            <ul className="flex gap-3"> 
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                                `rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                                    isActive 
                                        ? 'bg-[#A28567] text-white' 
                                        : 'text-[#5e4d3b] hover:bg-[#A28567] hover:text-white'
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}