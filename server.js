import express from 'express';
import session from 'express-session';
import { Pool } from 'pg';
import path from 'path';
import { fileURLToPath} from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Banco PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cantina',
    password: 'amods',
    port: 7777,
});  


// Configurações
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'cantina2025', resave: false, saveUninitialized: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Verifica se o usuário está logado e redireciona ele para a página correta
function proteger(req, res, next) {
    if (!req.session.usuario) return res.redirect("/");
    next();
}


// Login
app.get("/", (req, res) => res.render("login", { erro: null }));

app.post("/login", async (req, res) =>   {
    const { email, senha } = req.body;
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1 AND senha = $2", [email, senha]);
    if (result.rows.length > 0) {
        req.session.usuario = result.rows[0];
        res.redirect("/dashboard");
    } else {
        res.render("login", { erro: "Email ou senha incorretos!"})
    }
});


// Logout
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});


// 🕑 Dashboard
app.get("/dashboard", proteger, async (req, res) => {
    const busca = req.query.busca || "";
    const query = busca
        ? "SELECT * FROM comidas WHERE nome ILIKE $1 ORDER BY nome"
        : "SELECT * FROM comidas ORDER BY nome";
        const comidas = await pool.query(query, busca ? [`%${busca}%`] : []);
        const vendas = await pool.query(`
            SELECT v.id, u.nome AS usuario, l.nome AS comida, v.quantidade,
                TO_CHAR(v.data_venda, 'DD/MM HH24:MI') as data
            FROM vendas v
            JOIN usuarios u ON u.id = v.usuario_id
            JOIN comidas l ON l.id = v.comida_id
            ORDER BY v.data_venda DESC LIMIT 5
            `);
        res.render("dashboard", { usuario: req.session.usuario, comidas: comidas.rows, vendas: vendas.rows, busca });
});


// 🍕 Cadastrar Comida
app.post("/comidas", proteger, async (req, res) => {
    const { nome, preco, estoque} = req.body;
    if (!nome || !preco) return res.send("⚠️ Preencha todos os campos!");
    await pool.query("INSERT INTO comidas (nome, preco, estoque) VALUES ($1, $2, $3)", [nome, preco, estoque || 0]);
    res.redirect("/dashboard");
});


// ✏️ Atualizar Comida
app.post("/comidas/update/:id", proteger, async (req, res) => {
    const { id } = req.params;
    const { nome, preco, estoque } = req.body;
    await pool.query("UPDATE comidas SET nome=$1, preco=$2, estoque=$3 WHERE id=$4", [nome, preco, estoque, id]);
    res.redirect("/dashboard");
});


// 🗑️ Excluir Comida
app.post("/comidas/delete/:id", proteger, async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM comidas WHERE id=$1", [id]);
    res.redirect("/dashboard");
    });


// 💸 Registar Venda
app.post("/vendas", proteger, async (req, res) => {
    const { comida_id, quantidade } = req.body;
    const usuario_id = req.session.usuario.id;
    await pool.query("INSERT INTO vendas (usuario_id, comida_id, quantidade) VALUES ($1, $2, $3)", [req.session.usuario.id, comida_id, quantidade]);
    await pool.query("UPDATE comidas SET estoque = estoque - $1 WHERE id = $2", [quantidade, comida_id]);
    res.redirect("/dashboard");
});


// 📦 Cadastro de Produtos
app.get("/cadastro-produto", proteger, async (req, res) => {
    const busca = req.query.busca || "";
    const query = busca
        ? "SELECT * FROM comidas WHERE nome ILIKE $1 ORDER BY nome"
        : "SELECT * FROM comidas ORDER BY nome";
    const comidas = await pool.query(query, busca ? [`%${busca}%`] : []);
    res.render("cadastroProduto", { usuario: req.session.usuario, comidas: comidas.rows, busca });
});


// 📊 Gestão de Estoque
app.get("/gestao-estoque", proteger, async (req, res) => {
    const comidas = await pool.query("SELECT * FROM comidas ORDER BY nome");
    const movimentos = await pool.query(`
        SELECT m.id, c.nome AS comida, u.nome AS usuario, m.type, m.quantity,
            TO_CHAR(m.movement_date, 'DD/MM/YYYY') as data, m.balance_after, m.note
        FROM movimentos m
        JOIN comidas c ON c.id = m.comida_id
        JOIN usuarios u ON u.id = m.usuario_id
        ORDER BY m.movement_date DESC, m.id DESC
        LIMIT 20
    `);
    res.render("gestao-estoque", { usuario: req.session.usuario, comidas: comidas.rows, movimentos: movimentos.rows });
});


// ➕ Registrar Movimentação
app.post("/gestao-estoque", proteger, async (req, res) => {
    const { comida_id, type, quantity, movement_date, note } = req.body;
    const usuario_id = req.session.usuario.id;
    
    // Pega o estoque atual
    const comida = await pool.query("SELECT estoque FROM comidas WHERE id = $1", [comida_id]);
    const estoqueAtual = comida.rows[0].estoque;
    
    // Calcula o novo saldo
    const novoSaldo = type === 'entrada' ? estoqueAtual + parseInt(quantity) : estoqueAtual - parseInt(quantity);
    
    // Registra a movimentação
    await pool.query(
        "INSERT INTO movimentos (usuario_id, comida_id, type, quantity, movement_date, balance_after, note) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [usuario_id, comida_id, type, quantity, movement_date, novoSaldo, note || null]
    );
    
    // Atualiza o estoque
    await pool.query("UPDATE comidas SET estoque = $1 WHERE id = $2", [novoSaldo, comida_id]);
    
    res.redirect("/gestao-estoque");
});


// 🚀 Servidor
app.listen(3000, () => console.log("🥓 Cantina está rodando em localhost:3000"))