import React, { useState, useEffect, useRef } from "react";
import UsuarioForm from "./UsuarioForm";
import LoginForm from "./LoginForm";
import "./App.css";

function App() {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [mostrarCadastro, setMostrarCadastro] = useState(false);
    const [notas, setNotas] = useState([]);
    const [notaSelecionada, setNotaSelecionada] = useState(null);
    const [categoriaAtual, setCategoriaAtual] = useState('todas');
    const [categorias] = useState(['todas', 'favoritas', 'tarefas', 'pessoal']);
    const [salvandoNota, setSalvandoNota] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (usuarioLogado) {
            fetch("/api/usuarios")
                .then((response) => response.json())
                .then((data) => setUsuarios(data))
                .catch((error) => console.error("Erro ao carregar usuários:", error));
        }
    }, [usuarioLogado]);

    useEffect(() => {
        if (usuarioLogado) {
            fetch(`/api/notas/${usuarioLogado.id}`)
                .then(response => response.json())
                .then(data => {
                    setNotas(data);
                })
                .catch(error => console.error("Erro ao carregar notas:", error));
        }
    }, [usuarioLogado]);

    // Função para adicionar novo usuário
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

    // Função de login
    const handleLogin = (userData) => {
        setUsuarioLogado(userData.usuario);
    };

    // Função de logout
    const handleLogout = () => {
        setUsuarioLogado(null);
        setUsuarios([]);
    };

    // Função para criar nova nota
    const novaNota = async () => {
        if (!usuarioLogado || !usuarioLogado.id) {
            console.error("Usuário não está logado");
            return;
        }

        try {
            const novaNota = {
                titulo: 'Nova nota',
                conteudo: '',
                categoria: categoriaAtual === 'todas' ? 'pessoal' : categoriaAtual,
                usuarioId: usuarioLogado.id
            };

            console.log("Enviando requisição para criar nota:", novaNota); // Log para debug

            const response = await fetch("/api/notas", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novaNota)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao criar nota');
            }

            const notaSalva = await response.json();
            console.log("Nota criada com sucesso:", notaSalva); // Log para debug
            
            setNotas(notasAtuais => [notaSalva, ...notasAtuais]);
            setNotaSelecionada(notaSalva);
        } catch (error) {
            console.error("Erro ao criar nota:", error);
        }
    };

    // Função para atualizar nota
    const atualizarNota = (id, mudancas) => {
        const notasAtualizadas = notas.map(nota => 
            nota._id === id ? { ...nota, ...mudancas } : nota
        );
        setNotas(notasAtualizadas);
        
        if (notaSelecionada && notaSelecionada._id === id) {
            setNotaSelecionada(prev => ({ ...prev, ...mudancas }));
        }
        
        // Debounce para salvar no servidor
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        setSalvandoNota(true);
        
        timeoutRef.current = setTimeout(async () => {
            try {
                const response = await fetch(`/api/notas/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...mudancas,
                        usuarioId: usuarioLogado.id,
                        dataAtualizacao: new Date()
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Erro ao salvar nota');
                }
            } catch (error) {
                console.error('Erro ao salvar nota:', error);
            } finally {
                setSalvandoNota(false);
            }
        }, 1000);
    };

    const mudarCategoria = (notaId, novaCategoria) => {
        const notasAtualizadas = notas.map(nota => 
            nota.id === notaId ? { ...nota, categoria: novaCategoria } : nota
        );
        setNotas(notasAtualizadas);
        
        if (notaSelecionada && notaSelecionada.id === notaId) {
            setNotaSelecionada(prev => ({ ...prev, categoria: novaCategoria }));
        }
    };

    const deletarNota = async (notaId) => {
        try {
            const response = await fetch(`/api/notas/${notaId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                setNotas(notas.filter(nota => nota._id !== notaId));
                if (notaSelecionada?._id === notaId) {
                    setNotaSelecionada(null);
                }
            }
        } catch (error) {
            console.error('Erro ao deletar nota:', error);
        }
    };

    return (
        <div className="App">
            
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
                <div className="app-container">
                    <div className="sidebar">
                        <div className="sidebar-header">
                            <button onClick={novaNota}>+ Nova Nota</button>
                        </div>
                        <div className="categorias">
                            {categorias.map(cat => (
                                <div 
                                    key={cat}
                                    className={`categoria ${categoriaAtual === cat ? 'ativa' : ''}`}
                                    onClick={() => setCategoriaAtual(cat)}
                                >
                                    {cat}
                                </div>
                            ))}
                        </div>
                        <div className="notas-lista">
                            {notas
                                .filter(nota => categoriaAtual === 'todas' || nota.categoria === categoriaAtual)
                                .map(nota => (
                                    <div 
                                        key={nota._id}
                                        className={`nota-item ${notaSelecionada?._id === nota._id ? 'selecionada' : ''}`}
                                        onClick={() => setNotaSelecionada(nota)}
                                    >
                                        <div className="nota-header">
                                            <div className="nota-titulo">{nota.titulo}</div>
                                            <button 
                                                className="deletar-nota"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deletarNota(nota._id);
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <div className="nota-preview">{nota.conteudo.substring(0, 50)}</div>
                                    </div>
                                ))}
                        </div>
                    </div>
                    
                    <div className="editor">
                        {notaSelecionada ? (
                            <>
                                <div className="editor-header">
                                    <input
                                        type="text"
                                        value={notaSelecionada.titulo || ''}
                                        onChange={(e) => atualizarNota(notaSelecionada._id, { titulo: e.target.value })}
                                        className="editor-titulo"
                                        placeholder="Título da nota"
                                    />
                                    <select
                                        value={notaSelecionada.categoria}
                                        onChange={(e) => mudarCategoria(notaSelecionada._id, e.target.value)}
                                        className="categoria-selector"
                                    >
                                        {categorias
                                            .filter(cat => cat !== 'todas')
                                            .map(cat => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <textarea
                                    value={notaSelecionada.conteudo || ''}
                                    onChange={(e) => atualizarNota(notaSelecionada._id, { conteudo: e.target.value })}
                                    className="editor-conteudo"
                                    placeholder="Digite sua nota aqui..."
                                />
                            </>
                        ) : (
                            <div className="editor-placeholder">
                                Selecione uma nota ou crie uma nova
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
