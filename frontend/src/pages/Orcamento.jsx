import { useState, useEffect } from "react";
import { Menu } from "../components/Menu";
import api from "../api";
import { FaIdBadge, FaUser, FaCalendarAlt, FaMoneyBillWave, FaPercentage, FaClipboardList, FaEllipsisH } from 'react-icons/fa';

function calcularMargem(valor, custo) {
  if (!custo || custo === 0) return "0%";
  const margem = ((valor - custo) / custo) * 100;
  return `${margem.toFixed(2).replace('.', ',')}%`;
}

function traduzirStatus(status) {
  switch (status) {
    case "agendado":
      return "Pendente";
    case "concluido":
      return "Aprovado";
    case "cancelado":
      return "Rejeitado";
    case "orcamento":
      return "Orçamento";
    default:
      return "Pendente";
  }
}

function getStatusStyle(status) {
  switch (status) {
    case "Aprovado":
      return "bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs";
    case "Pendente":
      return "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs";
    case "Rejeitado":
      return "bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs";
    case "Orçamento":
      return "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs";
    default:
      return "";
  }
}

export function Orcamento() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrcamentos() {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get("/consultas", {
          params: { status: "orcamento" },
        });

        if (data?.consultas && Array.isArray(data.consultas)) {
          const orcamentosFormatados = data.consultas.map((consulta) => {
            const valorNum = Number(consulta.valor) || 0;
            return {
              id: consulta.id,
              codigo: `BUD-${consulta.id?.toString().padStart(3, "0") || "000"}`,
              paciente: consulta.paciente || "N/A",
              data: consulta.data
                ? new Date(consulta.data).toLocaleDateString("pt-BR")
                : "N/A",
              valor: valorNum,
              margem: calcularMargem(valorNum, 0),
              status: traduzirStatus(consulta.status),
            };
          });
          setOrcamentos(orcamentosFormatados);
        } else {
          setOrcamentos([]);
        }
      } catch (err) {
        setError("Erro ao carregar orçamentos");
        setOrcamentos([]);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrcamentos();
  }, []);

  return (
    <div className="flex">
      <div className="main bg-[#FBFAF9] min-h-screen w-full flex flex-col">
        <Menu />
        
        <div className="ml-10 p-6">
          <h3 className="text-lg font-medium text-[#A28567] mb-2">Análise de Orçamentos</h3>
          <p className="text-sm text-gray-400 mb-6">Gerencie e acompanhe todos os orçamentos da clínica</p>

          {loading && (
            <p className="text-gray-400 italic">Carregando orçamentos...</p>
          )}

          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left text-xs font-normal text-gray-500">
                        <div className="flex items-center">
                          <FaIdBadge className="mr-2" /> ID
                        </div>
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-normal text-gray-500">
                        <div className="flex items-center">
                          <FaUser className="mr-2" /> Paciente
                        </div>
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-normal text-gray-500">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2" /> Data
                        </div>
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-normal text-gray-500">
                        <div className="flex items-center">
                          <FaMoneyBillWave className="mr-2" /> Valor
                        </div>
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-normal text-gray-500">
                        <div className="flex items-center">
                          <FaPercentage className="mr-2" /> Margem
                        </div>
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-normal text-gray-500">
                        <div className="flex items-center">
                          <FaClipboardList className="mr-2" /> Status
                        </div>
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-normal text-gray-500">
                        <div className="flex items-center">
                          <FaEllipsisH className="mr-2" /> Ações
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orcamentos.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-4 text-center text-sm text-gray-400">
                          Nenhum orçamento encontrado
                        </td>
                      </tr>
                    ) : (
                      orcamentos.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-600">{item.codigo}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{item.paciente}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{item.data}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">R$ {item.valor.toFixed(2).replace('.', ',')}</td>
                          <td className={`py-3 px-4 text-sm ${
                            parseFloat(item.margem) < 0 ? "text-red-500" : "text-green-500"
                          }`}>
                            {item.margem}
                          </td>
                          <td className="py-3 px-4">
                            <span className={getStatusStyle(item.status)}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button className="text-sm text-[#A28567] hover:text-[#8a7358]">
                              Detalhes
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Orcamento;