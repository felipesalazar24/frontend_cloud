"use client"

import { PetReport } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle, XCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

interface MatchNotificationProps {
  lostReport: PetReport
  foundReport: PetReport
  similarity: number
  onConfirm?: () => void
  onDismiss?: () => void
}

export function MatchNotification({ 
  lostReport, 
  foundReport, 
  similarity, 
  onConfirm, 
  onDismiss 
}: MatchNotificationProps) {
  return (
    <Card className="border-accent/50 bg-accent/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
              <Bell className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">Posible Coincidencia</CardTitle>
              <CardDescription>
                El sistema detectó una posible coincidencia
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="text-accent-foreground bg-accent/20">
            {similarity}% similar
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          {/* Lost Pet */}
          <div className="flex gap-3 items-center">
            {lostReport.imageUrl && (
              <img
                src={lostReport.imageUrl}
                alt={lostReport.petName || 'Mascota perdida'}
                className="h-16 w-16 rounded-lg object-cover"
                crossOrigin="anonymous"
              />
            )}
            <div>
              <Badge variant="destructive" className="mb-1">Perdido</Badge>
              <p className="font-medium">{lostReport.petName || lostReport.petType}</p>
              <p className="text-sm text-muted-foreground">{lostReport.location.city}</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center">
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* Found Pet */}
          <div className="flex gap-3 items-center">
            {foundReport.imageUrl && (
              <img
                src={foundReport.imageUrl}
                alt="Mascota encontrada"
                className="h-16 w-16 rounded-lg object-cover"
                crossOrigin="anonymous"
              />
            )}
            <div>
              <Badge className="mb-1">Encontrado</Badge>
              <p className="font-medium">{foundReport.petType}</p>
              <p className="text-sm text-muted-foreground">{foundReport.location.city}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/reporte/${lostReport.id}`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              Ver Detalles
            </Button>
          </Link>
          <Button size="sm" variant="outline" onClick={onDismiss} className="gap-1">
            <XCircle className="h-4 w-4" />
            No es
          </Button>
          <Button size="sm" onClick={onConfirm} className="gap-1">
            <CheckCircle className="h-4 w-4" />
            Es mi mascota
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface AlertsListProps {
  reports: PetReport[]
  matches: Array<{
    id: string
    lostReportId: string
    foundReportId: string
    similarity: number
    status: 'pendiente' | 'confirmado' | 'descartado'
  }>
}

export function AlertsList({ reports, matches }: AlertsListProps) {
  const pendingMatches = matches.filter(m => m.status === 'pendiente')

  if (pendingMatches.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Bell className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">Sin alertas pendientes</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Te notificaremos automáticamente cuando el sistema detecte una posible coincidencia con tus reportes.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {pendingMatches.map((match) => {
        const lostReport = reports.find(r => r.id === match.lostReportId)
        const foundReport = reports.find(r => r.id === match.foundReportId)
        
        if (!lostReport || !foundReport) return null

        return (
          <MatchNotification
            key={match.id}
            lostReport={lostReport}
            foundReport={foundReport}
            similarity={match.similarity}
          />
        )
      })}
    </div>
  )
}
