
# Este arquivo contém os dados iniciais para o banco de dados.
# Útil para popular o banco de dados com dados de exemplo.

# Criar clientes
clientes = Cliente.create([
  { nome: 'Clínica Aurora' },
  { nome: 'Clínica Bem Estar' },
  { nome: 'Centro Médico São Lucas' }
])

# Criar tratamentos
tratamentos = Tratamento.create([
  { nome: 'Limpeza Facial', preco: 150.00, custo: 35.00, status: 'ativo' },
  { nome: 'Botox', preco: 890.00, custo: 320.00, status: 'ativo' },
  { nome: 'Drenagem Linfática', preco: 220.00, custo: 60.00, status: 'ativo' },
  { nome: 'Peeling Químico', preco: 300.00, custo: 85.00, status: 'ativo' },
  { nome: 'Massagem Relaxante', preco: 180.00, custo: 45.00, status: 'ativo' }
])

# Criar profissionais
profissionais = Profissional.create([
  { nome: 'Dra. Helena Santos', pct_comissao: 30.0 },
  { nome: 'Dr. Ricardo Oliveira', pct_comissao: 35.0 },
  { nome: 'Dra. Amanda Silva', pct_comissao: 32.0 },
  { nome: 'Dr. Carlos Mendonça', pct_comissao: 28.0 }
])

# Criar pacientes
pacientes = Paciente.create([
  { nome: 'Ana Luiza Fernandes', objetivo: 'Rejuvenescimento facial', cliente: clientes.first },
  { nome: 'João Pedro Marques', objetivo: 'Redução de rugas', cliente: clientes.first },
  { nome: 'Mariana Costa', objetivo: 'Tratamento para acne', cliente: clientes.second },
  { nome: 'Paulo Henrique Duarte', objetivo: 'Hidratação da pele', cliente: clientes.second },
  { nome: 'Carla Beatriz Sousa', objetivo: 'Melhora da elasticidade', cliente: clientes.third }
])

# Criar consultas
data_base = Date.today
Consulta.create([
   
    {data: data_base - 5.days}, 
    {valor: tratamentos[0].preco},
    {modo: 'Presencial'},
    returns_count
])