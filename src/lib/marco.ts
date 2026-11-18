// Cálculos de marcos. Todo se calcula en centímetros; las pulgadas solo se usan para mostrar/leer.

export type Unidad = 'cm' | 'in';

export const CM_POR_PULGADA = 2.54;

/** Lo que tapa el borde interno del marco (la "solapa"), por lado, en cm. */
export const SOLAPA_CM = 0.5;

export interface Medida {
  ancho: number; // cm
  alto: number; // cm
}

export const aCm = (valor: number, u: Unidad) => (u === 'in' ? valor * CM_POR_PULGADA : valor);
export const deCm = (cm: number, u: Unidad) => (u === 'in' ? cm / CM_POR_PULGADA : cm);

/**
 * Modo 1: "quiero este margen visible" → medida del marco (la medida de tienda).
 * marco = arte + 2 × (margen + solapa)
 */
export function marcoParaMargen(arte: Medida, margen: number, solapa = SOLAPA_CM): Medida {
  return {
    ancho: arte.ancho + 2 * (margen + solapa),
    alto: arte.alto + 2 * (margen + solapa),
  };
}

/**
 * Modo 2: "encontré este marco" → margen visible, por separado a lo ancho y a lo alto.
 * margen = (marco − arte) ÷ 2 − solapa
 */
export function margenParaMarco(arte: Medida, marco: Medida, solapa = SOLAPA_CM): Medida {
  return {
    ancho: (marco.ancho - arte.ancho) / 2 - solapa,
    alto: (marco.alto - arte.alto) / 2 - solapa,
  };
}

/** Acepta "30,5" o "30.5". Devuelve NaN si el texto no es un número. */
export function leerNumero(texto: string): number {
  const t = texto.trim().replace(',', '.');
  return t === '' ? NaN : Number(t);
}

/** Convierte el texto de un campo de una unidad a otra (para cuando cambias cm ↔ in). */
export function convertirTexto(texto: string, de: Unidad, a: Unidad): string {
  const n = leerNumero(texto);
  if (!Number.isFinite(n)) return texto;
  return String(Number(deCm(aCm(n, de), a).toFixed(2)));
}

export function formatear(cm: number, u: Unidad): string {
  const texto = deCm(cm, u).toFixed(u === 'cm' ? 1 : 2);
  return `${Number(texto) === 0 ? texto.replace('-', '') : texto} ${u}`; // evita "-0.00"
}

/** Margen negativo = el marco tapa parte del arte. La tolerancia absorbe redondeos de cm ↔ in. */
export const noCabe = (margenes: Medida) => margenes.ancho < -0.05 || margenes.alto < -0.05;

export const esPositiva = (m: Medida) =>
  Number.isFinite(m.ancho) && Number.isFinite(m.alto) && m.ancho > 0 && m.alto > 0;
