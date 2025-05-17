CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES clientes(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE profissionais (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    pct_comissao DECIMAL(5, 2) NOT NULL CHECK (pct_comissao >= 0 AND pct_comissao <= 100)
);

CREATE TABLE tratamentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL CHECK (preco >= 0),
    custo DECIMAL(10, 2) NOT NULL CHECK (custo >= 0),
    status VARCHAR(20) DEFAULT 'ativo'
);

CREATE TABLE consultas (
    id SERIAL PRIMARY KEY,
    paciente_id INT REFERENCES pacientes(id) ON DELETE CASCADE,
    profissional_id INT REFERENCES profissionais(id) ON DELETE SET NULL,
    tratamento_id INT REFERENCES tratamentos(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    valor DECIMAL(10, 2) NOT NULL CHECK (valor >= 0),
    modo VARCHAR(50) NOT NULL,
    returns_count INT NOT NULL CHECK (returns_count >= 0),
    status VARCHAR(20) DEFAULT 'agendado'
);

CREATE INDEX idx_consultas_data ON consultas(data);
CREATE INDEX idx_consultas_paciente_id ON consultas(paciente_id);
CREATE INDEX idx_consultas_profissional_id ON consultas(profissional_id);