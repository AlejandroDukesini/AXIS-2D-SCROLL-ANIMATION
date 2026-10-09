// Paquete de features de Framer Motion que se descarga en diferido.
// domMax = animaciones + gestos + drag (lo necesita el Color Studio).
// Se separa del bundle inicial vía <LazyMotion features={() => import(...)}>:
// el primer render solo necesita el componente `m` y los hooks de motion values.
import { domMax } from 'framer-motion'
export default domMax
