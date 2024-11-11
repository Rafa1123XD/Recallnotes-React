import React, { useState } from "react";

function UsuarioForm({ onAddUsuario }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddUsuario({ nome, email, telefone });
        setNome("");
        setEmail("");
        setTelefone("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
            type="text"
            value={nome} 
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
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
        </form>
    );
}

export default UsuarioForm;
