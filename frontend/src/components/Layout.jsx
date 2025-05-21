import React from 'react';
import {Menu} from './Menu';
import {Nav} from './Nav';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Nav lateral sem container */}
      <nav className="w-64 h-screen sticky top-0">
        <Nav />
      </nav>

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 bg-[#FBFAF9] min-h-screen">
        {/* Div para o título e menu */}
        <div className="max-w-4xl mx-auto mt-4 mb-4 p-6">
          {/* Título acima do menu */}
          <h2 className="text-[#A28567] font-semibold text-xl mb-4">
            Sistema de Cálculo de Comissão e Análise de Orçamentos
          </h2>

          {/* Menu solto e centralizado */}
          <header className="relative z-10">
            <Menu />
          </header>
        </div>

        {/* Conteúdo da página */}
        <main className="flex-1 p-6 overflow-auto max-w-4xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;