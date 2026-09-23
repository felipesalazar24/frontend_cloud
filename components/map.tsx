"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { PetReport } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Phone } from "lucide-react"
import Link from "next/link"

// Fix for default marker icons in Next.js
const createIcon = (type: 'perdido' | 'encontrado') => {
  return L.divIcon({
    className: type === 'perdido' ? 'custom-marker-lost' : 'custom-marker-found',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
}

interface MapProps {
  reports: PetReport[]
  center?: [number, number]
  zoom?: number
  selectedReport?: string | null
  onMarkerClick?: (report: PetReport) => void
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])
  
  return null
}

function ReportPopup({ report }: { report: PetReport }) {
  return (
    <div className="w-64 p-3">
      {report.imageUrl && (
        <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
          <img
            src={report.imageUrl}
            alt={report.petName || 'Mascota'}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
          <Badge 
            className="absolute top-2 left-2"
            variant={report.type === 'perdido' ? 'destructive' : 'default'}
          >
            {report.type === 'perdido' ? 'Perdido' : 'Encontrado'}
          </Badge>
        </div>
      )}
      
      <div className="space-y-2">
        <div>
          <h3 className="font-semibold text-foreground">
            {report.petName || `${report.petType.charAt(0).toUpperCase() + report.petType.slice(1)} ${report.breed || ''}`}
          </h3>
          <p className="text-sm text-muted-foreground">
            {report.breed} • {report.color}
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{report.location.address}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{new Date(report.lastSeenDate).toLocaleDateString('es-CL')}</span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {report.description}
        </p>
        
        <div className="flex gap-2 pt-2">
          <Link href={`/reporte/${report.id}`} className="flex-1">
            <Button size="sm" className="w-full">Ver Detalles</Button>
          </Link>
          <a href={`tel:${report.contactPhone}`}>
            <Button size="sm" variant="outline">
              <Phone className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}

export function Map({ 
  reports, 
  center = [-33.4489, -70.6693], 
  zoom = 12,
  selectedReport,
  onMarkerClick 
}: MapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full rounded-lg"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater center={center} zoom={zoom} />
      
      {reports.map((report) => (
        <Marker
          key={report.id}
          position={[report.location.lat, report.location.lng]}
          icon={createIcon(report.type)}
          eventHandlers={{
            click: () => onMarkerClick?.(report),
          }}
        >
          <Popup>
            <ReportPopup report={report} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
