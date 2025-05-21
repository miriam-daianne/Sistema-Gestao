import { NavLink } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa6';
import { Logo } from './Logo';
import { FaCalculator, FaChartBar, FaFileAlt, FaHome } from "react-icons/fa";

export function Nav() {
    return (
       <div className='fixed h-screen w-56 bg-[#A28567] text-white flex flex-col p-4 z-50'>
            <h1 className='mb-6'> <Logo /> </h1>

            <nav className='flex flex-col gap-1'>
                <NavLink 
                    to="/dashboard"
                    className={({ isActive }) => 
                        `flex gap-2 items-center p-2 rounded transition-colors text-sm font-medium ${
                            isActive 
                                ? 'bg-white text-[#5e4d3b]' 
                                : 'hover:bg-white hover:text-[#5e4d3b]'
                        }`
                    }
                >
                    <FaHome className='w-4 h-4'/> Dashboard
                </NavLink>
                <NavLink 
                    to="/calculadora"
                    className={({ isActive }) => 
                        `flex gap-2 items-center p-2 rounded transition-colors text-sm font-medium ${
                            isActive 
                                ? 'bg-white text-[#5e4d3b]' 
                                : 'hover:bg-white hover:text-[#5e4d3b]'
                        }`
                    }
                >
                    <FaCalculator className="w-4 h-4" /> Calculadora
                </NavLink>
                <NavLink 
                    to="/orcamento"
                    className={({ isActive }) => 
                        `flex gap-2 items-center p-2 rounded transition-colors text-sm font-medium ${
                            isActive 
                                ? 'bg-white text-[#5e4d3b]' 
                                : 'hover:bg-white hover:text-[#5e4d3b]'
                        }`
                    }
                >
                    <FaChartBar className="w-4 h-4" /> Análise de Orçamento
                </NavLink>
                <NavLink 
                    to="/pacientes"
                    className={({ isActive }) => 
                        `flex gap-2 items-center p-2 rounded transition-colors text-sm font-medium ${
                            isActive 
                                ? 'bg-white text-[#5e4d3b]' 
                                : 'hover:bg-white hover:text-[#5e4d3b]'
                        }`
                    }
                >
                    <FaUsers className="w-4 h-4" /> Pacientes
                </NavLink>
                <NavLink 
                    to="/relatorio"
                    className={({ isActive }) => 
                        `flex gap-2 items-center p-2 rounded transition-colors text-sm font-medium ${
                            isActive 
                                ? 'bg-white text-[#5e4d3b]' 
                                : 'hover:bg-white hover:text-[#5e4d3b]'
                        }`
                    }
                >
                    <FaFileAlt className="w-4 h-4" /> Relatórios
                </NavLink>
            </nav>
       </div>
    )
}