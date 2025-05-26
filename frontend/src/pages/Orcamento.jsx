import { useState, useEffect } from "react";
import { Nav } from "../components/Nav";
import { Container } from "../components/Container";
import { Menu } from "../components/Menu";
import axios from "axios";
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
      return "bg-green-500 text-white px-3 py-1 rounded-full text-xs";
    case "Pendente":
      return "bg-yellow-400 text-white px-3 py-1 rounded-full text-xs";
    case "Rejeitado":
      return "bg-red-500 text-white px-3 py-1 rounded-full text-xs";
    case "Orçamento":
      return "bg-blue-500 text-white px-3 py-1 rounded-full text-xs";
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
        const { data } = await axios.get("/api/v1/consultas", {
          params: { status: "orcamento" },
        });

        if (data?.consultas && Array.isArray(data.consultas)) {
          const orcamentosFormatados = data.consultas.map((consulta) => {
            const valorNum = Number(consulta.valor) || 0;
            // custo is not provided in API, so margin calculation will be 0%
            return {
              id: `BUD-${consulta.id?.toString().padStart(3, "0") || "000"}`,
              paciente: consulta.paciente || "N/A",
              data: consulta.data
                ? new Date(consulta.data).toLocaleDateString("pt-BR")
                : "N/A",
              valor: `R$ ${valorNum.toFixed(2).replace(".", ",")}`,
              margem: calcularMargem(valorNum, null),
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
      <Nav />
      <main className="main ml-64 p-6 bg-[#FBFAF9] min-h-screen w-full flex flex-col">
        <h2 className="text-[#A28567] font-semibold text-xl mb-4">
          Sistema de Cálculo de Comissão e Análise de Orçamentos
        </h2>
        <Menu />

        <Container>
          <div className="max-w-4xl p-6">
            <section className="mb-8">
              <h1 className="text-lg font-medium text-[#A28567] mb-2">
                Análise de Orçamentos
              </h1>
              <p className="text-sm text-gray-400 mb-6">
                Gerencie e acompanhe todos os orçamentos da clínica
              </p>

              {loading && (
                <p>Carregando orçamentos...</p>
              )}

              {error && (
                <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {!loading && !error && (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">
                          <div className="flex items-center">
                            <FaIdBadge className="mr-2" /> ID
                          </div>
                        </th>
                        <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">
                          <div className="flex items-center">
                            <FaUser className="mr-2" /> Paciente
                          </div>
                        </th>
                        <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2" /> Data
                          </div>
                        </th>
                        <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">
                          <div className="flex items-center">
                            <FaMoneyBillWave className="mr-2" /> Valor Total
                          </div>
                        </th>
                        <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">
                          <div className="flex items-center">
                            <FaPercentage className="mr-2" /> Margem Final
                          </div>
                        </th>
                        <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">
                          <div className="flex items-center">
                            <FaClipboardList className="mr-2" /> Status
                          </div>
                        </th>
                        <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">
                          <div className="flex items-center">
                            <FaEllipsisH className="mr-2" /> Ações
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orcamentos.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-4 text-center text-gray-500">
                            Nenhum orçamento encontrado.
                          </td>
                        </tr>
                      ) : (
                        orcamentos.map((item, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-2 px-3 text-sm text-gray-600">{item.id}</td>
                            <td className="py-2 px-3 text-sm text-gray-600">{item.paciente}</td>
                            <td className="py-2 px-3 text-sm text-gray-600">{item.data}</td>
                            <td className="py-2 px-3 text-sm text-gray-600">{item.valor}</td>
                            <td
                              className={`py-2 px-3 text-sm ${
                                item.margem.startsWith("-")
                                  ? "text-red-500"
                                  : "text-green-500"
                              }`}
                            >
                              {item.margem}
                            </td>
                            <td className="py-2 px-3">
                              <span className={getStatusStyle(item.status)}>{item.status}</span>
                            </td>
                            <td className="py-2 px-3">
                              <button className="text-sm text-[#A28567] hover:underline">
                                Detalhes
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

            </section>
          </div>
        </Container>
      </main>
    </div>
  );
}
