import { useState, useEffect } from 'react';
import { FaSearch, FaUserMd, FaUserInjured, FaCalendarAlt, FaDollarSign, FaClinicMedical, FaRedo } from 'react-icons/fa';
import api from "../api";

export function GestaoPacientes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comissoes, setComissoes] = useState({});

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        setLoading(true);
        setError(null);
        // Busca os pacientes da API
        const { data } = await api.get("/pacientes");

        // Verifica se a resposta tem dados e se é um array
        const dadosPacientes = Array.isArray(data) ? data : 
                             (data.pacientes || data.items || []);
        
        // Transforma os dados da API no formato esperado pelo componente
        const pacientesFormatados = dadosPacientes.map(paciente => {
          return {
            nome: paciente.nome || 'N/A',
            dataConsulta: paciente.ultima_consulta
              ? new Date(paciente.ultima_consulta).toLocaleDateString('pt-BR')
              : 'N/A',
            objetivo: paciente.objetivo || 'N/A',
            valor: paciente.vl_total || 0,
            atendimento: paciente.modo || 'N/A',
            retornos: paciente.retornos || 0,
            profissional: paciente.profissional_nome || 'N/A'
          };
        });

        setPacientes(pacientesFormatados);
      } catch (err) {
        setError("Erro ao carregar pacientes");
        console.error("Erro:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchComissoes = async () => {
      try {
        const { data } = await api.get("/comissoes");
        // Map commissions by professional name for quick lookup
        const comissoesMap = {};
        data.forEach(item => {
          comissoesMap[item.profissional] = item.vl_comissao;
        });
        setComissoes(comissoesMap);
      } catch (err) {
        console.error("Erro ao carregar comissões:", err);
      }
    };

    fetchPacientes();
    fetchComissoes();
  }, []);

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
    acc[paciente.profissional] += comissoes[paciente.profissional] || 0;
    return acc;
  }, {});

  return (
    <div className="flex">
      <div className="main bg-[#FBFAF9] min-h-screen w-full flex flex-col">

        <div className="ml-10 p-6">
          <h3 className="text-lg font-medium text-[#A28567] mb-2">Gestão de Pacientes</h3>
          <p className="text-sm text-gray-400 mb-6">Gerenciamento de pacientes e cálculo de comissões por atendimento</p>

          {loading && (
            <p className="text-gray-400 italic">Carregando pacientes...</p>
          )}

          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
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

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-left text-xs font-normal text-gray-500">
                          <div className="flex items-center">
                            <FaUserInjured className="mr-2" /> Paciente
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-normal text-gray-500">
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2" /> Data
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-normal text-gray-500">
                          Objetivo
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-normal text-gray-500">
                          <div className="flex items-center">
                            <FaDollarSign className="mr-2" /> Valor
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-normal text-gray-500">
                          <div className="flex items-center">
                            <FaClinicMedical className="mr-2" /> Atendimento
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-normal text-gray-500">
                          <div className="flex items-center">
                            <FaRedo className="mr-2" /> Retornos
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-normal text-gray-500">
                          <div className="flex items-center">
                            <FaUserMd className="mr-2" /> Profissional
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPacientes.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-4 text-center text-sm text-gray-400">
                            Nenhum paciente encontrado
                          </td>
                        </tr>
                      ) : (
                        filteredPacientes.map((paciente, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {paciente.nome}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {paciente.dataConsulta}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {paciente.objetivo}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              R$ {(typeof paciente.valor === 'number' ? paciente.valor : parseFloat(paciente.valor) || 0).toFixed(2).replace('.', ',')}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {paciente.atendimento}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {paciente.retornos}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {paciente.profissional}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Resumo de Comissões */}
              {Object.keys(comissoesPorProfissional).length > 0 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-medium text-[#A28567] mb-3">Resumo de Comissões</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(comissoesPorProfissional).map(([profissional, comissao]) => (
                      <div key={profissional} className="p-4 rounded border border-gray-100 hover:bg-gray-50">
                        <p className="text-sm text-gray-600"><span className="font-medium">Profissional:</span> {profissional}</p>
                        <p className="text-sm text-gray-600 mt-2"><span className="font-medium">Comissão Total:</span></p>
                        <p className="text-sm text-[#A28567] font-medium">
                          R$ {(typeof comissao === 'number' ? comissao : parseFloat(comissao) || 0).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default GestaoPacientes;