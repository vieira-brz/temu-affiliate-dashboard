require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.use(express.json());
app.use(cors({ origin: "*" }));

// 🔥 Servir arquivos estáticos (HTML, CSS, JS, imagens, etc.)
app.use(express.static(path.join(__dirname)));

// 🔹 Servir o index.html na raiz
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// 🔹 Servir a página de cadastro corretamente
app.get("/cadastro-de-links-programa-de-afiliados-temu-brasil", (req, res) => {
    res.sendFile(path.join(__dirname, "cadastro-de-links-programa-de-afiliados-temu-brasil.html"));
});

// 🔹 API para buscar os itens no banco
app.get("/api/items", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM itens");
        res.json(result.rows);
    } catch (error) {
        console.error("Erro ao buscar itens:", error);
        res.status(500).json({ error: "Erro ao buscar itens" });
    }
});

// 🔹 API para adicionar novos itens
app.post("/api/items", async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
