import { useState, useEffect } from "react";
import { Menu } from "../components/Menu";
import { CardRelatorio } from "../components/CardRelatorio";
import { RelatorioTratamentos } from "../components/RelatorioTratamentos";
import { formatarMoeda } from "../utils/formatadores";
import api from "../api";
import { FaChartLine, FaCalendarAlt, FaMoneyBillWave, FaClipboardList } from 'react-icons/fa';

export function Relatorio() {
  const [tratamentos, setTratamentos] = useState([]);
  const [metricas, setMetricas] = useState({
    totalTratamentos: 0,
    valorTotal: 0,
    mediaPorTratamento: 0,
    tratamentosConcluidos: 0,
    tratamentosAgendados: 0,
    comissaoTotal: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periodo, setPeriodo] = useState('ultima-semana');

  const fetchDadosRelatorios = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Define as datas com base no período selecionado
      let startDate, endDate;
      const now = new Date();
      
      if (periodo === 'ultima-semana') {
        startDate = new Date(now.setDate(now.getDate() - 7));
        endDate = new Date();
      } else if (periodo === 'ultimo-mes') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
      } else {
        startDate = new Date(now.setDate(now.getDate() - 30)); // 30 dias como padrão
        endDate = new Date();
      }

      // Formata as datas para o formato ISO
      const startDateISO = startDate.toISOString().split('T')[0];
      const endDateISO = endDate.toISOString().split('T')[0];

      // Busca os dados da API usando o cliente api configurado
      const [tratamentosResponse, metricasResponse] = await Promise.all([
        api.get("/consultas", {
          params: {
            start_date: startDateISO,
            end_date: endDateISO,
            page: 1,
            per_page: 10
          }
        }),
        api.get("/consultas/dashboard", {
          params: {
            start_date: startDateISO,
            end_date: endDateISO
          }
        })
      ]);

      // Processa os tratamentos
      const tratamentosFormatados = tratamentosResponse.data.consultas?.map(consulta => ({
        id: consulta.id,
        data: consulta.data ? new Date(consulta.data).toLocaleDateString('pt-BR') : 'N/A',
        paciente: consulta.paciente?.nome || 'N/A',
        tratamento: consulta.tratamento?.nome || 'N/A',
        valor: consulta.valor || 0,
        profissional: consulta.profissional?.nome || 'N/A',
        status: consulta.status === 'concluido' ? 'Finalizado' : 
               consulta.status === 'agendado' ? 'Agendado' : 'Em andamento'
      })) || [];

      // Processa as métricas
      const dashboardData = metricasResponse.data;
      const metricasAtualizadas = {
        totalTratamentos: dashboardData.total_tratamentos?.valor || 0,
        valorTotal: dashboardData.receita?.total || 0,
        mediaPorTratamento: dashboardData.media_tratamento?.valor
          ? Number(parseFloat(dashboardData.media_tratamento.valor).toFixed(2))
          : 0,
        tratamentosConcluidos: dashboardData.total_tratamentos?.concluidos || 0,
        tratamentosAgendados: dashboardData.total_tratamentos?.agendados || 0,
        comissaoTotal: dashboardData.receita?.comissoes || 0
      };

      setTratamentos(tratamentosFormatados);
      setMetricas(metricasAtualizadas);
      
    } catch (err) {
      setError("Erro ao carregar dados");
      console.error("Erro na requisição:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDadosRelatorios();
  }, [periodo]);

  return (
    <div className="flex">
      <div className="main bg-[#FBFAF9] min-h-screen w-full flex flex-col">
        <Menu />
        
        <div className="ml-10 p-6">
          <h3 className="text-lg font-medium text-[#A28567] mb-2">
            <FaChartLine className="inline mr-2" /> Relatórios
          </h3>
          <p className="text-sm text-gray-400 mb-6">Visualize e exporte dados de tratamentos e comissões</p>

          {loading && (
            <p className="text-gray-400 italic">Carregando relatórios...</p>
          )}

          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Cards de Métricas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                  <CardRelatorio
                    titulo="Total de Tratamentos"
                    subtitulo="Número de procedimentos"
                    valor={metricas.totalTratamentos}
                    formatarValor={false}
                    icon={<FaClipboardList className="text-[#A28567]" />}
                    infoAdicional={
                      <div className="mt-2">
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                          {metricas.tratamentosConcluidos} concluídos
                        </span>
                        <span className="px-2 py-1 rounded-full ml-2 bg-blue-100 text-blue-800 text-xs">
                          {metricas.tratamentosAgendados} agendados
                        </span>
                      </div>
                    }
                  />
                </div>

                <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                  <CardRelatorio
                    titulo="Valor Total"
                    subtitulo="Receita gerada"
                    valor={formatarMoeda(metricas.valorTotal)}
                    icon={<FaMoneyBillWave className="text-[#A28567]" />}
                    infoAdicional={`Comissões: ${formatarMoeda(metricas.comissaoTotal)}`}
                  />
                </div>

                <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                  <CardRelatorio
                    titulo="Média por Tratamento"
                    subtitulo="Valor médio"
                    valor={formatarMoeda(metricas.mediaPorTratamento)}
                    icon={<FaCalendarAlt className="text-[#A28567]" />}
                    infoAdicional={`Período: ${
                      periodo === 'ultima-semana'
                        ? 'Última semana'
                        : periodo === 'ultimo-mes'
                        ? 'Último mês'
                        : 'Personalizado'
                    }`}
                  />
                </div>
              </div>

              {/* Tabela de Tratamentos */}
              <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                <RelatorioTratamentos
                  tratamentos={tratamentos}
                  loading={loading}
                  error={error}
                  periodo={periodo}
                  setPeriodo={setPeriodo}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Relatorio;