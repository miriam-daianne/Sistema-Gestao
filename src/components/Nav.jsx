import { FaUsers } from 'react-icons/fa6'
import { Logo } from './Logo'
import { FaCalculator, FaChartBar, FaFileAlt, FaHome } from "react-icons/fa"

export function Nav() {
    return (
       <div className='fixed h-screen w-64 bg-[#A28567] text-white flex flex-col p-4 shadow-lg z-50'>
            <h1 className='mb-10'> <Logo /> </h1>

            <nav className='flex flex-col gap-4'>
                <a href="#" className='flex gap-2 items-center hover:bg-white hover:text-[#A28567] p-2 rounded transition font-thin'>
                  <FaHome className='w-5 h-5'/> Dashboard
                </a>
                <a href="#" className='flex gap-2 items-center hover:bg-white hover:text-[#A28567] p-2 rounded transition font-thin'>
                   <FaCalculator className="w-5 h-5" /> Calculadora
                </a>
                <a href="#" className='flex gap-2 items-center hover:bg-white hover:text-[#A28567] p-2 rounded transition font-thin'>
                     <FaChartBar className="w-5 h-5" /> Análise de Orçamento
                </a>
                 <a href="#" className='flex gap-2 items-center hover:bg-white hover:text-[#A28567] p-2 rounded transition font-thin'>
                     <FaUsers className="w-5 h-5" /> Pacientes
                </a>
                 <a href="#" className='flex gap-2 items-center hover:bg-white hover:text-[#A28567] p-2 rounded transition font-thin'>
                     <FaFileAlt className="w-5 h-5" /> Relatórios
                </a>
            </nav>
       </div>
    )
}