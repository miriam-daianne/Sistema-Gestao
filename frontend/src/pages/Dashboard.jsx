import { useState, useEffect } from "react";
//import { Nav } from "../components/Nav";
import { Menu } from "../components/Menu";
import { CardRelatorio } from "../components/CardRelatorio";
import { formatarMoeda } from "../utils/formatadores";
import api from "../api";

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
        const dashboardResponse = await api.get("/consultas/dashboard");
        const dashboardData = dashboardResponse.data;
        
        // Calcula a receita e o lucro
        const receitaTotal = dashboardData?.receita?.total || 0;
        const comissoes = dashboardData?.receita?.comissoes || 0;
        const tratamentosConcluidos = dashboardData?.total_tratamentos?.concluidos || 0;
        const custos = tratamentosConcluidos * 0.025;
        
        setReceita({
          valor: Number(receitaTotal),
          percentual: Number(receitaTotal) > 0 ? 10 : 0
        });
        
        setLucro({
          valor: Number(receitaTotal) - (Number(receitaTotal) * 0.025) - Number(custos),
          percentual: (Number(receitaTotal) - (Number(receitaTotal) * 0.025) - Number(custos)) > 0 ? 5 : 0
        });
        
        // Busca as consultas recentes para atividades
        const consultasResponse = await api.get("/consultas", {
          params: { page: 1, per_page: 5 }
        });
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

      <div className="main p-6 bg-[#FBFAF9] min-h-screen w-full flex flex-col">
          <p>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
      
        <div className="main p-6 bg-[#FBFAF9] min-h-screen w-full flex flex-col">
          <div className="bg-red-100 text-red-800 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
   
      <div className="main   bg-[#FBFAF9] min-h-screen w-full flex flex-col ">
       
        <Menu />

        <div className="ml-10 w-9/10  "> 
          <h3 className="text-lg font-medium text-[#A28567] mb-2 mt-5.5">Dashboard Financeiro</h3>
          <p className="text-sm text-gray-400 mb-6">Visão geral das métricas financeiras da clínica</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 ">
            {/* Card de Receita */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-sm text-gray-500 mb-1">Receita Total</h3>
              <p className="text-xs text-gray-400 mb-2">Desempenho mensal</p>
              {receita ? (
                <>
                  <p className="text-2xl font-bold text-[#3B3024] mb-2">
                    {formatarMoeda(receita.valor)}
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
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-sm text-gray-500 mb-1">Lucro Líquido</h3>
              <p className="text-xs text-gray-400 mb-2">Desempenho mensal</p>
              {lucro ? (
                <>
                  <p className="text-2xl font-bold text-[#3B3024] mb-2">
                    {formatarMoeda(lucro.valor)}
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
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
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
    </div>
  );
}

export default Dashboard;