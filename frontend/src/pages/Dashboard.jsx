import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
const Dashboard = () => {
  const [receita, setReceita] = useState(null);
  const [lucro, setLucro] = useState(null);
  const [atividades, setAtividades] = useState([]);

  useEffect(() => {
    // Futuramente, chamada API para buscar dados
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Cards Receita e Lucro lado a lado */}
        <div className="flex gap-6">
          {/* Card de Receita */}
          <div className="bg-white p-6 rounded-lg shadow flex-1">
            <h1 className="text-2xl font-bold text-gray-800">Receita</h1>
            <h2 className="text-gray-500 text-sm mb-4">Desempenho mensal</h2>
            {receita ? (
              <>
                <p className="text-3xl font-bold text-gray-800 mb-2">{`R$ ${receita.valor.toFixed(
                  2
                )}`}</p>
                <p
                  className={`flex items-center ${
                    receita.percentual >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  <span>{`${receita.percentual}% em relação ao mês anterior`}</span>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        receita.percentual >= 0
                          ? "M5 10l7-7m0 0l7 7m-7-7v18"
                          : "M19 14l-7 7m0 0l-7-7m7 7V2"
                      }
                    />
                  </svg>
                </p>
              </>
            ) : (
              <p className="text-gray-400 italic">
                Dados de receita ainda não disponíveis.
              </p>
            )}
          </div>

          {/* Card de Lucro */}
          <div className="bg-white p-6 rounded-lg shadow flex-1">
            <h1 className="text-2xl font-bold text-gray-800">Lucro</h1>
            <h2 className="text-gray-500 text-sm mb-4">Desempenho mensal</h2>
            {lucro ? (
              <>
                <p className="text-3xl font-bold text-gray-800 mb-2">{`R$ ${lucro.valor.toFixed(
                  2
                )}`}</p>
                <p
                  className={`flex items-center ${
                    lucro.percentual >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  <span>{`${lucro.percentual}% em relação ao mês anterior`}</span>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        lucro.percentual >= 0
                          ? "M5 10l7-7m0 0l7 7m-7-7v18"
                          : "M19 14l-7 7m0 0l-7-7m7 7V2"
                      }
                    />
                  </svg>
                </p>
              </>
            ) : (
              <p className="text-gray-400 italic">
                Dados de lucro ainda não disponíveis.
              </p>
            )}
          </div>
        </div>

        {/* Card de Atividade Recente */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-800">
            Atividade Recente
          </h1>
          <h2 className="text-gray-500 text-sm mb-6">
            Últimas ações realizadas
          </h2>
          <div className="space-y-6">
            {atividades.length > 0 ? (
              atividades.map((atividade, index) => (
                <div key={index}>
                  <p className="font-bold text-gray-800">{atividade.titulo}</p>
                  <p className="text-gray-600">{atividade.usuario}</p>
                  <p className="text-gray-400 text-sm mt-1">{atividade.data}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">
                Nenhuma atividade registrada até o momento.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

