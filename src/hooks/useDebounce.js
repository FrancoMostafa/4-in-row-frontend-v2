import { useState, useEffect } from 'react';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Configurar un timer que actualizará el valor debounced después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el timeout si el valor cambia (también en cleanup)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Solo volver a ejecutar si value o delay cambian

  return debouncedValue;
};

export default useDebounce;