CREATE DATABASE cantina;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) DEFAULT 'comum'
);

CREATE TABLE comidas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0
);

CREATE TABLE vendas (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    comida_id INT REFERENCES comidas(id) ON DELETE CASCADE ON UPDATE CASCADE,
    quantidade INT NOT NULL,
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nome, email, senha, tipo) VALUES
('Admin Cantina', 'admin@cantina.com', 'senha123', 'admin'),
('Funcionario 1', 'funcionario1@cantina.com', 'senha123', 'comum');

INSERT INTO comidas (nome, preco, estoque) VALUES
('Coxinha', 7.50, 30),
('Pão de Queijo', 5.00, 50),
('Pastel de Carne', 8.00, 25);

INSERT INTO vendas (usuario_id, comida_id, quantidade) VALUES
(2, 1, 2),
(2, 3, 1);

UPDATE comidas
SET estoque = estoque - (
    SELECT COALESCE(SUM(v.quantidade), 0)
    FROM vendas v
    WHERE v.comida_id = comidas.id
);

SELECT * FROM comidas;
SELECT * FROM vendas;
