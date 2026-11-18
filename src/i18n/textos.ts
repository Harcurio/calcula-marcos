// Todos los textos de la app, en español e inglés. Para agregar un texto, ponlo en los dos idiomas.

export type Idioma = 'es' | 'en';

const es = {
  titulo: 'Calcula Marcos',
  cambiarIdioma: 'English',
  ayudaVista: 'Escribe las medidas para ver la vista previa',
  buscaMarco: 'Busca un marco de',
  margenPorLado: 'Margen visible por lado',
  ancho: 'Ancho',
  alto: 'Alto',
  noCabe: 'El arte no cabe: el marco taparía parte de la obra.',
  notaSolapa: (solapa: string) => `Incluye ${solapa} por lado que tapa el borde del marco.`,
  pulgadas: 'pulgadas',
  arte: 'Arte',
  modo: 'Modo',
  modoMargen: 'Quiero este margen',
  modoMarco: 'Encontré este marco',
  margenVisible: 'Margen visible',
  marcoAncho: 'Marco ancho',
  marcoAlto: 'Marco alto',
};

export type Textos = typeof es;

const en: Textos = {
  titulo: 'Frame Calculator',
  cambiarIdioma: 'Español',
  ayudaVista: 'Enter the measurements to see the preview',
  buscaMarco: 'Look for a frame of',
  margenPorLado: 'Visible margin per side',
  ancho: 'Width',
  alto: 'Height',
  noCabe: "The artwork doesn't fit: the frame would cover part of it.",
  notaSolapa: (solapa: string) => `Includes ${solapa} per side covered by the frame's lip.`,
  pulgadas: 'inches',
  arte: 'Artwork',
  modo: 'Mode',
  modoMargen: 'I want this margin',
  modoMarco: 'I found this frame',
  margenVisible: 'Visible margin',
  marcoAncho: 'Frame width',
  marcoAlto: 'Frame height',
};

export const TEXTOS: Record<Idioma, Textos> = { es, en };
