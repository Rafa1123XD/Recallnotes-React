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
mongoose.connect("mongodb://127.0.0.1:27017/recallnotes");


// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

//definição do modelo de usuario 
const usuarioSchema = new mongoose.Schema({
    nome: String,
    email: String,
    telefone: String,
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

// Rotas
app.post("/api/usuarios", async (req, res) => {
    const usuario = new Usuario(req.body);
    await usuario.save();
    res.json(usuario);
});

app.get("/api/usuarios", async (req, res) => {
    const usuarios = await Usuario.find();
    res.json(usuarios);
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

