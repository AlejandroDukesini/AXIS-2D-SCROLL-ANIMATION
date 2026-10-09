import ResponsiveImage, { hasImage } from './ResponsiveImage'
import VehicleArt from './VehicleArt'
import { CATEGORY_BY_ID, fullName } from '../../data/vehicles'

/**
 * Escenario visual de un vehículo con relación de aspecto FIJA (16:10).
 * Foto real si el pipeline la generó (assets-src/vehiculos/<slug>.*), si no,
 * la ilustración de estudio. En ambos casos el contenedor es idéntico, así que
 * cambiar una por otra no altera el layout ni la coherencia de la grilla.
 */
export default function VehicleMedia({ vehicle, sizes, priority = false, className = '' }) {
  const key = `vehiculos/${vehicle.slug}`
  const accent = CATEGORY_BY_ID[vehicle.category].accent
  const alt = `${fullName(vehicle)} ${vehicle.trim} ${vehicle.year}, color ${vehicle.color.name}`

  return (
    <div
      className={`vehicle-stage relative aspect-[16/10] overflow-hidden ${className}`}
      style={{ '--accent': accent }}
    >
      {hasImage(key) ? (
        <ResponsiveImage
          name={key}
          alt={alt}
          sizes={sizes}
          priority={priority}
          className="absolute inset-0 h-full w-full object-contain object-[50%_62%] p-[6%]"
        />
      ) : (
        <VehicleArt
          body={vehicle.body}
          color={vehicle.color.hex}
          label={`Ilustración de ${alt}`}
          className="absolute inset-x-[5%] bottom-[8%] h-auto w-[90%]"
        />
      )}
    </div>
  )
}
