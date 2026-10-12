import { useState, useEffect } from 'react';

// 1. Estructura de los datos que devuelve la API
interface Usuario {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
}

export default function BuscadorUsuarios() {
  // 2. Estados
  const [busqueda, setBusqueda] = useState<string>('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  // 3. EFECTO 1: traer los datos de la API una sola vez
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((data: Usuario[]) => {
        setUsuarios(data);
        setUsuariosFiltrados(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error('Error al traer usuarios:', error);
        setCargando(false);
      });
  }, []);

  // 4. EFECTO 2: filtrar cada vez que cambia 'busqueda' o 'usuarios'
  useEffect(() => {
    const resultadoFiltrado = usuarios.filter(
      (usuario) =>
        usuario.name.toLowerCase().includes(busqueda.toLowerCase()) ||
        usuario.email.toLowerCase().includes(busqueda.toLowerCase())
    );
    setUsuariosFiltrados(resultadoFiltrado);
  }, [busqueda, usuarios]);

  // 5. Interfaz
  return (
    <div style={{ padding: '20px', maxWidth: '500px', fontFamily: 'sans-serif' }}>
      <h2>🔍 Buscador de Usuarios</h2>

      <input
        type="text"
        placeholder="Buscar por nombre o email..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          fontSize: '16px',
        }}
      />

      {cargando ? (
        <p>Cargando usuarios...</p>
      ) : usuariosFiltrados.length === 0 ? (
        <p>No se encontraron resultados para "{busqueda}"</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {usuariosFiltrados.map((usuario) => (
            <li
              key={usuario.id}
              style={{ padding: '10px', borderBottom: '1px solid #eee', marginBottom: '10px' }}
            >
              <strong>{usuario.name}</strong>
              <div style={{ fontSize: '14px', color: '#666' }}>{usuario.email}</div>
              <div style={{ fontSize: '12px', color: '#999' }}>🏢 {usuario.company.name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}