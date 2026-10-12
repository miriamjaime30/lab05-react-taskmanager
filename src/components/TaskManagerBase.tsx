import { useState, useEffect } from 'react';

// 1. Estructura estricta de una Tarea y de los Filtros
interface Tarea {
  id: string;
  titulo: string;
  categoria: 'Trabajo' | 'Personal' | 'Estudio';
  completada: boolean;
}

type EstadoFiltro = 'Todas' | 'Pendientes' | 'Completadas';

export default function TaskManager() {
  // 2. ESTADOS
  // Lazy initialization: lee localStorage solo una vez al arrancar
  const [tareas, setTareas] = useState<Tarea[]>(() => {
    const guardadas = localStorage.getItem('mis_tareas');
    return guardadas ? JSON.parse(guardadas) : [];
  });

  const [nuevoTitulo, setNuevoTitulo] = useState<string>('');
  const [nuevaCategoria, setNuevaCategoria] = useState<Tarea['categoria']>('Trabajo');
  const [filtroEstado, setFiltroEstado] = useState<EstadoFiltro>('Todas');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('Todas');

  // 3. EFECTO: guardar automáticamente cuando la lista cambie
  useEffect(() => {
    localStorage.setItem('mis_tareas', JSON.stringify(tareas));
  }, [tareas]);

  // 4. ACCIONES
  const agregarTarea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTitulo.trim()) return;

    const nuevaTarea: Tarea = {
      id: crypto.randomUUID(),
      titulo: nuevoTitulo.trim(),
      categoria: nuevaCategoria,
      completada: false,
    };

    setTareas((anteriores) => [...anteriores, nuevaTarea]);
    setNuevoTitulo('');
  };

  const conmutarCompletada = (id: string) => {
    setTareas((anteriores) =>
      anteriores.map((t) => (t.id === id ? { ...t, completada: !t.completada } : t))
    );
  };

  const eliminarTarea = (id: string) => {
    setTareas((anteriores) => anteriores.filter((t) => t.id !== id));
  };

  // 5. FILTRADO COMBINADO
  const tareasFiltradas = tareas.filter((t) => {
    const cumpleEstado =
      filtroEstado === 'Todas' ||
      (filtroEstado === 'Completadas' && t.completada) ||
      (filtroEstado === 'Pendientes' && !t.completada);
    const cumpleCategoria = filtroCategoria === 'Todas' || t.categoria === filtroCategoria;
    return cumpleEstado && cumpleCategoria;
  });

  // 6. UI
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>📝 Administrador de Tareas</h1>

      <form onSubmit={agregarTarea} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="¿Qué tienes pendiente por hacer?"
          value={nuevoTitulo}
          onChange={(e) => setNuevoTitulo(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <select
          value={nuevaCategoria}
          onChange={(e) => setNuevaCategoria(e.target.value as Tarea['categoria'])}
          style={{ padding: '10px', borderRadius: '5px' }}
        >
          <option value="Trabajo">Trabajo</option>
          <option value="Personal">Personal</option>
          <option value="Estudio">Estudio</option>
        </select>
        <button
          type="submit"
          style={{ padding: '10px 15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Agregar
        </button>
      </form>

      <div
        style={{ display: 'flex', gap: '15px', backgroundColor: '#f3f4f6', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}
      >
        <div>
          <label style={{ marginRight: '5px', fontSize: '14px' }}>Estado:</label>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value as EstadoFiltro)}>
            <option value="Todas">Todas</option>
            <option value="Pendientes">Pendientes</option>
            <option value="Completadas">Completadas</option>
          </select>
        </div>
        <div>
          <label style={{ marginRight: '5px', fontSize: '14px' }}>Categoría:</label>
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
            <option value="Todas">Todas las categorías</option>
            <option value="Trabajo">Trabajo</option>
            <option value="Personal">Personal</option>
            <option value="Estudio">Estudio</option>
          </select>
        </div>
      </div>

      {tareasFiltradas.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center' }}>No hay tareas que coincidan con los filtros.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tareasFiltradas.map((tarea) => (
            <li
              key={tarea.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: tarea.completada ? '#f9fafb' : 'white',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={tarea.completada}
                  onChange={() => conmutarCompletada(tarea.id)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span
                  style={{
                    textDecoration: tarea.completada ? 'line-through' : 'none',
                    color: tarea.completada ? '#9ca3af' : '#1f2937',
                  }}
                >
                  {tarea.titulo}
                </span>
                <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '10px', backgroundColor: '#e0e7ff', color: '#4338ca' }}>
                  {tarea.categoria}
                </span>
              </div>
              <button
                onClick={() => eliminarTarea(tarea.id)}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '14px' }}
              >
                ❌ Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
