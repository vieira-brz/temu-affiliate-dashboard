const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;
const FILE_PATH = "itens.json";

app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"]
}));

// Função para ler o arquivo JSON
function readJsonFile() {
    if (!fs.existsSync(FILE_PATH)) {
        fs.writeFileSync(FILE_PATH, "[]", "utf8"); // Se não existir, cria um JSON vazio
    }
    const data = fs.readFileSync(FILE_PATH, "utf8");
    return JSON.parse(data);
}

// Rota para obter os itens cadastrados
app.get("/items", (req, res) => {
    try {
        const items = readJsonFile();
        res.json(items);
    } catch (error) {
        console.error("Erro ao ler itens:", error);
        res.status(500).json({ error: "Erro ao ler itens." });
    }
});

// Rota para adicionar um novo item
app.post("/items", (req, res) => {
    try {
        const { nome, link, imagens } = req.body;
        const items = readJsonFile();
        items.push({ nome, link, imagens });

        fs.writeFileSync(FILE_PATH, JSON.stringify(items, null, 2), "utf8");

        res.json({ success: true, message: "Item salvo com sucesso!" });
    } catch (error) {
        console.error("Erro ao salvar item:", error);
        res.status(500).json({ error: "Erro ao salvar item." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em https://shoplinkbr.vercel.app:${PORT}`);
});
