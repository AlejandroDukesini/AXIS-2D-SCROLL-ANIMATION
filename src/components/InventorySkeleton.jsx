// Vive fuera del chunk del inventario: es el fallback de Suspense, así que
// tiene que estar en el bundle inicial para reservar el espacio (sin CLS).
/** Reserva el espacio del inventario mientras llega su chunk (sin CLS). */
export default function InventorySkeleton() {
  return (
    <section className="py-24 md:py-28" aria-hidden="true">
      <div className="container-x">
        <div className="skeleton h-6 w-40" />
        <div className="skeleton mt-4 h-14 w-full max-w-xl" />
        <div className="inventory-grid mt-12">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="skeleton aspect-[4/5] rounded-3xl" />
          ))}
        </div>
      </div>
    </section>
  )
}
