# README

<h1>Estrutura, Organização e Funcionalidades da Aplicação</h1>
<h2>Estrutura de Diretórios</h2>
API/<br>
├── app/<br>
│   ├── controllers/<br>
│   │   └── api/<br>
│   │       └── v1/<br>
│   │           ├── clientes_controller.rb<br>
│   │           ├── pacientes_controller.rb<br>
│   │           ├── profissionais_controller.rb<br>
│   │           ├── tratamentos_controller.rb<br>
│   │           ├── consultas_controller.rb<br>
│   │           └── comissoes_controller.rb<br>
│   ├── models/<br>
│   │   ├── cliente.rb<br>
│   │   ├── paciente.rb<br>
│   │   ├── profissional.rb<br>
│   │   ├── tratamento.rb<br>
│   │   └── consulta.rb<br>
│   └── ...<br>
├── config/<br>
│   ├── application.rb<br>
│   ├── initializers/<br>
│   │   └── cors.rb<br>
│   ├── routes.rb<br>
│   └── ...<br>
└── db/<br>
    └── seeds.rb<br>
└── migrate/<br>
    ├── AddStatusToConsultas.rb<br>
    ├── AddStatusToTratamentos.rb<br>
    └── AddClienteIdToPacientes.rb<br><br>


<h2>Relações entre os Modelos</h2>

<h3>Cliente</h3>

Tem muitos pacientes (has_many :pacientes)<br>
Validações: nome (obrigatório)<br>
Dependências: ao excluir um cliente, seus pacientes também são excluídos<br><br>


<h3>Paciente</h3>

Pertence a um cliente (belongs_to :cliente, optional: true)<br>
Tem muitas consultas (has_many :consultas)<br>
Validações: nome (obrigatório)<br>
Atributos: nome, objetivo, cliente_id<br>
Dependências: ao excluir um paciente, suas consultas também são excluídas<br><br>


<h3>Profissional</h3>

Tem muitas consultas (has_many :consultas)<br>
Validações: nome (obrigatório), pct_comissao (entre 0 e 100)<br>
Atributos: nome, pct_comissao<br>
Dependências: ao excluir um profissional, suas consultas ficam com o campo profissional_id nulo<br><br>


<h3>Tratamento</h3>

Tem muitas consultas (has_many :consultas)<br>
Validações: nome (obrigatório), preco e custo (valores não negativos)<br>
Atributos: nome, preco, custo, status (padrão: 'ativo')<br><br>


<h3>Consulta</h3>

Pertence a um paciente (belongs_to :paciente)<br>
Pertence a um profissional (belongs_to :profissional)<br>
Pertence a um tratamento (belongs_to :tratamento)<br>
Validações: data (obrigatório), valor (não negativo), modo (obrigatório), returns_count (inteiro não negativo)<br>
Atributos: data, valor, modo, returns_count, status (padrão: 'agendado')<br><br>
Escopos:

recentes: ordenadas pela data mais recente<br>
do_mes_atual: consultas do mês atual<br>
da_semana_atual: consultas da semana atual<br>
concluidas: com status 'concluido'<br>
agendadas: com status 'agendado'<br><br>





<h2>Funcionalidades dos Controladores</h2>
<h3>Clientes (ClientesController)</h3>

index: Lista todos os clientes (apenas id e nome)<br>
create: Cria um novo cliente<br>
cliente_params: Parâmetros permitidos (nome)<br><br>

<h3>Pacientes (PacientesController)</h3>

index: Lista pacientes com dados detalhados de suas consultas (última consulta, valor total, objetivo, modo, retornos, nome do profissional)<br>
create: Cria um novo paciente<br>
paciente_params: Parâmetros permitidos (nome, objetivo, cliente_id)<br><br>

<h3>Profissionais (ProfissionaisController)</h3>

index: Lista todos os profissionais (id, nome, percentual de comissão)<br>
create: Cria um novo profissional<br>
profissional_params: Parâmetros permitidos (nome, pct_comissao)<br><br>

<h3>Tratamentos (TratamentosController)</h3>

index: Lista todos os tratamentos (id, nome, preço, custo, status)<br>
create: Cria um novo tratamento<br>
stats: Retorna estatísticas dos tratamentos (total, concluídos, agendados)<br>
tratamento_params: Parâmetros permitidos (nome, preco, custo, status)<br><br>

<h3>Consultas (ConsultasController)</h3>

index: Lista consultas com filtro por período (semana, mês, todos), paginadas (10 por página)<br>
create: Cria uma nova consulta<br>
dashboard: Gera dados de dashboard com estatísticas (total de tratamentos, receita, comissões, média por tratamento)<br>
consulta_params: Parâmetros permitidos (data, valor, modo, returns_count, paciente_id, profissional_id, tratamento_id, status)<br>
calcular_total_comissoes: Calcula o total de comissões pagas<br>

<h3>Comissões (ComissoesController)</h3>

index: Calcula e retorna comissões dos profissionais (nome, percentual, valor total de consultas, valor da comissão, total com bônus adicional de 2,5%)<br><br>

<h2>Endpoints da API e Formato de Dados</h2>
<h3>Clientes</h3>

<h4>GET /api/v1/clientes</h4>

Retorno: [{"id": 1, "nome": "Nome do Cliente"}, ...]


<h4>POST /api/v1/clientes</h4>

