import React, { useState, useEffect } from "react";
import UsuarioForm from "./UsuarioForm";
import LoginForm from "./LoginForm";
import "./App.css";

function App() {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [mostrarCadastro, setMostrarCadastro] = useState(false);
    const [notas, setNotas] = useState([]);
    const [nota, setNota] = useState('');
    const [itens, setItens] = useState('');
    const [editandoIndice, setEditandoIndice] = useState(null); // Indica qual nota está sendo editada

    // Carregar usuários quando um usuário estiver logado
    useEffect(() => {
        if (usuarioLogado) {
            fetch("/api/usuarios")
                .then((response) => response.json())
                .then((data) => setUsuarios(data))
                .catch((error) => console.error("Erro ao carregar usuários:", error));
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

    // Função para adicionar ou editar a nota
    const adicionarNota = () => {
        if (nota.trim()) {
            if (editandoIndice !== null) {
                // Se estamos editando uma nota existente
                const novasNotas = [...notas];
                novasNotas[editandoIndice] = { ...novasNotas[editandoIndice], nome: nota, itens: itens.split(',') };
                setNotas(novasNotas);
                setEditandoIndice(null); // Limpa o índice de edição
            } else {
                setNotas([...notas, { nome: nota, itens: itens.split(',') }]);
            }
            setNota(''); // Limpa o campo de entrada do título da nota
            setItens(''); // Limpa o campo de entrada dos itens
        }
    };

    // Função para remover uma nota
    const removerNota = (indice) => {
        const novasNotas = notas.filter((_, i) => i !== indice);
        setNotas(novasNotas);
    };

    // Função para remover um item específico de uma nota
    const removerItem = (notaIndice, itemIndice) => {
        const novasNotas = [...notas];
        novasNotas[notaIndice].itens = novasNotas[notaIndice].itens.filter((_, i) => i !== itemIndice);
        setNotas(novasNotas);
    };

    // Função para adicionar um item dentro de uma nota existente
    const adicionarItem = (notaIndice) => {
        if (itens.trim()) {
            const novasNotas = [...notas];
            novasNotas[notaIndice].itens.push(itens);
            setNotas(novasNotas);
            setItens(''); // Limpa o campo de entrada do item
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
                <div className="dashboard">
                    <div className="user-header">
                        <h2>Bem-vindo, {usuarioLogado.nome}!</h2>
                        <button onClick={handleLogout}>Sair</button>
                    </div>
                    
                    {/* Bloco de Notas */}
                    <div className="notas-section">
                        <h3>Bloco de Notas</h3>

                        <div style={styles.inputContainer}>
                            <input
                                type="text"
                                value={nota}
                                onChange={(e) => setNota(e.target.value)}
                                style={styles.input}
                                placeholder="Digite o título da nota"
                            />
                            <input
                                type="text"
                                value={itens}
                                onChange={(e) => setItens(e.target.value)}
                                style={styles.input}
                                placeholder="Adicione itens (separados por vírgula)"
                            />
                            <button onClick={adicionarNota} style={styles.button}>
                                {editandoIndice !== null ? 'Salvar' : 'Adicionar Nota'}
                            </button>
                        </div>

                        <div style={styles.notasContainer}>
                            {notas.map((nota, notaIndex) => (
                                <div key={notaIndex} style={styles.notaPostIt}>
                                    <h4>{nota.nome}</h4>
                                    <ul>
                                        {nota.itens.map((item, itemIndex) => (
                                            <li key={itemIndex} style={styles.item}>
                                                {item}
                                                <button
                                                    onClick={() => removerItem(notaIndex, itemIndex)}
                                                    style={styles.removeItemButton}
                                                >
                                                    Excluir
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    <input
                                        type="text"
                                        value={itens}
                                        onChange={(e) => setItens(e.target.value)}
                                        style={styles.input}
                                        placeholder="Adicionar novo item"
                                    />
                                    <button
                                        onClick={() => adicionarItem(notaIndex)}
                                        style={styles.button}
                                    >
                                        Adicionar Item
                                    </button>
                                    <div>
                                        <button
                                            onClick={() => setNota(nota.nome) && setItens(nota.itens.join(',')) && setEditandoIndice(notaIndex)}
                                            style={styles.editButton}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => removerNota(notaIndex)}
                                            style={styles.removeButton}
                                        >
                                            Excluir Nota
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Estilos simples para o bloco de notas
const styles = {
  inputContainer: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    padding: '10px',
    width: '100%',
    maxWidth: '400px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginBottom: '10px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  notasContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'center',
    width: '100%',
  },
  notaPostIt: {
    backgroundColor: '#FFEB3B',
    padding: '15px',
    margin: '10px',
    borderRadius: '10px',
    width: 'calc(33.33% - 20px)', // 3 colunas por padrão
    minWidth: '250px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    position: 'relative',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#FF9800',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    marginRight: '5px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  removeButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  removeItemButton: {
    backgroundColor: '#FF6347',
    color: '#fff',
    border: 'none',
    padding: '3px 6px',
    marginLeft: '5px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default App;
