import Svg, { Rect } from 'react-native-svg';

import { Medida } from '@/lib/marco';

/** Grosor de la moldura en el dibujo (solo visual), en cm. */
const MOLDURA_CM = 2.5;

interface Props {
  arte: Medida; // cm
  marco: Medida; // cm, medida de tienda (interna)
  solapa: number; // cm
  colorArte: string;
  anchoDisponible: number; // px
  altoDisponible: number; // px
}

export function VistaPrevia({ arte, marco, solapa, colorArte, anchoDisponible, altoDisponible }: Props) {
  // Lo que se ve dentro del marco: la medida de tienda menos la solapa de cada lado.
  const ventana = { ancho: marco.ancho - 2 * solapa, alto: marco.alto - 2 * solapa };
  const total = { ancho: ventana.ancho + 2 * MOLDURA_CM, alto: ventana.alto + 2 * MOLDURA_CM };

  // escala = mínimo(anchoPantalla ÷ anchoMarco, altoPantalla ÷ altoMarco)
  const escala = Math.min(anchoDisponible / total.ancho, altoDisponible / total.alto);
  if (!Number.isFinite(escala) || escala <= 0 || ventana.ancho <= 0 || ventana.alto <= 0) return null;

  const px = (cm: number) => cm * escala;
  const margenX = (ventana.ancho - arte.ancho) / 2;
  const margenY = (ventana.alto - arte.alto) / 2;

  return (
    <Svg width={px(total.ancho)} height={px(total.alto)}>
      {/* Paspartú (blanco) */}
      <Rect x={px(MOLDURA_CM)} y={px(MOLDURA_CM)} width={px(ventana.ancho)} height={px(ventana.alto)} fill="#ffffff" />
      {/* Arte (un solo color) */}
      <Rect
        x={px(MOLDURA_CM + margenX)}
        y={px(MOLDURA_CM + margenY)}
        width={px(arte.ancho)}
        height={px(arte.alto)}
        fill={colorArte}
      />
      {/* Marco: borde grueso dibujado encima, así tapa el arte si no cabe */}
      <Rect
        x={px(MOLDURA_CM / 2)}
        y={px(MOLDURA_CM / 2)}
        width={px(total.ancho - MOLDURA_CM)}
        height={px(total.alto - MOLDURA_CM)}
        fill="none"
        stroke="#4a3426"
        strokeWidth={px(MOLDURA_CM)}
      />
    </Svg>
  );
}
