require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do banco de dados Neon
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Variável de ambiente
    ssl: { rejectUnauthorized: false } // Necessário para o Neon
});

app.use(express.json());
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));

// Rota para obter os itens cadastrados
app.get("/items", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM itens");
        res.json(result.rows);
    } catch (error) {
        console.error("Erro ao buscar itens:", error);
        res.status(500).json({ error: "Erro ao buscar itens" });
    }
});

// Rota para adicionar um novo item
app.post("/items", async (req, res) => {
    try {
        const { nome, link, imagens } = req.body;
        const imagensString = imagens.join(", ");

        await pool.query("INSERT INTO itens (nome, link, imagens) VALUES ($1, $2, $3)", 
            [nome, link, imagensString]);

        res.json({ success: true, message: "Item salvo com sucesso!" });
    } catch (error) {
        console.error("Erro ao salvar item:", error);
        res.status(500).json({ error: "Erro ao salvar item." });
    }
});

// Rota principal para evitar erro "Cannot GET /"
app.get("/", (req, res) => {
    res.send("Servidor rodando corretamente! 🚀");
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});