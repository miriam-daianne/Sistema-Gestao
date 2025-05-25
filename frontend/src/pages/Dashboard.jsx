import { useState, useEffect } from "react";
import { Nav } from "../components/Nav";
import { Container } from "../components/Container";
import { Menu } from "../components/Menu";
import axios from "axios";

export function Dashboard() {
  const [receita, setReceita] = useState(null);
  const [lucro, setLucro] = useState(null);
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Busca os dados do dashboard
        const dashboardResponse = await axios.get("/api/v1/consultas/dashboard");
        const dashboardData = dashboardResponse.data;
        
        // Calcula a receita e o lucro
        const receitaTotal = dashboardData?.receita?.total || 0;
        const comissoes = dashboardData?.receita?.comissoes || 0;
        const tratamentosConcluidos = dashboardData?.total_tratamentos?.concluidos || 0;
        const custos = tratamentosConcluidos * 0.025; // Exemplo de custo fixo por tratamento
        
        setReceita({
          valor: receitaTotal,
          percentual: receitaTotal > 0 ? 10 : 0 // Exemplo - você pode calcular com base em dados históricos
        });
        
        setLucro({
          valor: receitaTotal - comissoes - custos,
          percentual: (receitaTotal - comissoes - custos) > 0 ? 5 : 0 // Exemplo
        });
        
        // Busca as consultas recentes para atividades
        const consultasResponse = await axios.get("/api/v1/consultas?page=1&per_page=5");
        const consultasData = consultasResponse.data?.consultas || [];
        
        // Transforma consultas em atividades
        const atividadesFormatadas = consultasData.map(consulta => ({
          titulo: `Consulta com ${consulta.paciente || 'N/A'} - ${consulta.tratamento || 'N/A'}`,
          usuario: `Profissional: ${consulta.profissional || 'N/A'}`,
          data: consulta.data ? new Date(consulta.data).toLocaleDateString('pt-BR') : 'Data não disponível'
        }));
        
        setAtividades(atividadesFormatadas);
        
      } catch (err) {
        setError("Erro ao carregar dados do dashboard");
        console.error("Erro:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex">
        <Nav />
        <div className="main ml-64 p-6 bg-[#FBFAF9] min-h-screen w-full flex flex-col">
          <Container>
            <div className="max-w-4xl p-6">
              <p>Carregando dashboard...</p>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Nav />
        <div className="main ml-64 p-6 bg-[#FBFAF9] min-h-screen w-full flex flex-col">
          <Container>
            <div className="max-w-4xl p-6 bg-red-100 text-red-800 rounded-lg">
              <p>{error}</p>
            </div>
          </Container>
        </div>
      </div>
    );
  }

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
              <h1 className="text-lg font-medium text-[#A28567] mb-2">
                Dashboard Financeiro
              </h1>
              <p className="text-sm text-gray-400 mb-6">
                Visão geral das métricas financeiras da clínica
              </p>

              {/* Cards de Métricas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Card de Receita */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-sm text-gray-500 mb-1">Receita Total</h3>
                  <p className="text-xs text-gray-400 mb-2">Desempenho mensal</p>
                  {receita ? (
                    <>
                      <p className="text-2xl font-bold text-[#3B3024] mb-2">
                        R$ {receita.valor.toFixed(2)}
                      </p>
                      <p className={`flex items-center text-sm ${
                        receita.percentual >= 0 ? "text-green-500" : "text-red-500"
                      }`}>
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
                    <p className="text-gray-400 italic">Dados não disponíveis</p>
                  )}
                </div>

                {/* Card de Lucro */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-sm text-gray-500 mb-1">Lucro Líquido</h3>
                  <p className="text-xs text-gray-400 mb-2">Desempenho mensal</p>
                  {lucro ? (
                    <>
                      <p className="text-2xl font-bold text-[#3B3024] mb-2">
                        R$ {lucro.valor.toFixed(2)}
                      </p>
                      <p className={`flex items-center text-sm ${
                        lucro.percentual >= 0 ? "text-green-500" : "text-red-500"
                      }`}>
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
                    <p className="text-gray-400 italic">Dados não disponíveis</p>
                  )}
                </div>
              </div>

              {/* Atividades Recentes */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-sm text-gray-500 mb-1">Atividades Recentes</h3>
                <p className="text-xs text-gray-400 mb-4">Últimas consultas realizadas</p>
                
                <div className="space-y-4">
                  {atividades.length > 0 ? (
                    atividades.map((atividade, index) => (
                      <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                        <p className="font-medium text-[#3B3024] text-sm">{atividade.titulo}</p>
                        <p className="text-gray-600 text-xs">{atividade.usuario}</p>
                        <p className="text-gray-400 text-xs mt-1">{atividade.data}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic text-sm">Nenhuma atividade recente</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Dashboard;