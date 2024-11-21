import React, { useState, useEffect } from 'react';

function UsersList({ usuario }) {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        fetch("/api/usuarios")
            .then((response) => response.json())
            .then((data) => setUsuarios(data))
            .catch((error) => console.error("Erro ao carregar usuários:", error));
    }, []);

    return (
        <div className="users-container">
            <h2>Lista de Usuários</h2>
            <ul>
                {usuarios.map((usuario) => (
                    <li key={usuario._id}>
                        {usuario.nome} - {usuario.email} - {usuario.telefone}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UsersList; 