const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
// Drivers mais recentes do mongoDB
const MongoClient = require('mongodb').MongoClient;

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// conexão com o mongoDB 
mongoose.connect("mongodb://127.0.0.1:27017/recallnotes");+


// Rotass
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

