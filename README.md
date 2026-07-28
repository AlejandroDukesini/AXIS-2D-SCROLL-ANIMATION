# AXIS 2D — Scroll-Driven Interactive Landing

> Landing premium de una sola página con animaciones 2D dirigidas por scroll,
> parallax basado en cursor y micro-interacciones, construida con **React + Vite**
> y **Framer Motion**, y optimizada para rendimiento sin sacrificar la riqueza visual.

El objetivo del proyecto es demostrar que una interfaz altamente animada e interactiva
**puede** ser también ligera y eficiente. Todas las métricas de este README son
**medibles y reproducibles** con los comandos incluidos más abajo — no son estimaciones.

---

## Stack técnico

| Capa | Tecnología |
|------|------------|
| UI / Framework | React 18 |
| Build tool | Vite 7 |
| Animación | Framer Motion 11 (scroll-driven, springs, parallax) |
| Estilos | Tailwind CSS 3 |
| Iconografía | lucide-react |
| Optimización de assets | sharp (pipeline PNG → WebP) |

---

## Características

- **Hero con parallax 3D** que reacciona a la posición del cursor (se desactiva
  automáticamente en táctil y con `prefers-reduced-motion`).
- **Categorizador de gamas** con tarjetas que se expanden y desenfocan en hover.
- **Showcase horizontal** dirigido por scroll vertical (`useScroll` + `useSpring`).
- **Contadores animados** que cuentan al entrar en viewport (`useInView`).
- **Simulador de color** con `useMotionValue` en tiempo real.

---

## Puesta en marcha

```bash
npm install
npm run dev               # servidor de desarrollo
npm run build             # build de producción -> dist/
npm run preview           # sirve el build de producción
npm run optimize:images   # regenera los WebP desde assets-src/ (pipeline sharp)
```

### Estructura relevante

```
assets-src/                       # PNG fuente (fuera del build; solo entrada del pipeline)
public/                           # WebP servidos + robots.txt
scripts/optimize-images.mjs       # PNG -> WebP reproducible e idempotente
src/
    App.jsx                       # code-splitting: secciones bajo el fold vía React.lazy
    components/                   # Hero, Showcase, RoadJourney, ColorStudio, ...
vite.config.js                    # manualChunks: react-vendor + motion-vendor
```

---

## Performance & Scalability

> **Metodología.** Google Lighthouse 13.4 sobre el build de producción (`vite preview`).
> Móvil: emulación Moto G4, CPU 4×, red *slow 4G simulada*. Los Web Vitals se reportan
> como **mediana de 5 corridas** (móvil) y **3 corridas** (escritorio) para neutralizar
> la varianza propia del laboratorio. Cada número es reproducible con los comandos del
> final de esta sección.

### Peso de red y arquitectura del bundle (determinista, no varía entre corridas)

| Métrica | Antes | Después | Mejora |
|---|---:|---:|---:|
| **Peso total de página** (móvil) | 821 KiB | 237 KiB | **↓71.1 %** |
| **Payload de imágenes** (4 assets) | 659.8 KB | 65.5 KB | **↓90.1 %** |
| **JS en ruta crítica** (código de app) | 299.79 KB (monolito) | 12.32 KB | **↓95.9 %** |
| Asset muerto eliminado | `maserat.png` (236 KB) | — | −236 KB |

El bundle monolítico de 299.79 KB se dividió en:
`react-vendor` (133.94 KB) · `motion-vendor` (132.65 KB) · código de app (12.32 KB) ·
**6 chunks diferidos** para las secciones bajo el fold (1.3–7.0 KB c/u). Los *vendors*
quedan cacheados entre despliegues: al cambiar el código de la app el usuario re-descarga
solo ~12 KB, no ~300 KB.

### Web Vitals de laboratorio — móvil (mediana de 5 corridas)

