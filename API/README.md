# API Backend

Este projeto é uma API backend desenvolvida em Ruby on Rails para gerenciar clientes, pacientes, profissionais, consultas e tratamentos.

## Como rodar o projeto

### Pré-requisitos

- Ruby 3.x
- Rails 7.x
- SQLite3 (ou outro banco configurado)
- Bundler

### Passos para rodar

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd prjApi/api
```

2. Instale as dependências:

```bash
bundle install
```

3. Configure o banco de dados:

```bash
rails db:create
rails db:migrate
rails db:seed
```

4. Inicie o servidor:

```bash
rails server
```

O servidor estará disponível em `http://localhost:3000`.

## Como a API funciona

A API segue o padrão REST e possui os seguintes recursos principais:

- **Clientes**: Gerencia os clientes do sistema.
- **Pacientes**: Gerencia os pacientes associados aos clientes.
- **Profissionais**: Gerencia os profissionais que atendem os pacientes.
- **Consultas**: Registra as consultas realizadas entre pacientes e profissionais.
- **Tratamentos**: Gerencia os tratamentos disponíveis e aplicados.

### Endpoints principais

Os endpoints estão disponíveis sob o namespace `/api/v1/`. Exemplos:

- `GET /api/v1/clientes` - Lista todos os clientes.
- `POST /api/v1/pacientes` - Cria um novo paciente.
- `GET /api/v1/profissionais/:id` - Detalhes de um profissional.
- `PUT /api/v1/consultas/:id` - Atualiza uma consulta.
- `DELETE /api/v1/tratamentos/:id` - Remove um tratamento.

### CORS

A configuração de CORS permite requisições de origens específicas para garantir segurança. Ajuste o arquivo `config/initializers/cors.rb` conforme o domínio do frontend.

## Testes

Atualmente, não há testes automatizados configurados. Recomenda-se implementar testes para garantir a qualidade do código.

## Contribuição

Sinta-se à vontade para abrir issues e pull requests para melhorias e correções.

## Licença

Este projeto está licenciado sob a licença MIT.

---
