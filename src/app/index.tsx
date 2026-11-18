import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { VistaPrevia } from '@/components/VistaPrevia';
import {
  aCm,
  convertirTexto,
  esPositiva,
  formatear,
  leerNumero,
  marcoParaMargen,
  margenParaMarco,
  Medida,
  noCabe,
  SOLAPA_CM,
  Unidad,
} from '@/lib/marco';

type Modo = 'margen' | 'marco';

const COLOR_ARTE = '#c0392b';
const ALTO_VISTA = 280;

export default function Calculadora() {
  const [unidad, setUnidad] = useState<Unidad>('cm');
  const [modo, setModo] = useState<Modo>('margen');
  const [arteAncho, setArteAncho] = useState('30');
  const [arteAlto, setArteAlto] = useState('40');
  const [margen, setMargen] = useState('5');
  const [marcoAncho, setMarcoAncho] = useState('40');
  const [marcoAlto, setMarcoAlto] = useState('50');
  const [anchoVista, setAnchoVista] = useState(0);

  // Al cambiar cm ↔ in, convertimos lo que ya está escrito.
  const cambiarUnidad = (nueva: Unidad) => {
    if (nueva === unidad) return;
    const conv = (t: string) => convertirTexto(t, unidad, nueva);
    setArteAncho(conv);
    setArteAlto(conv);
    setMargen(conv);
    setMarcoAncho(conv);
    setMarcoAlto(conv);
    setUnidad(nueva);
  };

  const cm = (t: string) => aCm(leerNumero(t), unidad);
  const arte: Medida = { ancho: cm(arteAncho), alto: cm(arteAlto) };

  let marco: Medida;
  let margenes: Medida;
  if (modo === 'margen') {
    const m = cm(margen);
    marco = marcoParaMargen(arte, m);
    margenes = { ancho: m, alto: m };
  } else {
    marco = { ancho: cm(marcoAncho), alto: cm(marcoAlto) };
    margenes = margenParaMarco(arte, marco);
  }

  const datosValidos = esPositiva(arte) && esPositiva(marco) && Number.isFinite(margenes.ancho);
  const arteNoCabe = datosValidos && noCabe(margenes);

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <View style={styles.contenido}>
        {/* Vista previa */}
        <View style={styles.vista} onLayout={(e) => setAnchoVista(e.nativeEvent.layout.width)}>
          {datosValidos && anchoVista > 0 ? (
            <VistaPrevia
              arte={arte}
              marco={marco}
              solapa={SOLAPA_CM}
              colorArte={COLOR_ARTE}
              anchoDisponible={anchoVista - 24}
              altoDisponible={ALTO_VISTA - 24}
            />
          ) : (
            <Text style={styles.ayuda}>Escribe las medidas para ver la vista previa</Text>
          )}
        </View>

        {/* Resultado */}
        {datosValidos && (
          <View style={[styles.resultado, arteNoCabe && styles.resultadoError]}>
            {modo === 'margen' ? (
              <>
                <Text style={styles.resultadoTitulo}>Busca un marco de</Text>
                <Text style={styles.resultadoValor}>
                  {formatear(marco.ancho, unidad)} × {formatear(marco.alto, unidad)}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.resultadoTitulo}>Margen visible por lado</Text>
                <Text style={styles.resultadoValor}>
                  Ancho: {formatear(margenes.ancho, unidad)}
                  {'\n'}Alto: {formatear(margenes.alto, unidad)}
                </Text>
              </>
            )}
            {arteNoCabe && <Text style={styles.error}>El arte no cabe: el marco taparía parte de la obra.</Text>}
            <Text style={styles.nota}>Incluye {formatear(SOLAPA_CM, unidad)} por lado que tapa el borde del marco.</Text>
          </View>
        )}

        {/* Controles */}
        <Segmentos
          opciones={[
            { valor: 'cm', texto: 'cm' },
            { valor: 'in', texto: 'pulgadas' },
          ]}
          valor={unidad}
          alCambiar={cambiarUnidad}
        />

        <Text style={styles.seccion}>Arte</Text>
        <View style={styles.fila}>
          <Campo etiqueta={`Ancho (${unidad})`} valor={arteAncho} alCambiar={setArteAncho} />
          <Campo etiqueta={`Alto (${unidad})`} valor={arteAlto} alCambiar={setArteAlto} />
        </View>

        <Text style={styles.seccion}>Modo</Text>
        <Segmentos
          opciones={[
            { valor: 'margen', texto: 'Quiero este margen' },
            { valor: 'marco', texto: 'Encontré este marco' },
          ]}
          valor={modo}
          alCambiar={setModo}
        />

        {modo === 'margen' ? (
          <View style={styles.fila}>
            <Campo etiqueta={`Margen visible (${unidad})`} valor={margen} alCambiar={setMargen} />
          </View>
        ) : (
          <View style={styles.fila}>
            <Campo etiqueta={`Marco ancho (${unidad})`} valor={marcoAncho} alCambiar={setMarcoAncho} />
            <Campo etiqueta={`Marco alto (${unidad})`} valor={marcoAlto} alCambiar={setMarcoAlto} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// ---------- Componentes pequeños ----------

function Campo({ etiqueta, valor, alCambiar }: { etiqueta: string; valor: string; alCambiar: (t: string) => void }) {
  return (
    <View style={styles.campo}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={alCambiar}
        keyboardType="decimal-pad"
        inputMode="decimal"
        selectTextOnFocus
      />
    </View>
  );
}

function Segmentos<T extends string>({
  opciones,
  valor,
  alCambiar,
}: {
  opciones: { valor: T; texto: string }[];
  valor: T;
  alCambiar: (v: T) => void;
}) {
  return (
    <View style={styles.segmentos}>
      {opciones.map((o) => (
        <Pressable
          key={o.valor}
          onPress={() => alCambiar(o.valor)}
          style={[styles.segmento, o.valor === valor && styles.segmentoActivo]}
        >
          <Text style={[styles.segmentoTexto, o.valor === valor && styles.segmentoTextoActivo]}>{o.texto}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, alignItems: 'center' },
  contenido: { width: '100%', maxWidth: 480, gap: 12 },
  vista: {
    height: ALTO_VISTA,
    backgroundColor: '#e9e6e1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ayuda: { color: '#777' },
  resultado: { backgroundColor: '#eef6ee', borderRadius: 12, padding: 14, gap: 4 },
  resultadoError: { backgroundColor: '#fdecea' },
  resultadoTitulo: { fontSize: 14, color: '#555' },
  resultadoValor: { fontSize: 22, fontWeight: '700' },
  error: { color: '#b3261e', fontWeight: '600' },
  nota: { fontSize: 12, color: '#777' },
  seccion: { fontSize: 16, fontWeight: '700', marginTop: 8 },
  fila: { flexDirection: 'row', gap: 12 },
  campo: { flex: 1, gap: 4 },
  etiqueta: { fontSize: 13, color: '#555' },
  // fontSize 16: evita que Safari en iPhone haga zoom al tocar el campo
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: '#fff' },
  segmentos: { flexDirection: 'row', backgroundColor: '#eee', borderRadius: 10, padding: 3 },
  segmento: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  segmentoActivo: { backgroundColor: '#fff' },
  segmentoTexto: { color: '#555' },
  segmentoTextoActivo: { color: '#111', fontWeight: '700' },
});
