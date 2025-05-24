import { useState, useEffect } from "react";
import axios from "axios";
import { formatarMoeda } from "../utils/formatadores";

export function RelatorioTratamentos({ periodo, setPeriodo }) {
  const [tratamentos, setTratamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTratamentos = async () => {
      try {
        setLoading(true);
        
        // Define o período para a API
        let startDate, endDate;
        const now = new Date();
        
        if (periodo === 'ultima-semana') {
          startDate = new Date(now.setDate(now.getDate() - 7));
          endDate = new Date();
        } else if (periodo === 'ultimo-mes') {
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        } else {
          // Personalizado - você pode adicionar lógica para datas específicas
          startDate = new Date(now.setDate(now.getDate() - 30)); // 30 dias como padrão
          endDate = new Date();
        }

        // Formata as datas para o formato ISO
        const startDateISO = startDate.toISOString().split('T')[0];
        const endDateISO = endDate.toISOString().split('T')[0];

        // Busca os tratamentos da API
        const response = await axios.get("/api/v1/consultas", {
          params: {
            start_date: startDateISO,
            end_date: endDateISO
          }
        });
        
        // Transforma os dados da API no formato esperado
        const tratamentosFormatados = response.data.consultas.map(consulta => ({
          id: consulta.id,
          data: new Date(consulta.data).toLocaleDateString('pt-BR'),
          paciente: consulta.paciente?.nome || 'N/A',
          tratamento: consulta.tratamento?.nome || 'N/A',
          valor: consulta.valor,
          profissional: consulta.profissional?.nome || 'N/A',
          status: traduzirStatus(consulta.status)
        }));
        
        setTratamentos(tratamentosFormatados);
      } catch (err) {
        setError("Erro ao carregar tratamentos");
        console.error("Erro:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTratamentos();
  }, [periodo]);

  const traduzirStatus = (status) => {
    switch(status) {
      case 'concluido': return 'Finalizado';
      case 'agendado': return 'Agendado';
      default: return 'Em andamento';
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Finalizado': return 'bg-green-100 text-green-800';
      case 'Em andamento': return 'bg-yellow-100 text-yellow-800';
      case 'Agendado': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="flex justify-center py-8">Carregando...</div>;
  if (error) return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-[#A28567]">Lista de Tratamentos</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setPeriodo('ultima-semana')}
            className={`px-3 py-1 text-xs rounded hover:opacity-90 ${
              periodo === 'ultima-semana' 
                ? 'bg-[#A28567] text-white' 
                : 'border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Última Semana
          </button>
          <button 
            onClick={() => setPeriodo('ultimo-mes')}
            className={`px-3 py-1 text-xs rounded hover:opacity-90 ${
              periodo === 'ultimo-mes' 
                ? 'bg-[#A28567] text-white' 
                : 'border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Último Mês
          </button>
          <button 
            onClick={() => setPeriodo('personalizado')}
            className={`px-3 py-1 text-xs rounded hover:opacity-90 ${
              periodo === 'personalizado' 
                ? 'bg-[#A28567] text-white' 
                : 'border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Personalizado
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tratamento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profissional</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tratamentos.map((tratamento) => (
              <tr key={tratamento.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tratamento.data}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tratamento.paciente}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tratamento.tratamento}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatarMoeda(tratamento.valor)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tratamento.profissional}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(tratamento.status)}`}>
                    {tratamento.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-6 space-x-2">
        <button className="px-3 py-1 border border-gray-200 rounded text-sm hover:bg-gray-50">
          &lt; Previous
        </button>
        <button className="px-3 py-1 bg-[#A28567] text-white rounded text-sm hover:opacity-90">
          1
        </button>
        <button className="px-3 py-1 border border-gray-200 rounded text-sm hover:bg-gray-50">
          2
        </button>
        <button className="px-3 py-1 border border-gray-200 rounded text-sm hover:bg-gray-50">
          3
        </button>
        <button className="px-3 py-1 border border-gray-200 rounded text-sm hover:bg-gray-50">
          Next &gt;
        </button>
      </div>
    </div>
  );
}