import React, { useState } from "react";
import "./styles/Auth.css";

function UsuarioForm({ onAddUsuario }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nome, email, telefone, senha }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                onAddUsuario(data);
                // Limpar campos
                setNome("");
                setEmail("");
                setTelefone("");
                setSenha("");
                setError("");
            } else {
                setError(data.message || "Erro ao cadastrar");
            }
        } catch (error) {
            setError("Erro ao conectar com o servidor");
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Cadastro</h2>
                {error && <p className="error-message">{error}</p>}
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
                <input 
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Senha"
                    required
                />
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    );
}

export default UsuarioForm;
