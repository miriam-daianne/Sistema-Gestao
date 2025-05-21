import { Nav } from "../components/Nav";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { CardRelatorio } from "../components/CardRelatorio";
import { RelatorioTratamentos } from "../components/RelatorioTratamentos";
import { useState, useEffect } from "react";
import { formatarMoeda } from "../utils/formatadores";

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
      
      const data = {
        tratamentos: [
          // dados fictícios
        ],
        metricas: {
          totalTratamentos: '7',
          valorTotal: 17680.00,
          mediaPorTratamento: 2525.71,
          tratamentosConcluidos: 5,
          tratamentosAgendados: 2,
          comissaoTotal: 5304.00
        }
      };

      setTratamentos(data.tratamentos);
      setMetricas(data.metricas);
      setLoading(false);
      
    } catch (err) {
      setError("Erro ao carregar dados");
      setLoading(false);
      console.error("Erro na requisição:", err);
    }
  };

  useEffect(() => {
    fetchDadosRelatorios();
  }, [periodo]);

  return (
    <div className="flex">
      <Nav />
      <div className="main ml-64 p-6 bg-[#FBFAF9] min-h-screen w-full flex flex-col">
        <h2 className="text-[#A28567] font-semibold text-xl mb-4">
          Sistema de Cálculo de Comissão e Análise de Orçamentos
        </h2>
        <Menu />

        <Container
          titulo="Relatórios"
          subtitulo="Visualize e exporte dados de tratamentos e comissões"
        >
          <div className="max-w-4xl p-6">
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <CardRelatorio
                  titulo="Total de Tratamentos"
                  subtitulo="Número de procedimentos"
                  valor={metricas.totalTratamentos}
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
                  valor={metricas.valorTotal}
                  infoAdicional={`Comissões: ${formatarMoeda(metricas.comissaoTotal)}`}
                />

                <CardRelatorio
                  titulo="Média por Tratamento"
                  subtitulo="Valor médio"
                  valor={metricas.mediaPorTratamento}
                  infoAdicional={`Período: ${periodo === 'ultima-semana' ? 'Última semana' : 
                               periodo === 'ultimo-mes' ? 'Último mês' : 'Personalizado'}`}
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
        </Container>
      </div>
    </div>
  );
}