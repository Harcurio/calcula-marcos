# Calcula Marcos

App personal para calcular marcos de cuadros (Expo + TypeScript, publicada como app web).

## Probar en tu Mac

```bash
npm install
npx expo start --web
```

## Publicar

Cada cambio que se sube a la rama `main` se publica solo en GitHub Pages (ver `.github/workflows/deploy.yml`).

## Fórmulas

- "Margen" es el paspartú que se ve; "marco" es la medida de tienda.
- El borde interno del marco tapa 0.5 cm por lado (`SOLAPA_CM` en `src/lib/marco.ts`).
- Quiero este margen → marco = arte + 2 × (margen + 0.5)
- Encontré este marco → margen = (marco − arte) ÷ 2 − 0.5, a lo ancho y a lo alto
