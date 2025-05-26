import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatarMoeda } from '../utils/formatadores';

export function Calc() {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState('');
  const [tratamentos, setTratamentos] = useState([]);
  const [tratamentosOptions, setTratamentosOptions] = useState([]);
  const [comissoes, setComissoes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    timeout: 5000,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [pacientesRes, profissionaisRes, tratamentosRes] = await Promise.all([
          api.get('/pacientes'),
          api.get('/profissionais'),
          api.get('/tratamentos')
        ]);

        setPacientes(pacientesRes.data);
        setProfissionais(profissionaisRes.data);
        setTratamentosOptions(tratamentosRes.data);
        setTratamentos([
          { id: 1, tratamento_id: '', nome: '', preco: 0, custo: 0, quantidade: 1, subtotal: 0 },
        ]);
      } catch (error) {
        setError(`Erro ao carregar dados: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const adicionarTratamento = () => {
    setTratamentos([
      ...tratamentos,
      { id: tratamentos.length + 1, tratamento_id: '', nome: '', preco: 0, custo: 0, quantidade: 1, subtotal: 0 },
    ]);
  };

  const atualizarTratamento = (id, campo, valor) => {
    const novosTratamentos = tratamentos.map((tratamento) => {
      if (tratamento.id === id) {
        const atualizado = { ...tratamento, [campo]: valor };
        if (campo === 'tratamento_id') {
          const tratamentoSelecionado = tratamentosOptions.find(t => t.id === Number(valor));
          if (tratamentoSelecionado) {
            atualizado.nome = tratamentoSelecionado.nome;
            atualizado.preco = Number(tratamentoSelecionado.preco);
            atualizado.custo = Number(tratamentoSelecionado.custo);
            atualizado.subtotal = atualizado.preco * atualizado.quantidade;
          }
        } else if (campo === 'preco' || campo === 'quantidade') {
          atualizado.subtotal = atualizado.preco * atualizado.quantidade;
        }
        return atualizado;
      }
      return tratamento;
    });
    setTratamentos(novosTratamentos);
  };

  const adicionarComissao = () => {
    setComissoes([
      ...comissoes,
      { id: comissoes.length + 1, profissional_id: '', valor: 0, percentual: 0 },
    ]);
  };

  const atualizarComissao = (id, campo, valor) => {
    setComissoes(
      comissoes.map((comissao) => {
        if (comissao.id === id) {
          const updated = { ...comissao, [campo]: valor };
          if (campo === 'profissional_id' && valor) {
            const prof = profissionais.find(p => p.id == valor);
            if (prof) {
              updated.percentual = prof.pct_comissao;
            }
          }
          return updated;
        }
        return comissao;
      })
    );
  };

  const salvarOrcamento = async () => {
    try {
      setLoading(true);
      const payload = {
        consulta: {
          paciente_id: pacienteSelecionado,
          valor: valorTotal,
          data: new Date().toISOString(),
          status: 'agendado',
          modo: 'orcamento',
          tratamento_id: tratamentos.length > 0 ? tratamentos[0].tratamento_id : null
        }
      };
      await axios.post('http://localhost:3000/api/v1/consultas', payload);
      alert('Orçamento salvo com sucesso!');
      setPacienteSelecionado('');
      setTratamentos([{ id: 1, tratamento_id: '', nome: '', preco: 0, custo: 0, quantidade: 1, subtotal: 0 }]);
      setComissoes([]);
    } catch (error) {
      alert('Erro ao salvar orçamento: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const valorTotal = tratamentos.reduce((total, t) => total + t.subtotal, 0);
  const custoTotal = tratamentos.reduce((total, t) => total + t.custo * t.quantidade, 0);
  const totalComissoes = comissoes.reduce((total, c) => total + (c.valor || 0), 0);
  const lucroFinal = valorTotal - custoTotal - totalComissoes;
  const margemBruta = valorTotal ? ((valorTotal - custoTotal) / valorTotal) * 100 : 0;
  const margemFinal = valorTotal ? (lucroFinal / valorTotal) * 100 : 0;

  if (loading && pacientes.length === 0) {
    return <p className="text-gray-400 italic">Carregando dados...</p>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-sm text-gray-500 mb-1">Paciente</h3>
        <p className="text-xs text-gray-400 mb-2">Selecione o paciente para o orçamento</p>
        <select
          value={pacienteSelecionado}
          onChange={(e) => setPacienteSelecionado(e.target.value)}
          className="w-full p-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-400"
        >
          <option value="">Selecione o paciente</option>
          {pacientes.map((paciente) => (
            <option key={paciente.id} value={paciente.id}>
              {paciente.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-sm text-gray-500 mb-1">Procedimentos e Tratamentos</h3>
        <p className="text-xs text-gray-400 mb-4">Adicione os tratamentos ao orçamento</p>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 px-3 text-left text-xs font-normal text-gray-500">Tratamento</th>
                <th className="py-2 px-3 text-left text-xs font-normal text-gray-500">Preço (R$)</th>
                <th className="py-2 px-3 text-left text-xs font-normal text-gray-500">Custo (R$)</th>
                <th className="py-2 px-3 text-left text-xs font-normal text-gray-500">Qtd</th>
                <th className="py-2 px-3 text-left text-xs font-normal text-gray-500">Subtotal (R$)</th>
              </tr>
            </thead>
            <tbody>
              {tratamentos.map((tratamento) => (
                <tr key={tratamento.id} className="border-b border-gray-100">
                  <td className="py-2 px-3">
                    <select
                      value={tratamento.tratamento_id}
                      onChange={(e) => atualizarTratamento(tratamento.id, 'tratamento_id', e.target.value)}
                      className="w-full p-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                    >
                      <option value="">Selecione o tratamento</option>
                      {tratamentosOptions.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.nome}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={tratamento.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\./g, '').replace(',', '.');
                        const numberValue = parseFloat(value);
                        atualizarTratamento(tratamento.id, 'preco', isNaN(numberValue) ? 0 : numberValue);
                      }}
                      className="w-full p-2 text-sm text-gray-600 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={tratamento.custo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\./g, '').replace(',', '.');
                        const numberValue = parseFloat(value);
                        atualizarTratamento(tratamento.id, 'custo', isNaN(numberValue) ? 0 : numberValue);
                      }}
                      className="w-full p-2 text-sm text-gray-600 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      value={tratamento.quantidade}
                      onChange={(e) => atualizarTratamento(tratamento.id, 'quantidade', Number(e.target.value))}
                      className="w-full p-2 text-sm text-gray-600 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                      min="1"
                    />
                  </td>
                  <td className="py-2 px-3 text-sm text-gray-600">
                    {formatarMoeda(tratamento.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={adicionarTratamento}
          className="mt-4 px-4 py-2 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100 border border-gray-200"
        >
          + Adicionar Tratamento
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-sm text-gray-500 mb-1">Comissões de Profissionais</h3>
        <p className="text-xs text-gray-400 mb-4">Adicione as comissões dos profissionais</p>

        <button
          onClick={adicionarComissao}
          className="mb-4 px-4 py-2 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100 border border-gray-200"
        >
          + Adicionar Comissão
        </button>

        {comissoes.length === 0 ? (
          <p className="text-sm text-gray-400 italic">Nenhuma comissão adicionada</p>
        ) : (
          comissoes.map((comissao) => (
            <div key={comissao.id} className="mb-4 p-4 border border-gray-100 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Profissional</label>
                  <select
                    value={comissao.profissional_id}
                    onChange={(e) => atualizarComissao(comissao.id, 'profissional_id', e.target.value)}
                    className="w-full p-2 text-sm text-gray-600 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                  >
                    <option value="">Selecione</option>
                    {profissionais.map((profissional) => (
                      <option key={profissional.id} value={profissional.id}>
                        {profissional.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Valor (R$)</label>
                  <input
                    type="text"
                    value={comissao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\./g, '').replace(',', '.');
                      const numberValue = parseFloat(value);
                      atualizarComissao(comissao.id, 'valor', isNaN(numberValue) ? 0 : numberValue);
                    }}
                    className="w-full p-2 text-sm text-gray-600 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Percentual (%)</label>
                  <input
                    type="number"
                    value={comissao.percentual}
                    onChange={(e) => atualizarComissao(comissao.id, 'percentual', Number(e.target.value))}
                    className="w-full p-2 text-sm text-gray-600 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-sm text-gray-500 mb-1">Resumo Financeiro</h3>
        <p className="text-xs text-gray-400 mb-4">Resultado final do orçamento</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded border border-gray-100">
            <p className="text-sm text-gray-600"><span className="font-medium">Valor Total:</span> {formatarMoeda(valorTotal)}</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Custo Total:</span> {formatarMoeda(custoTotal)}</p>
          </div>
          <div className="p-4 rounded border border-gray-100">
            <p className="text-sm text-gray-600"><span className="font-medium">Total Comissões:</span> {formatarMoeda(totalComissoes)}</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Lucro Final:</span> {formatarMoeda(lucroFinal)}</p>
          </div>
          <div className="p-4 rounded border border-gray-100">
            <p className="text-sm text-gray-600"><span className="font-medium">Margem Bruta:</span> {margemBruta.toFixed(2)}%</p>
          </div>
          <div className="p-4 rounded border border-gray-100">
            <p className="text-sm text-gray-600"><span className="font-medium">Margem Final:</span> {margemFinal.toFixed(2)}%</p>
          </div>
        </div>
      </div>

      <button 
        onClick={salvarOrcamento}
        disabled={loading}
        className={`w-full py-3 bg-[#A28567] text-white text-sm font-medium rounded hover:bg-[#8a7358] transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Salvando...' : 'Salvar Orçamento'}
      </button>
    </div>
  );
}