| Métrica | Antes | Después | Mejora |
|---|---:|---:|---:|
| Performance score | 85 | **88** | +3 |
| **LCP** (Largest Contentful Paint) | 3.06 s | **2.42 s** | ↓21 % |
| **FCP** (First Contentful Paint) | 2.76 s | **2.03 s** | ↓27 % |
| **Speed Index** | 3.45 s | **2.03 s** | ↓41 % |
| **CLS** (Cumulative Layout Shift) | 0.000 | 0.001 | estable |
| **TBT** (Total Blocking Time) | 187 ms | 327 ms | ⚠️ ver nota |

> **Nota honesta sobre el TBT móvil.** Al adelantar el FCP ~730 ms, parte del trabajo
> de arranque de Framer Motion pasa a contarse *dentro* de la ventana de bloqueo, y sobre
> CPU emulada 4× esto eleva el TBT (mediana 327 ms, rango 0–545 ms entre corridas — es una
> métrica ruidosa en este proyecto). Es el *trade-off* consciente de una landing rica en
> animación; aun así el Performance score global **sube** de 85 a 88. En escritorio el TBT
> se mantiene en **0 ms**.

### Web Vitals de laboratorio — escritorio (mediana de 3 corridas)

| Métrica | Antes | Después | Mejora |
|---|---:|---:|---:|
| Performance score | 96 | **99** | +3 |
| LCP | 1.04 s | **0.75 s** | ↓28 % |
| FCP | 1.00 s | **0.75 s** | ↓25 % |
| TBT | 0 ms | **0 ms** | — |
| CLS | 0.000 | 0.021 | estable |

### Categorías Lighthouse (build optimizado)

| Categoría | Móvil | Escritorio |
|---|:--:|:--:|
| Performance | 88 | 99 |
| Accessibility | **100** | **100** |
| Best Practices | **100** | **100** |
| SEO | **100** (era 92) | **100** |

### Técnicas de optimización aplicadas

1. **Imágenes modernas (WebP).** Pipeline reproducible con `sharp` (`npm run optimize:images`):
   4 PNG → WebP con **↓90.1 %** de peso. Los PNG fuente viven en `assets-src/`, fuera de
   `public/`, para que el build **solo** contenga los WebP.
2. **Code-splitting + lazy loading.** `React.lazy` + `Suspense` difieren las 6 secciones
   bajo el fold; entran en chunks propios que se descargan mientras el usuario ve el Hero.
3. **Vendor chunking.** `manualChunks` aísla `react`/`react-dom` y `framer-motion` en
   bundles cacheables independientes → mejor cacheo y descarga en paralelo.
4. **Priorización de la LCP.** `preload` + `fetchpriority="high"` sobre la imagen del Hero;
   `loading="lazy"` + `decoding="async"` en las imágenes bajo el fold.
5. **Fuentes no bloqueantes.** Google Fonts cargado con el patrón `preload` + cambio a
   `rel="stylesheet"` desde el bundle (con fallback `<noscript>`), evitando el
   render-blocking del `<head>`. El cambio se hace en `src/main.jsx` en lugar de con un
   `onload=` en línea para no tener que abrir la CSP con `'unsafe-inline'`; la descarga
   sigue arrancando en el `<head>`, así que el efecto sobre FCP/LCP es el mismo.
6. **Higiene de assets y SEO.** Eliminación de asset muerto (−236 KB) y `robots.txt`
   válido → SEO **92 → 100**.
7. **Respeto de accesibilidad.** Los efectos de cursor se desactivan en táctil y con
   `prefers-reduced-motion`, manteniendo **Accessibility 100**.

### Reproducir estas métricas

```bash
npm run build
npm run preview -- --port 4173
# En otra terminal:
npx lighthouse http://localhost:4173/ --form-factor=mobile --throttling-method=simulate --view
npx lighthouse http://localhost:4173/ --preset=desktop --view
```

---

## Licencia

Ver [LICENCE](./LICENCE).
