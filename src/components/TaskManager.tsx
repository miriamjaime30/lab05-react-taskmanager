import { useState, useEffect } from 'react';

// 1. TIPOS
type Prioridad = 'low' | 'medium' | 'high';
type EstadoFiltro = 'Todas' | 'Pendientes' | 'Completadas';
type Orden = 'Ninguno' | 'MayorAMenor' | 'MenorAMayor';

interface Tarea {
  id: string;
  titulo: string;
  categoria: 'Trabajo' | 'Personal' | 'Estudio';
  completada: boolean;
  priority: Prioridad; // NUEVA PROPIEDAD (tarea del laboratorio)
}

// Peso numérico para poder ordenar por prioridad
const PESO_PRIORIDAD: Record<Prioridad, number> = { low: 1, medium: 2, high: 3 };

const COLOR_PRIORIDAD: Record<Prioridad, { bg: string; color: string }> = {
  low: { bg: '#dcfce7', color: '#166534' },
  medium: { bg: '#fef9c3', color: '#854d0e' },
  high: { bg: '#fee2e2', color: '#991b1b' },
};

export default function TaskManager() {
  // 2. ESTADOS
  const [tareas, setTareas] = useState<Tarea[]>(() => {
    const guardadas = localStorage.getItem('mis_tareas');
    if (!guardadas) return [];
    // Compatibilidad: tareas antiguas sin priority reciben 'medium'
    return (JSON.parse(guardadas) as Tarea[]).map((t) => ({
      ...t,
      priority: t.priority ?? 'medium',
    }));
  });

  // Formulario
  const [nuevoTitulo, setNuevoTitulo] = useState<string>('');
  const [nuevaCategoria, setNuevaCategoria] = useState<Tarea['categoria']>('Trabajo');
  const [nuevaPrioridad, setNuevaPrioridad] = useState<Prioridad>('medium');

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState<EstadoFiltro>('Todas');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('Todas');
  const [filtroPrioridad, setFiltroPrioridad] = useState<'Todas' | Prioridad>('Todas');
  const [orden, setOrden] = useState<Orden>('Ninguno');
  const [busqueda, setBusqueda] = useState<string>('');

  // 3. EFECTO: persistir en localStorage
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
      priority: nuevaPrioridad,
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

  // 5. FILTRADO COMBINADO + ORDENAMIENTO
  const tareasFiltradas = tareas
    .filter((t) => {
      const cumpleEstado =
        filtroEstado === 'Todas' ||
        (filtroEstado === 'Completadas' && t.completada) ||
        (filtroEstado === 'Pendientes' && !t.completada);
      const cumpleCategoria = filtroCategoria === 'Todas' || t.categoria === filtroCategoria;
      const cumplePrioridad = filtroPrioridad === 'Todas' || t.priority === filtroPrioridad;
      const cumpleBusqueda = t.titulo.toLowerCase().includes(busqueda.toLowerCase());
      return cumpleEstado && cumpleCategoria && cumplePrioridad && cumpleBusqueda;
    })
    .sort((a, b) => {
      if (orden === 'MayorAMenor') return PESO_PRIORIDAD[b.priority] - PESO_PRIORIDAD[a.priority];
      if (orden === 'MenorAMayor') return PESO_PRIORIDAD[a.priority] - PESO_PRIORIDAD[b.priority];
      return 0;
    });

  const totalCompletadas = tareas.filter((t) => t.completada).length;

  // 6. UI
  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>📝 Administrador de Tareas</h1>

      {/* Marcador dinámico */}
      <p style={{ color: '#374151', fontWeight: 'bold' }}>
        {totalCompletadas} de {tareas.length} tareas completadas
      </p>

      {/* Formulario */}
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
        <select
          value={nuevaPrioridad}
          onChange={(e) => setNuevaPrioridad(e.target.value as Prioridad)}
          style={{ padding: '10px', borderRadius: '5px' }}
        >
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
        <button
          type="submit"
          style={{ padding: '10px 15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Agregar
        </button>
      </form>

      {/* Barra de filtros */}
      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', backgroundColor: '#f3f4f6', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}
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

        {/* NUEVO: filtro por prioridad (dropdown) */}
        <div>
          <label style={{ marginRight: '5px', fontSize: '14px' }}>Prioridad:</label>
          <select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value as 'Todas' | Prioridad)}
          >
            <option value="Todas">Todas</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
        </div>

        {/* NUEVO: ordenar por prioridad (dropdown) */}
        <div>
          <label style={{ marginRight: '5px', fontSize: '14px' }}>Ordenar:</label>
          <select value={orden} onChange={(e) => setOrden(e.target.value as Orden)}>
            <option value="Ninguno">Sin orden</option>
            <option value="MayorAMenor">Prioridad: alta → baja</option>
            <option value="MenorAMayor">Prioridad: baja → alta</option>
          </select>
        </div>

        {/* Buscador por texto */}
        <input
          type="text"
          placeholder="Buscar tarea..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ flex: 1, minWidth: '150px', padding: '6px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>

      {/* Lista */}
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
                <span
                  style={{
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    backgroundColor: COLOR_PRIORIDAD[tarea.priority].bg,
                    color: COLOR_PRIORIDAD[tarea.priority].color,
                  }}
                >
                  {tarea.priority}
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