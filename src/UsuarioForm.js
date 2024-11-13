import React, { useState } from "react";

function UsuarioForm({ onAddUsuario }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddUsuario({ nome, email, telefone, senha });
        setNome("");
        setEmail("");
        setTelefone("");
        setSenha("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Cadastro</h2>
            <input 
            type="text"
            value={nome} 
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
            required
            />
            <input 
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
                required
            />
            <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            />
            <input 
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="Telefone"
            required
            />
            <button type="submit">Cadastrar</button>
        </form>
    );
}

export default UsuarioForm;
