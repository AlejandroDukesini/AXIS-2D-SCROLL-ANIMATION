import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ---------------------------------------------------------------------------
// POLÍTICA DE SEGURIDAD DE CONTENIDO (CSP)
// ---------------------------------------------------------------------------
// La app es 100 % estática: todo el JS y el CSS propios salen de /assets del
// mismo origen, y el único tercero es Google Fonts. Por eso se puede partir de
// `default-src 'none'` (denegar todo) y abrir solo lo estrictamente necesario.
//
// Se verificó sobre el bundle de producción que NADA inyecta <style> ni usa
// eval/new Function, así que no hace falta 'unsafe-inline' ni 'unsafe-eval':
// los estilos dinámicos de React y Framer Motion se aplican vía CSSOM
// (element.style), que la CSP no intercepta.
//
// Efecto defensivo: aunque un atacante lograse inyectar HTML en la página, no
// podría ejecutar JS (script-src 'self'), ni exfiltrar datos a un dominio ajeno
// (connect-src / img-src 'self'), ni reescribir rutas relativas (base-uri).
const CSP_DIRECTIVES = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "base-uri 'none'",
  // No hay formularios: el contacto son enlaces salientes a WhatsApp/Instagram.
  "form-action 'none'",
  // Anti-clickjacking. Solo tiene efecto como cabecera HTTP (ver SECURITY_HEADERS);
  // los navegadores ignoran frame-ancestors dentro de <meta>.
  "frame-ancestors 'none'",
  "object-src 'none'",
  'upgrade-insecure-requests',
]

const csp = CSP_DIRECTIVES.join('; ')

// Variante para <meta http-equiv>: se quita frame-ancestors porque en <meta> es
// inválida y el navegador la reporta como error de consola.
const cspMetaValue = CSP_DIRECTIVES.filter(
  (d) => !d.startsWith('frame-ancestors'),
).join('; ')

// Cabeceras de seguridad que debe emitir el hosting. Se aplican en `vite preview`
// (para poder verificarlas en local) y se escriben en dist/_headers al construir.
const SECURITY_HEADERS = {
  'Content-Security-Policy': csp,
  // Fuerza HTTPS durante un año. Sobre http:// los navegadores la ignoran, así
  // que es inocua en `preview` local.
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  // Impide que el navegador "adivine" el tipo MIME (XSS vía sniffing).
  'X-Content-Type-Options': 'nosniff',
  // Anti-clickjacking para navegadores sin soporte de frame-ancestors.
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Mínimo privilegio sobre APIs del navegador: la landing no usa ninguna.
  'Permissions-Policy':
    'accelerometer=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), usb=(), xr-spatial-tracking=()',
  // Aísla la ventana de posibles abridores/popups cross-origin.
  'Cross-Origin-Opener-Policy': 'same-origin',
  // Evita que otros sitios embeban nuestros recursos directamente.
  'Cross-Origin-Resource-Policy': 'same-origin',
}

/**
 * Inyecta la CSP como <meta http-equiv> SOLO en el build de producción.
 *
 * ¿Por qué no ponerla directamente en index.html? Porque el servidor de
 * desarrollo de Vite inyecta CSS en caliente con etiquetas <style> en línea:
 * una CSP estricta rompería el estilado en `npm run dev` y la tentación sería
 * relajarla con 'unsafe-inline' — que es exactamente lo que no queremos en
 * producción. Separando ambos entornos, producción queda estricta de verdad.
 *
 * El <meta> es la red de seguridad para hostings donde no se puedan configurar
 * cabeceras; la cabecera HTTP de dist/_headers es siempre preferible y, si
 * ambas existen, el navegador aplica la intersección (la más restrictiva).
 */
function cspMeta() {
  return {
    name: 'csp-meta',
    apply: 'build',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'meta',
            attrs: {
              'http-equiv': 'Content-Security-Policy',
              content: cspMetaValue,
            },
            injectTo: 'head-prepend',
          },
        ],
      }
    },
  }
}

/**
 * Escribe dist/_headers con las cabeceras de seguridad.
 *
 * Formato nativo de Netlify y Cloudflare Pages. Se genera desde SECURITY_HEADERS
 * en vez de mantenerse a mano en public/ para que no haya dos fuentes de verdad
 * que se desincronicen. Para Vercel / Nginx / Apache, el equivalente está
 * documentado en cibersegurity.txt.
 */
function securityHeadersFile() {
  return {
    name: 'security-headers-file',
    apply: 'build',
    generateBundle() {
      const body = Object.entries(SECURITY_HEADERS)
        .map(([k, v]) => `  ${k}: ${v}`)
        .join('\n')
      this.emitFile({
        type: 'asset',
        fileName: '_headers',
        source: `/*\n${body}\n`,
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cspMeta(), securityHeadersFile()],
  server: {
    open: true,
    // Escuchar solo en loopback: el servidor de desarrollo no debe quedar
    // expuesto a la LAN (Wi-Fi de café/coworking). Vite ya lo hace por defecto,
    // pero se declara explícito para que un `--host` accidental sea deliberado.
    host: '127.0.0.1',
    // Mitiga GHSA-67mh-4wv8-2f99 (esbuild): sin CORS permisivo, una web
    // maliciosa abierta en otra pestaña no puede leer las respuestas del
    // servidor de desarrollo (código fuente del proyecto).
    cors: false,
    fs: {
      // No servir nada fuera de la raíz del proyecto.
      strict: true,
      deny: ['.env', '.env.*', '*.pem', '*.key', '.git/**', '.claude/**'],
    },
  },
  preview: {
    host: '127.0.0.1',
    // Permite comprobar en local las mismas cabeceras que debe emitir el hosting:
    //   npm run build && npm run preview
    //   curl -I http://127.0.0.1:4173/
    headers: SECURITY_HEADERS,
  },
  build: {
    // Sin sourcemaps en producción: evita publicar el código fuente original y
    // los nombres internos, que facilitan el reconocimiento a un atacante.
    sourcemap: false,
    // Separa las dependencias grandes en chunks propios: mejoran el cacheo
    // entre deploys (el vendor no cambia aunque cambie el código de la app)
    // y permiten descargar React y el motor de animación en paralelo.
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion-vendor': ['framer-motion'],
        },
      },
    },
  },
})
