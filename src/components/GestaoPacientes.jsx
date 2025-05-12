import { useState } from 'react';
import { FaSearch, FaUserMd, FaUserInjured, FaCalendarAlt, FaDollarSign, FaClinicMedical, FaRedo } from 'react-icons/fa';

export function GestaoPacientes() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const pacientes = [
    {
      nome: 'Ana Silva',
      dataConsulta: '09/04/2025',
      objetivo: 'Emagrecimento',
      valor: 300.00,
      atendimento: 'Presencial',
      retornos: 2,
      profissional: 'Dr. Carlos Mendes',
      comissao: 188.00
    },
    {
      nome: 'Pedro Santos',
      dataConsulta: '11/04/2025',
      objetivo: 'Ganho muscular',
      valor: 350.00,
      atendimento: 'Teleconsulta',
      retornos: 1,
      profissional: 'Dra. Juliana Alves',
      comissao: 87.50
    },
    {
      nome: 'Maria Oliveira',
      dataConsulta: '04/04/2025',
      objetivo: 'Reeducação alimentar',
      valor: 280.00,
      atendimento: 'Presencial',
      retornos: 3,
      profissional: 'Dr. Carlos Mendes',
      comissao: 150.00
    }
  ];

  const filteredPacientes = pacientes.filter(paciente =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.profissional.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.objetivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.atendimento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const comissoesPorProfissional = filteredPacientes.reduce((acc, paciente) => {
    if (!acc[paciente.profissional]) {
      acc[paciente.profissional] = 0;
    }
    acc[paciente.profissional] += paciente.comissao;
    return acc;
  }, {});

  return (
    <div className="max-w-4xl p-6">
      <h1 className="text-lg font-medium text-gray-500 mb-2">Gestão de Pacientes</h1>
      <p className="text-sm text-gray-400 mb-6">Gerenciamento de pacientes e cálculo de comissões por atendimento</p>

      {/* Campo de busca */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar paciente ou profissional..."
          className="pl-10 pr-4 py-1.5 w-full text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">
                <div className="flex items-center">
                  <FaUserInjured className="mr-2" /> Paciente
                </div>
              </th>
              <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" /> Data
                </div>
              </th>
              <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">
                Objetivo
              </th>
              <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">
                <div className="flex items-center">
                  <FaDollarSign className="mr-2" /> Valor
                </div>
              </th>
              <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">
                <div className="flex items-center">
                  <FaClinicMedical className="mr-2" /> Atendimento
                </div>
              </th>
              <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">
                <div className="flex items-center">
                  <FaRedo className="mr-2" /> Retornos
                </div>
              </th>
              <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">
                <div className="flex items-center">
                  <FaUserMd className="mr-2" /> Profissional
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPacientes.map((paciente, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-2 px-3 text-sm text-gray-600">
                  {paciente.nome}
                </td>
                <td className="py-2 px-3 text-sm text-gray-600">
                  {paciente.dataConsulta}
                </td>
                <td className="py-2 px-3 text-sm text-gray-600">
                  {paciente.objetivo}
                </td>
                <td className="py-2 px-3 text-sm text-gray-600">
                  R$ {paciente.valor.toFixed(2)}
                </td>
                <td className="py-2 px-3 text-sm text-gray-600">
                  {paciente.atendimento}
                </td>
                <td className="py-2 px-3 text-sm text-gray-600">
                  {paciente.retornos}
                </td>
                <td className="py-2 px-3 text-sm text-gray-600">
                  {paciente.profissional}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumo de Comissões */}
      <div className="border-t border-gray-100 pt-6">
        <h2 className="text-lg font-medium text-gray-500 mb-3">Resumo de Comissões</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(comissoesPorProfissional).map(([profissional, comissao]) => (
            <div key={profissional} className="p-3 rounded border border-gray-100">
              <p className="text-sm text-gray-600"><span className="font-medium">Profissional:</span> {profissional}</p>
              <p className="text-sm text-gray-600 mt-2"><span className="font-medium">Comissão Total:</span></p>
              <p className="text-sm text-[#A28567] font-medium">R$ {comissao.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}