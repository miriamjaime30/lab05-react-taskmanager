import { useState, useEffect } from 'react';

interface Usuario {
  id: number;
  name: string;
  email: string;
}

export default function BuscadorUsuariosSeguro() {
  const [busqueda, setBusqueda] = useState<string>('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  // 1. Estado para el error (mensaje de texto o null)
  const [error, setError] = useState<string | null>(null);

  // 2. Función aislada para la petición (permite reutilizarla en "Reintentar")
  const cargarUsuarios = async () => {
    setCargando(true);
    setError(null); // limpiamos errores previos

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');

      // fetch NO lanza error con 404 o 500, hay que validarlo a mano
      if (!response.ok) {
        throw new Error(`Error de servidor: Código ${response.status}`);
      }

      const data: Usuario[] = await response.json();
      setUsuarios(data);
      setUsuariosFiltrados(data);
    } catch (err) {
      console.error('Detalles del error:', err);
      setError('No pudimos conectar con el servidor. Revisa tu conexión a internet.');
    } finally {
      // se ejecuta siempre, falle o no la petición
      setCargando(false);
    }
  };

  // 3. Llamamos a la función al montar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []);

  // 4. Efecto de filtrado
  useEffect(() => {
    const resultado = usuarios.filter((u) =>
      u.name.toLowerCase().includes(busqueda.toLowerCase())
    );
    setUsuariosFiltrados(resultado);
  }, [busqueda, usuarios]);

  // 5. Renderizado condicional
  return (
    <div style={{ padding: '20px', maxWidth: '500px', fontFamily: 'sans-serif' }}>
      <h2>🔍 Buscador de Usuarios (con control de errores)</h2>

      <input
        type="text"
        placeholder="Buscar usuario..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        disabled={!!error || cargando}
        style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
      />

      {/* CASO 1: cargando */}
      {cargando && <p>⏳ Cargando usuarios...</p>}

      {/* CASO 2: la API falló */}
      {!cargando && error && (
        <div
          style={{ padding: '15px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '5px' }}
        >
          <p><strong>⚠️ Error:</strong> {error}</p>
          <button
            onClick={cargarUsuarios}
            style={{
              padding: '8px 12px',
              backgroundColor: '#991b1b',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            Reintentar conexión
          </button>
        </div>
      )}

      {/* CASO 3: éxito pero sin resultados */}
      {!cargando && !error && usuariosFiltrados.length === 0 && (
        <p>No se encontraron resultados.</p>
      )}

      {/* CASO 4: éxito con lista */}
      {!cargando && !error && usuariosFiltrados.length > 0 && (
        <ul>
          {usuariosFiltrados.map((u) => (
            <li key={u.id}>
              {u.name} ({u.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}