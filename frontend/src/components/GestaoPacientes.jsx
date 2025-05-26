import { useState, useEffect } from 'react';
import { FaSearch, FaUserMd, FaUserInjured, FaCalendarAlt, FaDollarSign, FaClinicMedical, FaRedo } from 'react-icons/fa';
import axios from 'axios';

export function GestaoPacientes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        setLoading(true);
        // Busca os pacientes da API
        const response = await axios.get("http://localhost:3000/api/v1/pacientes");

        // Verifica se a resposta tem dados e se é um array
        console.log("Raw API response data:", response.data);
        const dadosPacientes = Array.isArray(response.data) ? response.data : 
                             (response.data.pacientes || response.data.items || []);
        
        // Transforma os dados da API no formato esperado pelo componente
        const pacientesFormatados = dadosPacientes.map(paciente => {
          // Ajusta para o formato do backend que retorna dados agregados
          return {
            nome: paciente.nome || 'N/A',
            dataConsulta: paciente.ultima_consulta
              ? new Date(paciente.ultima_consulta).toLocaleDateString('pt-BR')
              : 'N/A',
            objetivo: paciente.objetivo || 'N/A',
            valor: paciente.vl_total || 0,
            atendimento: paciente.modo || 'N/A',
            retornos: paciente.retornos || 0,
            profissional: paciente.profissional_nome || 'N/A',
            comissao: calcularComissao(paciente.vl_total, 0) // pct_comissao not available in this query
          };
        });
        console.log("Formatted pacientes data:", pacientesFormatados);

        setPacientes(pacientesFormatados);
      } catch (err) {
        setError("Erro ao carregar pacientes");
        console.error("Erro:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();
  }, []);

  // Função para calcular a comissão baseada no valor e percentual
  const calcularComissao = (valor = 0, pctComissao = 0) => {
    return valor * (pctComissao / 100);
  };

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

  // ... restante do componente permanece igual ...

  if (loading) {
    return (
      <div className="max-w-4xl p-6">
        <p>Carregando pacientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl p-6 bg-red-100 text-red-800 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-6">
      <h1 className="text-lg font-medium text-[#A28567] mb-2">Gestão de Pacientes</h1>
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
            {filteredPacientes.length > 0 ? (
              filteredPacientes.map((paciente, index) => (
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
                  R$ {(typeof paciente.valor === 'number' ? paciente.valor : parseFloat(paciente.valor) || 0).toFixed(2)}
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
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-sm text-gray-500">
                  Nenhum paciente encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Resumo de Comissões */}
      {Object.keys(comissoesPorProfissional).length > 0 && (
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
      )}
    </div>
  );
}