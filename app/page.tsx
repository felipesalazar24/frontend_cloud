import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  PawPrint, 
  MapPin, 
  Search, 
  Bell, 
  Shield, 
  Clock, 
  Users, 
  ArrowRight,
  Dog,
  Cat,
  Building2,
  Heart
} from "lucide-react"
import { mockReports } from "@/lib/mock-data"
import { ReportCard } from "@/components/report-card"

export default function HomePage() {
  const recentReports = mockReports.slice(0, 3)
  const lostCount = mockReports.filter(r => r.type === 'perdido').length
  const foundCount = mockReports.filter(r => r.type === 'encontrado').length

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Badge variant="secondary" className="mb-4">
                <Heart className="h-3 w-3 mr-1 fill-destructive text-destructive" />
                Plataforma de bienestar animal
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                Reunimos mascotas perdidas con sus familias
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty">
                Sanos y Salvos centraliza la búsqueda de mascotas perdidas, conectando a dueños, 
                clínicas veterinarias y refugios con tecnología de coincidencia inteligente.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/create-report?type=lost">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    <PawPrint className="h-5 w-5" />
                    Perdí mi mascota
                  </Button>
                </Link>
                <Link href="/create-report?type=found">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                    <Search className="h-5 w-5" />
                    Encontré una mascota
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 mt-16">
            <Card className="max-w-3xl mx-auto">
              <CardContent className="py-6">
                <div className="grid grid-cols-3 divide-x">
                  <div className="text-center px-4">
                    <div className="text-3xl font-bold text-destructive">{lostCount}</div>
                    <div className="text-sm text-muted-foreground">Mascotas Perdidas</div>
                  </div>
                  <div className="text-center px-4">
                    <div className="text-3xl font-bold text-accent-foreground">{foundCount}</div>
                    <div className="text-sm text-muted-foreground">Mascotas Encontradas</div>
                  </div>
                  <div className="text-center px-4">
                    <div className="text-3xl font-bold text-primary">85%</div>
                    <div className="text-sm text-muted-foreground">Tasa de Reencuentro</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">¿Cómo Funciona?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Nuestra plataforma simplifica el proceso de búsqueda y reencuentro
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="relative">
                <div className="absolute -top-4 left-6 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  1
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="flex items-center gap-2">
                    <PawPrint className="h-5 w-5 text-primary" />
                    Reporta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Crea un reporte con foto, ubicación y características de la mascota perdida o encontrada.
                  </p>
                </CardContent>
              </Card>

              <Card className="relative">
                <div className="absolute -top-4 left-6 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  2
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    Motor de Coincidencias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nuestro algoritmo analiza automáticamente los reportes para detectar posibles coincidencias.
                  </p>
                </CardContent>
              </Card>

              <Card className="relative">
                <div className="absolute -top-4 left-6 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  3
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Recibe Alertas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Te notificamos instantáneamente cuando encontramos una posible coincidencia para tu mascota.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Reportes Recientes</h2>
                <p className="text-muted-foreground">Últimas mascotas reportadas en la plataforma</p>
              </div>
              <Link href="/pets">
                <Button variant="outline" className="gap-2">
                  Ver todos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Características de la Plataforma</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Diseñada con la seguridad y privacidad de los usuarios como prioridad
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card>
                <CardHeader>
                  <MapPin className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-lg">Geolocalización</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Mapa interactivo con todos los reportes activos para identificar zonas de extravío.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-lg">Privacidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Tus datos de contacto están protegidos y solo se comparten tras verificar coincidencias.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Clock className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-lg">Tiempo Real</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Alertas instantáneas cuando el motor detecta una posible coincidencia.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-lg">Red de Apoyo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Conexión con clínicas veterinarias, refugios y la comunidad.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto bg-primary text-primary-foreground">
              <CardContent className="py-12 px-8 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  ¿Perdiste o encontraste una mascota?
                </h2>
                <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                  Cada minuto cuenta. Reporta ahora y deja que nuestra tecnología 
                  te ayude a reunir a esa mascota con su familia.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/create-report">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2">
                      <PawPrint className="h-5 w-5" />
                      Crear Reporte
                    </Button>
                  </Link>
                  <Link href="/pets">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                      <MapPin className="h-5 w-5" />
                      Ver Mascotas
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-12 border-t">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm text-muted-foreground mb-6">
              Red de colaboradores y entidades asociadas
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <span className="text-sm font-medium">Clínicas Veterinarias</span>
              </div>
              <div className="flex items-center gap-2">
                <Dog className="h-5 w-5" />
                <span className="text-sm font-medium">Refugios de Animales</span>
              </div>
              <div className="flex items-center gap-2">
                <Cat className="h-5 w-5" />
                <span className="text-sm font-medium">Organizaciones Animalistas</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium">Municipalidades</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}