import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { mockReports } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  User, 
  ArrowLeft, 
  Share2, 
  Flag,
  Dog,
  Cat,
  Bird,
  HelpCircle
} from "lucide-react"

const petTypeIcons = {
  perro: Dog,
  gato: Cat,
  ave: Bird,
  otro: HelpCircle,
}

interface ReportePageProps {
  params: Promise<{ id: string }>
}

export default async function ReportePage({ params }: ReportePageProps) {
  const { id } = await params
  const report = mockReports.find(r => r.id === id)

  if (!report) {
    notFound()
  }

  const PetIcon = petTypeIcons[report.petType]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/mapa" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Volver al mapa
          </Link>

          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            {/* Main Content */}
            <div className="space-y-6">
              {/* Image */}
              {report.imageUrl && (
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <img
                    src={report.imageUrl}
                    alt={report.petName || 'Mascota'}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                  <Badge 
                    className="absolute top-4 left-4 text-sm px-3 py-1"
                    variant={report.type === 'perdido' ? 'destructive' : 'default'}
                  >
                    {report.type === 'perdido' ? 'Mascota Perdida' : 'Mascota Encontrada'}
                  </Badge>
                </div>
              )}

              {/* Pet Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        {report.petName || `${report.petType.charAt(0).toUpperCase() + report.petType.slice(1)}`}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <PetIcon className="h-4 w-4" />
                        {report.breed || 'Sin raza especificada'} • {report.color}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      Tamaño {report.size}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Descripción</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {report.description}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Ubicación</p>
                        <p className="text-sm text-muted-foreground">
                          {report.location.address}, {report.location.city}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">
                          {report.type === 'perdido' ? 'Última vez visto' : 'Fecha encontrado'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(report.lastSeenDate).toLocaleDateString('es-CL', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Compartir
                </Button>
                <Button variant="outline" className="gap-2 text-muted-foreground">
                  <Flag className="h-4 w-4" />
                  Reportar problema
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información de Contacto</CardTitle>
                  <CardDescription>
                    Contacta al {report.type === 'perdido' ? 'dueño' : 'reportador'} directamente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{report.contactName}</p>
                      <p className="text-sm text-muted-foreground">
                        {report.type === 'perdido' ? 'Dueño de la mascota' : 'Reportador'}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <a href={`tel:${report.contactPhone}`} className="block">
                    <Button className="w-full gap-2" size="lg">
                      <Phone className="h-4 w-4" />
                      Llamar: {report.contactPhone}
                    </Button>
                  </a>

                  {report.contactEmail && (
                    <a href={`mailto:${report.contactEmail}`} className="block">
                      <Button variant="outline" className="w-full gap-2">
                        <Mail className="h-4 w-4" />
                        Enviar Email
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>

              {/* Similar Reports Suggestion */}
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg">¿Es tu mascota?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {report.type === 'encontrado' ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Si esta mascota es tuya, contacta al reportador para coordinar el reencuentro.
                      </p>
                      <Link href="/reportar?type=perdido">
                        <Button variant="outline" className="w-full">
                          ¿Perdiste una mascota similar?
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Si encontraste a esta mascota, contacta al dueño para reunirlos.
                      </p>
                      <Link href="/reportar?type=encontrado">
                        <Button variant="outline" className="w-full">
                          ¿Encontraste esta mascota?
                        </Button>
                      </Link>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Report Info */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Reporte ID: {report.id}</p>
                <p>Creado: {new Date(report.createdAt).toLocaleDateString('es-CL')}</p>
                <p>Estado: <span className="capitalize">{report.status}</span></p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
