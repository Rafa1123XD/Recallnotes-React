const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
// Drivers mais recentes do mongoDB
const MongoClient = require('mongodb').MongoClient;

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());

// conexão com o mongoDB 
mongoose.connect("mongodb://127.0.0.1:27017/recallnotes");+


// Rotas
app.get("/", (req, res) => {
    res.json({
        message: "Bem-vindo à API do RecallNotes",
        endpoints: {
            login: {
                url: "/api/login",
                method: "POST",
                description: "Autenticação de usuários"
            },
            cadastro: {
                url: "/api/usuarios",
                method: "POST",
                description: "Cadastro de novos usuários"
            },
            listarUsuarios: {
                url: "/api/usuarios",
                method: "GET",
                description: "Lista todos os usuários (requer autenticação)"
            },
            deletarUsuario: {
                url: "/api/usuarios/:id",
                method: "DELETE",
                description: "Remove um usuário específico"
            }
        },
        status: "online",
        versao: "1.0.0"
    });
});

//definição do modelo de usuario 
const usuarioSchema = new mongoose.Schema({
    nome: String,
    email: { type: String, unique: true },
    telefone: String,
    senha: String
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

// Rotas
app.post("/api/login", async (req, res) => {
    try {
        const { email, senha } = req.body;
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(401).json({ message: "Email não encontrado" });
        }

        if (usuario.senha !== senha) {
            return res.status(401).json({ message: "Senha incorreta" });
        }

        res.json({ 
            message: "Login realizado com sucesso",
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor" });
    }
});

app.post("/api/usuarios", async (req, res) => {
    try {
        const emailExistente = await Usuario.findOne({ email: req.body.email });
        if (emailExistente) {
            return res.status(400).json({ message: "Email já cadastrado" });
        }

        const usuario = new Usuario(req.body);
        await usuario.save();
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: "Erro ao criar usuário" });
    }
});

// Rota pra deletar um usuario
app.delete("/api/usuarios/:id", async (req, res) => {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario deletado com sucesso" });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

const notaSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    titulo: { type: String, default: 'Nova nota' },
    conteudo: { type: String, default: '' },
    categoria: { type: String, default: 'pessoal' },
    dataCriacao: { type: Date, default: Date.now },
    dataAtualizacao: { type: Date, default: Date.now }
});

const Nota = mongoose.model("Nota", notaSchema);

// Criar nova nota
app.post("/api/notas", async (req, res) => {
    try {
        console.log("Recebendo requisição para criar nota:", req.body); // Log para debug
        
        const novaNota = new Nota({
            usuarioId: req.body.usuarioId,
            titulo: req.body.titulo || 'Nova nota',
            conteudo: req.body.conteudo || '',
            categoria: req.body.categoria || 'pessoal'
        });

        const notaSalva = await novaNota.save();
        console.log("Nota criada com sucesso:", notaSalva); // Log para debug
        res.status(201).json(notaSalva);
    } catch (error) {
        console.error("Erro ao criar nota:", error); // Log para debug
        res.status(500).json({ message: "Erro ao criar nota", error: error.message });
    }
});

// Buscar todas as notas de um usuário
app.get("/api/notas/:usuarioId", async (req, res) => {
    try {
        const notas = await Nota.find({ usuarioId: req.params.usuarioId });
        res.json(notas);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar notas" });
    }
});

// Atualizar nota
app.put("/api/notas/:id", async (req, res) => {
    try {
        const nota = await Nota.findByIdAndUpdate(
            req.params.id,
            { ...req.body, dataAtualizacao: new Date() },
            { new: true }
        );
        res.json(nota);
    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar nota" });
    }
});

// Deletar nota
app.delete("/api/notas/:id", async (req, res) => {
    try {
        await Nota.findByIdAndDelete(req.params.id);
        res.json({ message: "Nota deletada com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar nota" });
    }
});

