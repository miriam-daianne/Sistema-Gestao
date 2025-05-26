import { Nav } from "../components/Nav";
import { Menu } from "../components/Menu";
import { CardRelatorio } from "../components/CardRelatorio";
import { RelatorioTratamentos } from "../components/RelatorioTratamentos";
import { useState, useEffect } from "react";
import { formatarMoeda } from "../utils/formatadores";
import axios from "axios";

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

      // Busca os dados da API
      const [tratamentosResponse, metricasResponse] = await Promise.all([
        axios.get("http://localhost:3000/api/v1/consultas", {
          params: {
            start_date: startDateISO,
            end_date: endDateISO,
            page: 1,
            per_page: 10
          }
        }),
        axios.get("http://localhost:3000/api/v1/consultas/dashboard", {
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

  if (loading) {
    return (
      <div className="flex">
        <Nav />
        <div className="main ml-64 p-6 bg-[#FBFAF9] min-h-screen w-full flex flex-col">
          <p>Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Nav />
        <div className="main ml-64 p-6 bg-[#FBFAF9] min-h-screen w-full flex flex-col">
          <div className="bg-red-100 text-red-800 p-4 rounded-lg">
            <p>{error}</p>
          </div>
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

        <div>
          <br />
          <h3 className="text-2xl font-semibold mb-2">Relatórios</h3>
          <p className="text-gray-600 mb-6">Visualize e exporte dados de tratamentos e comissões</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <CardRelatorio
            titulo="Total de Tratamentos"
            subtitulo="Número de procedimentos"
            valor={metricas.totalTratamentos}
            formatarValor={false}
            infoAdicional={
              <>
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
                  {metricas.tratamentosConcluidos} concluídos
                </span>
                <span className="px-2 py-1 rounded-full ml-2 bg-blue-100 text-blue-800">
                  {metricas.tratamentosAgendados} agendados
                </span>
              </>
            }
          />

          <CardRelatorio
            titulo="Valor Total"
            subtitulo="Receita gerada"
            valor={formatarMoeda(metricas.valorTotal)}
            infoAdicional={`Comissões: ${formatarMoeda(metricas.comissaoTotal)}`}
          />

          <CardRelatorio
            titulo="Média por Tratamento"
            subtitulo="Valor médio"
            valor={formatarMoeda(metricas.mediaPorTratamento)}
            infoAdicional={`Período: ${
              periodo === 'ultima-semana'
                ? 'Última semana'
                : periodo === 'ultimo-mes'
                ? 'Último mês'
                : 'Personalizado'
            }`}
          />
          </div>

          <RelatorioTratamentos
            tratamentos={tratamentos}
            loading={loading}
            error={error}
            periodo={periodo}
            setPeriodo={setPeriodo}
          />
        </div>
      </div>
    </div>
  );
}