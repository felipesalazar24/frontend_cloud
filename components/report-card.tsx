"use client"

import { PetReport } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Dog, Cat, Bird, HelpCircle, Phone } from "lucide-react"
import Link from "next/link"

const petTypeIcons = {
  perro: Dog,
  gato: Cat,
  ave: Bird,
  otro: HelpCircle,
}

interface ReportCardProps {
  report: PetReport
  compact?: boolean
}

export function ReportCard({ report, compact = false }: ReportCardProps) {
  const PetIcon = petTypeIcons[report.petType]
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {report.imageUrl && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={report.imageUrl}
            alt={report.petName || 'Mascota'}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            crossOrigin="anonymous"
          />
          <Badge 
            className="absolute top-3 left-3"
            variant={report.type === 'perdido' ? 'destructive' : 'default'}
          >
            {report.type === 'perdido' ? 'Perdido' : 'Encontrado'}
          </Badge>
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1">
            <PetIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium capitalize">{report.petType}</span>
          </div>
        </div>
      )}
      
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold leading-tight">
                {report.petName || `${report.petType.charAt(0).toUpperCase() + report.petType.slice(1)}`}
              </h3>
              <p className="text-sm text-muted-foreground">
                {report.breed && `${report.breed} • `}{report.color}
              </p>
            </div>
            <Badge variant="outline" className="capitalize shrink-0">
              {report.size}
            </Badge>
          </div>
          
          {!compact && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {report.description}
            </p>
          )}
          
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{report.location.address}, {report.location.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>
                {report.type === 'perdido' ? 'Visto por última vez' : 'Encontrado'}: {new Date(report.lastSeenDate).toLocaleDateString('es-CL')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className={`${compact ? "p-3 pt-0" : "p-4 pt-0"} gap-2`}>
        <Link href={`/reporte/${report.id}`} className="flex-1">
          <Button variant="outline" className="w-full" size={compact ? "sm" : "default"}>
            Ver Detalles
          </Button>
        </Link>
        <a href={`tel:${report.contactPhone}`}>
          <Button size={compact ? "sm" : "default"} variant="secondary">
            <Phone className="h-4 w-4" />
          </Button>
        </a>
      </CardFooter>
    </Card>
  )
}
