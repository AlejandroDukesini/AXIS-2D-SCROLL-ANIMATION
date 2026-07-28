import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

/**
 * Activa la hoja de estilos de fuentes precargada en index.html.
 *
 * Sustituye al manejador `onload=` en línea que había en el <head>: un script
 * en línea obliga a relajar la Content-Security-Policy con 'unsafe-inline'
 * (o 'unsafe-hashes'), lo que deja de proteger contra XSS reflejado/almacenado.
 * Al vivir en el bundle, el script-src puede quedarse en 'self'.
 *
 * El `preload` del <head> ya lanzó la descarga en paralelo, así que el coste en
 * FCP/LCP es el mismo: aquí solo se pasa de recurso precargado a hoja aplicada.
 * Si el <link> no existe (JS deshabilitado no llega aquí, pero por si el marcado
 * cambia) simplemente no se hace nada y el <noscript> del <head> cubre el caso.
 */
function activarFuentes() {
  const link = document.getElementById('font-css')
  if (link && link.rel !== 'stylesheet') link.rel = 'stylesheet'
}
activarFuentes()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
