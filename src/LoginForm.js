import React, { useState } from "react";
import "./styles/Auth.css";

function LoginForm({ onLogin }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, senha }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                onLogin(data);
            } else {
                setError(data.message || "Erro ao fazer login");
            }
        } catch (error) {
            setError("Erro ao conectar com o servidor");
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Senha"
                    required
                />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}

export default LoginForm; 