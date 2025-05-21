import { useState, useEffect } from "react";
import { Nav } from "../components/Nav";
import { Container } from "../components/Container";
import { Menu } from "../components/Menu";

export function Orcamento() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState("lista");

  useEffect(() => {
    const dadosFicticios = [
      {
        id: "BUD-001",
        paciente: "Maria Souza",
        data: "12/04/2025",
        valor: "R$ 990,00",
        margem: "14.70%",
        status: "Aprovado",
      },
      {
        id: "BUD-002",
        paciente: "João Pereira",
        data: "15/04/2025",
        valor: "R$ 1.190,00",
        margem: "16.22%",
        status: "Pendente",
      },
      {
        id: "BUD-003",
        paciente: "Ana Oliveira",
        data: "18/04/2025",
        valor: "R$ 430,00",
        margem: "-31.51%",
        status: "Rejeitado",
      },
    ];
    setOrcamentos(dadosFicticios);
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-500 text-white px-3 py-1 rounded-full text-xs";
      case "Pendente":
        return "bg-yellow-400 text-white px-3 py-1 rounded-full text-xs";
      case "Rejeitado":
        return "bg-red-500 text-white px-3 py-1 rounded-full text-xs";
      default:
        return "";
    }
  };

  return (
    <div className="flex">
      <Nav />
      <div className="main ml-64 p-6 bg-[#FBFAF9] min-h-screen w-full flex flex-col">
        <h2 className="text-[#A28567] font-semibold text-xl mb-4">
          Sistema de Cálculo de Comissão e Análise de Orçamentos
        </h2>
        <Menu />
        
        <Container>
          <div className="max-w-4xl p-6">
            <div className="mb-8">
              <h1 className="text-lg font-medium text-[#A28567] mb-2">Análise de Orçamentos</h1>
              <p className="text-sm text-gray-400 mb-6">Gerencie e acompanhe todos os orçamentos da clínica</p>
              
              {/* Abas */}
              <div className="flex gap-2 mb-6">
                <button
                  className={`px-4 py-2 rounded-md text-sm ${
                    abaAtiva === "lista"
                      ? "bg-white shadow text-[#3B3024] font-medium border border-gray-200"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => setAbaAtiva("lista")}
                >
                  Lista de Orçamentos
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm ${
                    abaAtiva === "grafico"
                      ? "bg-white shadow text-[#3B3024] font-medium border border-gray-200"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => setAbaAtiva("grafico")}
                >
                  Análise Gráfica
                </button>
              </div>

              {/* Conteúdo da aba selecionada */}
              {abaAtiva === "lista" && (
                <div className="border-t border-gray-100 pt-6 w-max">
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg flex flex-col gap-4">
                      <thead>
                        <tr className="border-b border-gray-200  flex justify-between gap-10 ml-2">
                          <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">ID</th>
                          <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">Paciente</th>
                          <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">Data</th>
                          <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">Valor Total</th>
                          <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">Margem Final</th>
                          <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">Status</th>
                          <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="flex flex-col gap-6">
                        {orcamentos.map((item, index) => (
                          <tr key={index} className="border-b border-gray-100 flex justify-between ">
                            <td className="py-2 px-3 text-sm text-gray-600">{item.id}</td>
                            <td className="py-2 px-3 text-sm text-gray-600">{item.paciente}</td>
                            <td className="py-2 px-3 text-sm text-gray-600 ">{item.data}</td>
                            <td className="py-2 px-3 text-sm text-gray-600 " >{item.valor}</td>
                            <td className={`py-2 px-3 text-sm  ${
                              item.margem.startsWith("-") ? "text-red-500" : "text-green-500"
                            }`}>
                              {item.margem}
                            </td>
                            <td className="py-2 px-3">
                              <span className={getStatusStyle(item.status)}>
                                {item.status}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <button className="text-sm text-[#A28567] hover:underline">
                                Detalhes
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {abaAtiva === "grafico" && (
                <div className="border-t border-gray-100 pt-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center h-64">
                    <p className="text-sm text-gray-400">
                      O conteúdo gráfico será implementado futuramente.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
} 