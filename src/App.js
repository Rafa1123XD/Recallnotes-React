import React, { useState, useEffect } from "react";
import UsuarioForm from "./UsuarioForm";

function App() {
 const [usuarios, setUsuarios] = useState([]);

 useEffect(() => {
  fetch("/api/usuarios")
  .then((response) => response.json())
  .then((data) => setUsuarios(data))
 }, []);

 const addUsuario = (usuario) => {
  fetch("/api/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  })
  .then((response) => response.json())
  .then((newCliente) => setUsuarios((prev) => [...prev, newCliente]));
 };

 return (
  <div>
    <h1>Cadastro de Usuários</h1>
    <UsuarioForm onAddUsuario={addUsuario} />
    <ul>
      {usuarios.map((usuario) => (
        <li key={usuario._id}>{usuario.nome} {usuario.email} {usuario.telefone}</li>
      ))}
    </ul>
  </div>
 );
}

export default App;

