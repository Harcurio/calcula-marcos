import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { Idioma, TEXTOS, Textos } from './textos';

const CLAVE = 'idioma';

/** Idioma del celular/navegador: español si empieza con "es", si no inglés. */
function idiomaDelDispositivo(): Idioma {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale ?? '';
  return locale.toLowerCase().startsWith('es') ? 'es' : 'en';
}

interface Valor {
  idioma: Idioma;
  t: Textos;
  cambiarIdioma: (idioma: Idioma) => void;
}

const IdiomaContext = createContext<Valor | null>(null);

export function IdiomaProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdioma] = useState<Idioma>(idiomaDelDispositivo);

  // Al abrir la app, usa el idioma que se eligió la última vez (si hay uno guardado).
  useEffect(() => {
    AsyncStorage.getItem(CLAVE)
      .then((guardado) => {
        if (guardado === 'es' || guardado === 'en') setIdioma(guardado);
      })
      .catch(() => {});
  }, []);

  const cambiarIdioma = (nuevo: Idioma) => {
    setIdioma(nuevo);
    AsyncStorage.setItem(CLAVE, nuevo).catch(() => {});
  };

  return (
    <IdiomaContext.Provider value={{ idioma, t: TEXTOS[idioma], cambiarIdioma }}>{children}</IdiomaContext.Provider>
  );
}

export function useIdioma(): Valor {
  const valor = useContext(IdiomaContext);
  if (!valor) throw new Error('useIdioma debe usarse dentro de <IdiomaProvider>');
  return valor;
}