Parâmetros: {"cliente": {"nome": "Nome do Cliente"}}<br>
Retorno (sucesso): {"id": 1, "nome": "Nome do Cliente", ...}<br>
Retorno (erro): {"errors": {"nome": ["não pode ficar em branco"]}}<br><br>



<h3>Pacientes</h3>

<h4>GET /api/v1/pacientes</h4>

Retorno: [{"id": 1, "nome": "Nome do Paciente", <br>
"ultima_consulta": "2025-05-01", <br>
"vl_total": 500.0, <br>
"objetivo": "Tratamento X", <br>
"modo": "presencial", <br>
"retornos": 2, <br>
"profissional": "Nome do Profissional"}, ...]<br><br>


<h4>POST /api/v1/pacientes</h4>

Parâmetros: {"paciente": <br>
{"nome": "Nome do Paciente", <br>
"objetivo": "Objetivo do tratamento",<br> 
"cliente_id": 1}}<br><br>



<h3>Profissionais</h3>

<h4>GET /api/v1/profissionais</h4>

Retorno: [{"id": 1, "nome": "Nome do Profissional", "pct_comissao": 20.0}, ...]


<h4>POST /api/v1/profissionais</h4>

Parâmetros: {"profissional": {"nome": "Nome do Profissional", "pct_comissao": 20.0}}



<h3>Tratamentos</h3>

<h4>GET /api/v1/tratamentos</h4>

Retorno: [{"id": 1, "nome": "Nome do Tratamento", "preco": 100.0, "custo": 20.0, "status": "ativo"}, ...]


<h4>POST /api/v1/tratamentos</h4>

Parâmetros: {"tratamento": {"nome": "Nome do Tratamento", "preco": 100.0, "custo": 20.0, "status": "ativo"}}


<h4>GET /api/v1/tratamentos/stats</h4>

Retorno: {"total": 50, "concluidos": 30, "agendados": 20}



<h3>Consultas</h3>

<h4>GET /api/v1/consultas?periodo=mes</h4>

Parâmetros: periodo (opcional: semana, mes, ou omitido para todos)<br>
Paginação: page=1 (opcional, padrão: 1)<br>
Retorno:

json{
  "consultas": [<br>
    {<br>
      "id": 1,<br>
      "data": "2025-05-01T10:00:00",<br>
      "paciente": "Nome do Paciente",<br>
      "tratamento": "Nome do Tratamento",<br>
      "valor": 100.0,<br>
      "profissional": "Nome do Profissional",<br>
      "status": "concluido"<br>
     }<br>
  ],<br>
  "meta": {<br>
    "current_page": 1,<br>
    "total_pages": 5,<br>
    "total_count": 42<br>
       }<br>
}<br><br>

<h4>POST /api/v1/consultas</h4>

json{<br>
  "consulta": {<br>
    "data": "2025-05-10T14:30:00",<br>
    "valor": 100.0,<br>
    "modo": "presencial",<br>
    "returns_count": 1,<br>
    "paciente_id": 1,<br>
    "profissional_id": 1,<br>
    "tratamento_id": 1,<br>
    "status": "agendado"<br>
       }<br>
}<br><br>

<h4>GET /api/v1/consultas/dashboard</h4>

Retorno:<br><br>

json{<br>
  "total_tratamentos": {<br>
    "valor": 50,<br>
    "concluidos": 30,<br>
    "agendados": 20<br>
  },<br>
  "receita": {<br>
    "total": 5000.0,<br>
    "comissoes": 1000.0<br>
  },<br>
  "media_tratamento": {<br>
    "valor": 100.0,<br>
    "periodo": "Último mês"<br>
       }<br>
}<br><br>


<h3>Comissões</h3>

<h4>GET /api/v1/comissoes</h4>

Retorno:

json[<br>
  {<br>
    "profissional": "Nome do Profissional",<br>
    "percentual_comissao": 20.0,<br>
    "vl_total_consultas": 1000.0,<br>
    "vl_comissao": 200.0,<br>
    "total_comissao": 225.0  // Com bônus adicional de 2.5%<br>
 }<br>
]
<br><br>

<h2>Migrações do Banco de Dados</h2>

<h3>AddStatusToConsultas</h3>

Adiciona campo status às consultas (padrão: 'agendado')<br>
Uso: rails generate migration AddStatusToConsultas status:string<br><br>


<h3>AddStatusToTratamentos</h3>

Adiciona campo status aos tratamentos (padrão: 'ativo')<br>
Uso: rails generate migration AddStatusToTratamentos status:string<br><br>


<h3>AddClienteIdToPacientes</h3>

Adiciona referência do cliente ao paciente (opcional)<br>
Uso: rails generate migration AddClienteIdToPacientes cliente:references<br><br>



<h2>Configurações Importantes</h2>

<h3>config/application.rb</h3>

Define a aplicação como somente API (config.api_only = true)<br>
Carrega as configurações padrão do Rails 7.0<br><br>


<h3>config/initializers/cors.rb</h3>

Permite requisições CORS de qualquer origem (*) para endpoints /api/*<br>
Permite métodos HTTP: GET, POST, PUT, PATCH, DELETE, OPTIONS<br><br>


<h3>config/routes.rb</h3>

Define namespace /api/v1 para todos os endpoints<br>
Configura recursos RESTful e endpoints personalizados
