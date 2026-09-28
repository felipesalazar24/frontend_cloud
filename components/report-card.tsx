"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Dog, Cat, Bird, HelpCircle, Phone } from "lucide-react"
import Link from "next/link"

const petTypeIcons: Record<string, any> = {
  perro: Dog,
  gato: Cat,
  ave: Bird,
  otro: HelpCircle,
}

export function ReportCard({ report, compact = false }: { report: any, compact?: boolean }) {
  const PetIcon = petTypeIcons[String(report.petType).toLowerCase()] || HelpCircle;
  
  // Aseguramos que tome el ID sin importar cómo lo envíe el backend
  const petId = report.id || report.petId || report.idMascota;
  
  return (
    <Link href={`/reporte/${petId}`} className="block transition-transform hover:scale-[1.02]">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col cursor-pointer">
        {report.imageUrl && (
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={report.imageUrl}
              alt={report.petName || 'Mascota'}
              className="w-full h-full object-cover transition-transform hover:scale-105"
              crossOrigin="anonymous"
            />
            <Badge 
              className="absolute top-3 left-3 capitalize"
              variant={String(report.status).toLowerCase() === 'perdido' ? 'destructive' : 'default'}
            >
              {report.status || 'Desconocido'}
            </Badge>
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1">
              <PetIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium capitalize">{report.petType || 'Otro'}</span>
            </div>
          </div>
        )}
        
        <CardContent className={`flex-1 ${compact ? "p-3" : "p-4"}`}>
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold leading-tight capitalize">
                  {report.petName || `${String(report.petType).charAt(0).toUpperCase() + String(report.petType).slice(1)}`}
                </h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {report.breed && `${report.breed} • `}{report.color}
                </p>
              </div>
              {report.size && (
                <Badge variant="outline" className="capitalize shrink-0">
                  {report.size}
                </Badge>
              )}
            </div>
            
            {!compact && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {report.description}
              </p>
            )}
            
            <div className="flex flex-col gap-1 text-sm text-muted-foreground mt-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{report.location || report.address || "Ubicación no especificada"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {String(report.status).toLowerCase() === 'perdido' ? 'Última vez visto' : 'Encontrado'}: {
                    report.createdAt || report.lastSeenDate ? 
                    new Date(report.createdAt || report.lastSeenDate).toLocaleDateString('es-CL') : 
                    "Fecha desconocida"
                  }
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className={`${compact ? "p-3 pt-0" : "p-4 pt-0"} gap-2 mt-auto`}>
          <Button variant="outline" className="w-full" size={compact ? "sm" : "default"}>
            Ver Detalles
          </Button>
          {report.contactPhone && (
            <a href={`tel:${report.contactPhone}`} onClick={(e) => e.stopPropagation()}>
              <Button size={compact ? "sm" : "default"} variant="secondary">
                <Phone className="h-4 w-4" />
              </Button>
            </a>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}