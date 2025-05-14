import { useState, useEffect } from "react";
import { Nav } from "../components/Nav";
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
        return "bg-green-500 text-white px-3 py-1 rounded-full text-sm";
      case "Pendente":
        return "bg-yellow-400 text-white px-3 py-1 rounded-full text-sm";
      case "Rejeitado":
        return "bg-red-500 text-white px-3 py-1 rounded-full text-sm";
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

        {/* Abas */}
        <div className="flex gap-2 mt-4">
          <button
            className={`px-4 py-2 rounded-md text-sm transition ${
              abaAtiva === "lista"
                ? "bg-white shadow text-[#3B3024] font-semibold"
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setAbaAtiva("lista")}
          >
            Lista de Orçamentos
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm transition ${
              abaAtiva === "grafico"
                ? "bg-white shadow text-[#3B3024] font-semibold"
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setAbaAtiva("grafico")}
          >
            Análise Gráfica
          </button>
        </div>

        {/* Conteúdo da aba selecionada */}
        {abaAtiva === "lista" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
            <h2 className="text-[#3B3024] text-xl font-semibold mb-1">
              Análise de Orçamentos
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Visualize e analise orçamentos de pacientes
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-100 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-left text-sm text-gray-600">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Paciente</th>
                    <th className="p-3">Data</th>
                    <th className="p-3">Valor Total</th>
                    <th className="p-3">Margem Final</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {orcamentos.map((item, index) => (
                    <tr key={index} className="border-t border-gray-100">
                      <td className="p-3">{item.id}</td>
                      <td className="p-3">{item.paciente}</td>
                      <td className="p-3">{item.data}</td>
                      <td className="p-3">{item.valor}</td>
                      <td className="p-3 text-orange-500">{item.margem}</td>
                      <td className="p-3">
                        <span className={getStatusStyle(item.status)}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-sm text-gray-600">
                          🗎 Detalhes
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {abaAtiva === "grafico" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
            <h2 className="text-[#3B3024] text-xl font-semibold mb-2">
              Análise Gráfica
            </h2>
            <p className="text-sm text-gray-400">
              O conteúdo gráfico será implementado futuramente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
