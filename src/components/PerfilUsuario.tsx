import { useState, useEffect } from 'react';

interface UsuarioAPI {
  name: string;
}

export default function PerfilUsuario() {
  const [nombre, setNombre] = useState<string>('Cargando...');

  useEffect(() => {
    // Este código se ejecuta SOLO UNA VEZ cuando el componente aparece en pantalla
    fetch('https://jsonplaceholder.typicode.com/users/1')
      .then((response) => response.json())
      .then((data: UsuarioAPI) => setNombre(data.name))
      .catch(() => setNombre('Error al cargar'));
  }, []); // El arreglo vacío [] asegura que solo corra al montar el componente

  return <h2>Usuario: {nombre}</h2>;
}