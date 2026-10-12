import { useState } from 'react';

export default function Contador() {
  // 'clicks' guarda el valor. 'setClicks' es la función para cambiarlo.
  // El (0) es el valor inicial.
  const [clicks, setClicks] = useState<number>(0);

  return (
    <div>
      <p>Puntuación: {clicks}</p>
      <button onClick={() => setClicks(clicks + 1)}>Sumar punto</button>
    </div>
  );
}