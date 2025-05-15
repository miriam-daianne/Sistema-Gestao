# README

<h1>Estrutura, Organização e Funcionalidades da Aplicação</h1>
<h2>Estrutura de Diretórios</h2>
API/
├── app/
│   ├── controllers/
│   │   └── api/
│   │       └── v1/
│   │           ├── clientes_controller.rb
│   │           ├── pacientes_controller.rb
│   │           ├── profissionais_controller.rb
│   │           ├── tratamentos_controller.rb
│   │           ├── consultas_controller.rb
│   │           └── comissoes_controller.rb
│   ├── models/
│   │   ├── cliente.rb
│   │   ├── paciente.rb
│   │   ├── profissional.rb
│   │   ├── tratamento.rb
│   │   └── consulta.rb
│   └── ...
├── config/
│   ├── application.rb
│   ├── initializers/
│   │   └── cors.rb
│   ├── routes.rb
│   └── ...
└── db/
    └── migrate/
        ├── AddStatusToConsultas.rb
        ├── AddStatusToTratamentos.rb
        └── AddClienteIdToPacientes.rb


<h2>Relações entre os Modelos</h2>

Cliente

Tem muitos pacientes (has_many :pacientes)
Validações: nome (obrigatório)
Dependências: ao excluir um cliente, seus pacientes também são excluídos


Paciente

Pertence a um cliente (belongs_to :cliente, optional: true)
Tem muitas consultas (has_many :consultas)
Validações: nome (obrigatório)
Atributos: nome, objetivo, cliente_id
Dependências: ao excluir um paciente, suas consultas também são excluídas


Profissional

Tem muitas consultas (has_many :consultas)
Validações: nome (obrigatório), pct_comissao (entre 0 e 100)
Atributos: nome, pct_comissao
Dependências: ao excluir um profissional, suas consultas ficam com o campo profissional_id nulo


Tratamento

Tem muitas consultas (has_many :consultas)
Validações: nome (obrigatório), preco e custo (valores não negativos)
Atributos: nome, preco, custo, status (padrão: 'ativo')


Consulta

Pertence a um paciente (belongs_to :paciente)
Pertence a um profissional (belongs_to :profissional)
Pertence a um tratamento (belongs_to :tratamento)
Validações: data (obrigatório), valor (não negativo), modo (obrigatório), returns_count (inteiro não negativo)
Atributos: data, valor, modo, returns_count, status (padrão: 'agendado')
Escopos:

recentes: ordenadas pela data mais recente
do_mes_atual: consultas do mês atual
da_semana_atual: consultas da semana atual
concluidas: com status 'concluido'
agendadas: com status 'agendado'





Funcionalidades dos Controladores
Clientes (ClientesController)

index: Lista todos os clientes (apenas id e nome)
create: Cria um novo cliente
cliente_params: Parâmetros permitidos (nome)

Pacientes (PacientesController)

index: Lista pacientes com dados detalhados de suas consultas (última consulta, valor total, objetivo, modo, retornos, nome do profissional)
create: Cria um novo paciente
paciente_params: Parâmetros permitidos (nome, objetivo, cliente_id)

Profissionais (ProfissionaisController)

index: Lista todos os profissionais (id, nome, percentual de comissão)
create: Cria um novo profissional
profissional_params: Parâmetros permitidos (nome, pct_comissao)

Tratamentos (TratamentosController)

index: Lista todos os tratamentos (id, nome, preço, custo, status)
create: Cria um novo tratamento
stats: Retorna estatísticas dos tratamentos (total, concluídos, agendados)
tratamento_params: Parâmetros permitidos (nome, preco, custo, status)

Consultas (ConsultasController)

index: Lista consultas com filtro por período (semana, mês, todos), paginadas (10 por página)
create: Cria uma nova consulta
dashboard: Gera dados de dashboard com estatísticas (total de tratamentos, receita, comissões, média por tratamento)
consulta_params: Parâmetros permitidos (data, valor, modo, returns_count, paciente_id, profissional_id, tratamento_id, status)
calcular_total_comissoes: Calcula o total de comissões pagas

Comissões (ComissoesController)

index: Calcula e retorna comissões dos profissionais (nome, percentual, valor total de consultas, valor da comissão, total com bônus adicional de 2,5%)

Endpoints da API e Formato de Dados
Clientes

