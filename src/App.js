import React, { useState, useEffect } from "react";
import UsuarioForm from "./UsuarioForm";
import LoginForm from "./LoginForm";
import "./App.css";

function App() {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [mostrarCadastro, setMostrarCadastro] = useState(false);

    useEffect(() => {
        if (usuarioLogado) {
            fetch("/api/usuarios")
                .then((response) => response.json())
                .then((data) => setUsuarios(data))
                .catch((error) => console.error("Erro ao carregar usuários:", error));
        }
    }, [usuarioLogado]);

    const addUsuario = async (usuario) => {
        try {
            const response = await fetch("/api/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(usuario),
            });

            const data = await response.json();
            
            if (response.ok) {
                setUsuarios((prev) => [...prev, data]);
                setMostrarCadastro(false);
                alert("Usuário cadastrado com sucesso!");
            } else {
                alert(data.message || "Erro ao cadastrar usuário");
            }
        } catch (error) {
            alert("Erro ao conectar com o servidor");
        }
    };

    const handleLogin = (userData) => {
        setUsuarioLogado(userData.usuario);
    };

    const handleLogout = () => {
        setUsuarioLogado(null);
        setUsuarios([]);
    };

    return (
        <div className="App">
            <h1>Sistema de Usuários</h1>
            
            {!usuarioLogado ? (
                <div className="auth-container">
                    {!mostrarCadastro ? (
                        <>
                            <LoginForm onLogin={handleLogin} />
                            <p>
                                Não tem uma conta?{" "}
                                <button onClick={() => setMostrarCadastro(true)}>
                                    Cadastre-se
                                </button>
                            </p>
                        </>
                    ) : (
                        <>
                            <UsuarioForm onAddUsuario={addUsuario} />
                            <p>
                                Já tem uma conta?{" "}
                                <button onClick={() => setMostrarCadastro(false)}>
                                    Fazer Login
                                </button>
                            </p>
                        </>
                    )}
                </div>
            ) : (
                <div className="dashboard">
                    <div className="user-header">
                        <h2>Bem-vindo, {usuarioLogado.nome}!</h2>
                        <button onClick={handleLogout}>Sair</button>
                    </div>
                    <div className="users-list">
                        <h3>Lista de Usuários</h3>
                        <ul>
                            {usuarios.map((usuario) => (
                                <li key={usuario._id}>
                                    {usuario.nome} - {usuario.email} - {usuario.telefone}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;

