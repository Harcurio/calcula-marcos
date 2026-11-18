import { Stack } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { IdiomaProvider, useIdioma } from '@/i18n/IdiomaContext';

export default function RootLayout() {
  return (
    <IdiomaProvider>
      <Navegacion />
    </IdiomaProvider>
  );
}

function Navegacion() {
  const { idioma, t, cambiarIdioma } = useIdioma();
  return (
    <Stack
      screenOptions={{
        title: t.titulo,
        // Botón arriba a la derecha: muestra el otro idioma y cambia a él.
        headerRight: () => (
          <Pressable onPress={() => cambiarIdioma(idioma === 'es' ? 'en' : 'es')} style={{ paddingHorizontal: 12 }}>
            <Text style={{ color: '#2e6bd9', fontSize: 16 }}>{t.cambiarIdioma}</Text>
          </Pressable>
        ),
      }}
    />
  );
}
