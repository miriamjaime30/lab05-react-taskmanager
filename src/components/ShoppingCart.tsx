import { useReducer } from 'react';

// 1. Estructura del estado y acciones permitidas
interface CarritoEstado {
  productos: string[];
  total: number;
}

type CarritoAccion =
  | { type: 'AGREGAR_PRODUCTO'; payload: { nombre: string; precio: number } }
  | { type: 'ELIMINAR_TODO' };

// 2. Reducer: centraliza los cambios de estado
function carritoReducer(state: CarritoEstado, action: CarritoAccion): CarritoEstado {
  switch (action.type) {
    case 'AGREGAR_PRODUCTO':
      return {
        productos: [...state.productos, action.payload.nombre],
        total: state.total + action.payload.precio,
      };
    case 'ELIMINAR_TODO':
      return { productos: [], total: 0 };
    default:
      return state;
  }
}

// 3. Componente
export default function ShoppingCart() {
  const [state, dispatch] = useReducer(carritoReducer, { productos: [], total: 0 });

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>🛒 Carrito de compras</h2>
      <p>Total: ${state.total}</p>
      <p>Productos: {state.productos.length === 0 ? 'ninguno' : state.productos.join(', ')}</p>

      <button
        onClick={() =>
          dispatch({ type: 'AGREGAR_PRODUCTO', payload: { nombre: 'Camisa', precio: 25 } })
        }
      >
        Añadir Camisa
      </button>{' '}
      <button onClick={() => dispatch({ type: 'ELIMINAR_TODO' })}>Vaciar</button>
    </div>
  );
}