GET /api/v1/clientes

Retorno: [{"id": 1, "nome": "Nome do Cliente"}, ...]


POST /api/v1/clientes

Parâmetros: {"cliente": {"nome": "Nome do Cliente"}}
Retorno (sucesso): {"id": 1, "nome": "Nome do Cliente", ...}
Retorno (erro): {"errors": {"nome": ["não pode ficar em branco"]}}



Pacientes

GET /api/v1/pacientes

Retorno: [{"id": 1, "nome": "Nome do Paciente", "ultima_consulta": "2025-05-01", "vl_total": 500.0, "objetivo": "Tratamento X", "modo": "presencial", "retornos": 2, "profissional": "Nome do Profissional"}, ...]


POST /api/v1/pacientes

Parâmetros: {"paciente": {"nome": "Nome do Paciente", "objetivo": "Objetivo do tratamento", "cliente_id": 1}}



Profissionais

GET /api/v1/profissionais

Retorno: [{"id": 1, "nome": "Nome do Profissional", "pct_comissao": 20.0}, ...]


POST /api/v1/profissionais

Parâmetros: {"profissional": {"nome": "Nome do Profissional", "pct_comissao": 20.0}}



Tratamentos

GET /api/v1/tratamentos

Retorno: [{"id": 1, "nome": "Nome do Tratamento", "preco": 100.0, "custo": 20.0, "status": "ativo"}, ...]


POST /api/v1/tratamentos

Parâmetros: {"tratamento": {"nome": "Nome do Tratamento", "preco": 100.0, "custo": 20.0, "status": "ativo"}}


GET /api/v1/tratamentos/stats

Retorno: {"total": 50, "concluidos": 30, "agendados": 20}



Consultas

GET /api/v1/consultas?periodo=mes

Parâmetros: periodo (opcional: semana, mes, ou omitido para todos)
Paginação: page=1 (opcional, padrão: 1)
Retorno:

json{
  "consultas": [
    {
      "id": 1,
      "data": "2025-05-01T10:00:00",
      "paciente": "Nome do Paciente",
      "tratamento": "Nome do Tratamento",
      "valor": 100.0,
      "profissional": "Nome do Profissional",
      "status": "concluido"
    }
  ],
  "meta": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 42
  }
}

POST /api/v1/consultas

Parâmetros:

json{
  "consulta": {
    "data": "2025-05-10T14:30:00",
    "valor": 100.0,
    "modo": "presencial",
    "returns_count": 1,
    "paciente_id": 1,
    "profissional_id": 1,
    "tratamento_id": 1,
    "status": "agendado"
  }
}

GET /api/v1/consultas/dashboard

Retorno:

json{
  "total_tratamentos": {
    "valor": 50,
    "concluidos": 30,
    "agendados": 20
  },
  "receita": {
    "total": 5000.0,
    "comissoes": 1000.0
  },
  "media_tratamento": {
    "valor": 100.0,
    "periodo": "Último mês"
  }
}


Comissões

GET /api/v1/comissoes

Retorno:

json[
  {
    "profissional": "Nome do Profissional",
    "percentual_comissao": 20.0,
    "vl_total_consultas": 1000.0,
    "vl_comissao": 200.0,
    "total_comissao": 225.0  // Com bônus adicional de 2.5%
  }
]


<h2>Migrações do Banco de Dados</h2>

AddStatusToConsultas

Adiciona campo status às consultas (padrão: 'agendado')
Uso: rails generate migration AddStatusToConsultas status:string


AddStatusToTratamentos

Adiciona campo status aos tratamentos (padrão: 'ativo')
Uso: rails generate migration AddStatusToTratamentos status:string


AddClienteIdToPacientes

Adiciona referência do cliente ao paciente (opcional)
Uso: rails generate migration AddClienteIdToPacientes cliente:references



Configurações Importantes

config/application.rb

Define a aplicação como somente API (config.api_only = true)
Carrega as configurações padrão do Rails 7.0


config/initializers/cors.rb

Permite requisições CORS de qualquer origem (*) para endpoints /api/*
Permite métodos HTTP: GET, POST, PUT, PATCH, DELETE, OPTIONS


config/routes.rb

Define namespace /api/v1 para todos os endpoints
Configura recursos RESTful e endpoints personalizados