import { useState, useEffect } from 'react';
import axios from 'axios';

export function Calc() {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState('');
  const [tratamentos, setTratamentos] = useState([]);
  const [tratamentosOptions, setTratamentosOptions] = useState([]);
  const [comissoes, setComissoes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configuração do Axios
  const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    timeout: 5000,
  });

  // Buscar dados iniciais com tratamento de erro melhorado
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const pacientesEndpoint = '/pacientes';
        const profissionaisEndpoint = '/profissionais';
        const tratamentosEndpoint = '/tratamentos';

        const [pacientesRes, profissionaisRes, tratamentosRes] = await Promise.all([
          api.get(pacientesEndpoint).catch(err => {
            console.error('Erro ao buscar pacientes:', err);
            throw err;
          }),
          api.get(profissionaisEndpoint).catch(err => {
            console.error('Erro ao buscar profissionais:', err);
            throw err;
          }),
          api.get(tratamentosEndpoint).catch(err => {
            console.error('Erro ao buscar tratamentos:', err);
            throw err;
          }),
        ]);

        setPacientes(pacientesRes.data);
        setProfissionais(profissionaisRes.data);
        setTratamentosOptions(tratamentosRes.data);
        // Initialize tratamentos with one empty treatment
        setTratamentos([
          { id: 1, tratamento_id: '', nome: '', preco: 0, custo: 0, quantidade: 1, subtotal: 0 },
        ]);
      } catch (error) {
        console.error('Erro detalhado:', error);
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
          } else {
            atualizado.nome = '';
            atualizado.preco = 0;
            atualizado.custo = 0;
            atualizado.subtotal = 0;
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
    return (
      <div className="max-w-4xl p-6">
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="max-w-4xl p-6">
        <div className="mb-8">
          <h1 className="text-lg font-medium text-[#A28567] mb-2">Calculadora de Comissões</h1>
          <p className="text-sm text-gray-400 mb-6">Calcule comissões e analise a viabilidade de orçamentos</p>
          <h4 className="text-lg font-medium text-gray-500 mb-2">Paciente</h4>
          <select
            value={pacienteSelecionado}
            onChange={(e) => setPacienteSelecionado(e.target.value)}
            className="w-full p-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-400"
          >
            <option value="">Selecione o paciente</option>
            {pacientes.map((paciente) => (
              <option key={paciente.id} value={paciente.id}>
                {paciente.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t border-gray-100 pt-6 mb-8">
          <h4 className="text-lg font-medium text-gray-500 mb-3">Procedimentos e Tratamentos</h4>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">Tratamento</th>
                  <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">Preço (R$)</th>
                  <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">Custo (R$)</th>
                  <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">Qtd</th>
                  <th className="py-2 px-3 text-left text-sm font-normal text-gray-500">Subtotal (R$)</th>
                </tr>
              </thead>
              <tbody>
                {tratamentos.map((tratamento) => (
                  <tr key={tratamento.id} className="border-b border-gray-100">
                    <td className="py-2 px-3">
                      <select
                        value={tratamento.tratamento_id}
                        onChange={(e) => atualizarTratamento(tratamento.id, 'tratamento_id', e.target.value)}
                        className="w-full p-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-gray-400"
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
                        inputMode="decimal"
                        pattern="^\\d{1,3}(\\.\\d{3})*(,\\d{2})?$"
                        value={tratamento.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\./g, '').replace(',', '.');
                          const numberValue = parseFloat(value);
                          atualizarTratamento(tratamento.id, 'preco', isNaN(numberValue) ? 0 : numberValue);
                        }}
                        className="w-full p-1 text-sm text-gray-600 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                        style={{ MozAppearance: 'textfield' }}
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        inputMode="decimal"
                        pattern="^\\d{1,3}(\\.\\d{3})*(,\\d{2})?$"
                        value={tratamento.custo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\./g, '').replace(',', '.');
                          const numberValue = parseFloat(value);
                          atualizarTratamento(tratamento.id, 'custo', isNaN(numberValue) ? 0 : numberValue);
                        }}
                        className="w-full p-1 text-sm text-gray-600 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                        style={{ MozAppearance: 'textfield' }}
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={tratamento.quantidade}
                        onChange={(e) => atualizarTratamento(tratamento.id, 'quantidade', Number(e.target.value))}
                        className="w-full p-1 text-sm text-gray-600 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                        min="1"
                      />
                    </td>
                    <td className="py-2 px-3 text-sm text-gray-600">
                      R$ {tratamento.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={adicionarTratamento}
            className="mt-3 px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100 border border-gray-200"
          >
            + Adicionar Tratamento
          </button>
        </div>

        <div className="border-t border-gray-100 pt-6 mb-8">
          <h4 className="text-lg font-medium text-gray-500 mb-3">Comissões de Profissionais</h4>

          <button
            onClick={adicionarComissao}
            className="mb-3 px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100 border border-gray-200"
          >
            + Adicionar Comissão
          </button>

          {comissoes.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhuma comissão adicionada</p>
          ) : (
            comissoes.map((comissao) => (
              <div key={comissao.id} className="mb-3 p-3 border border-gray-100 rounded">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Profissional</label>
                    <select
                      value={comissao.profissional_id}
                      onChange={(e) => atualizarComissao(comissao.id, 'profissional_id', e.target.value)}
                      className="w-full p-1.5 text-sm text-gray-600 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
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
                      inputMode="decimal"
                      pattern="^\\d{1,3}(\\.\\d{3})*(,\\d{2})?$"
                      value={comissao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\./g, '').replace(',', '.');
                        const numberValue = parseFloat(value);
                        atualizarComissao(comissao.id, 'valor', isNaN(numberValue) ? 0 : numberValue);
                      }}
                      className="w-full p-1.5 text-sm text-gray-600 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                      style={{ MozAppearance: 'textfield' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Percentual (%)</label>
                    <input
                      type="number"
                      value={comissao.percentual}
                      onChange={(e) => atualizarComissao(comissao.id, 'percentual', Number(e.target.value))}
                      className="w-full p-1.5 text-sm text-gray-600 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-100 pt-6 mb-8">
          <h2 className="text-lg font-medium text-gray-500 mb-3">Resumo Financeiro</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded border border-gray-100">
              <p className="text-sm text-gray-600"><span className="font-medium">Valor Total:</span> R$ {valorTotal.toFixed(2)}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Custo Total:</span> R$ {custoTotal.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded border border-gray-100">
              <p className="text-sm text-gray-600"><span className="font-medium">Total Comissões:</span> R$ {totalComissoes.toFixed(2)}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Lucro Final:</span> R$ {lucroFinal.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded border border-gray-100">
              <p className="text-sm text-gray-600"><span className="font-medium">Margem Bruta:</span> {margemBruta.toFixed(2)}%</p>
            </div>
            <div className="p-3 rounded border border-gray-100">
              <p className="text-sm text-gray-600"><span className="font-medium">Margem Final:</span> {margemFinal.toFixed(2)}%</p>
            </div>
          </div>
        </div>

        <button 
          onClick={salvarOrcamento}
          disabled={loading}
          className={`w-full py-2 bg-[#A28567] text-white text-sm font-medium rounded hover:bg-[#8a7358] transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Salvando...' : 'Salvar Orçamento'}
        </button>
      </div>

    </div>
  );
}
