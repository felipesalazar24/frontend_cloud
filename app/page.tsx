"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMsal } from "@azure/msal-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPetImage, getPetPlaceholder } from "@/lib/pet-helper";
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
  Heart,
  Eye,
} from "lucide-react";

export default function HomePage() {
  const { instance, accounts, inProgress } = useMsal();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8084/api/v1";

  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      if (inProgress !== "none") return;

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (accounts.length > 0) {
          try {
            const tokenResponse = await instance.acquireTokenSilent({
              scopes: ["api://a4d3e345-3a3d-45e3-a248-a07a76da5e1b/access_as_user"],
              account: accounts[0],
            });
            headers["Authorization"] = `Bearer ${tokenResponse.accessToken}`;
          } catch (tokenErr) {
            console.warn("No se pudo obtener token silencioso en Home:", tokenErr);
          }
        }

        const response = await fetch(`${apiUrl}/bff/web/pets`, {
          method: "GET",
          headers,
        });

        if (response.ok) {
          const data = await response.json();
          const allPets = Array.isArray(data) ? data : data.collection || [];
          setPets(allPets);
        }
      } catch (err) {
        console.error("Error cargando estadísticas en Home:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [accounts.length, inProgress, instance, apiUrl]);

  // Cálculo dinámico de métricas reales
  const lostCount = pets.filter(
    (p) => String(p.status || "").toLowerCase() === "perdido"
  ).length;

  const foundCount = pets.filter(
    (p) => String(p.status || "").toLowerCase() === "encontrado"
  ).length;

  const reunitedCount = pets.filter(
    (p) => String(p.status || "").toLowerCase() === "reunido"
  ).length;

  const reunionRate =
    pets.length > 0 ? Math.round((reunitedCount / pets.length) * 100) : 0;

  const recentReports = pets.slice(0, 3);

  const getStatusVariant = (status?: string) => {
    const normalized = String(status || "").toLowerCase();
    if (normalized === "perdido") return "destructive";
    if (normalized === "reunido") return "default";
    return "secondary";
  };

  const renderRecentReports = () => {
    if (loading) {
      return (
        <div className="col-span-full text-center p-8 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">Cargando reportes recientes...</p>
        </div>
      );
    }

    if (recentReports.length === 0) {
      return (
        <div className="col-span-full text-center p-8 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">
            Inicia sesión o crea el primer reporte para ver mascotas recientes.
          </p>
        </div>
      );
    }

    return recentReports.map((pet) => (
      <Card key={pet.id} className="overflow-hidden flex flex-col">
        <img
          src={getPetImage(pet)}
          alt={pet.name || "Mascota"}
          className="w-full h-48 object-cover bg-muted"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = getPetPlaceholder(pet);
          }}
        />
        <CardContent className="p-4 flex-1 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <h3 className="font-semibold text-lg capitalize">
                {pet.name || "Sin nombre"}
              </h3>
              <Badge variant={getStatusVariant(pet.status)} className="capitalize">
                {pet.status || "Activo"}
              </Badge>
            </div>
            {(pet.location || pet.address || pet.lastSeenLocation) && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {pet.location || pet.address || pet.lastSeenLocation}
              </p>
            )}
          </div>

          <Button variant="outline" size="sm" asChild className="w-full gap-2">
            <Link href={`/api/v1/bff/web/pets/${pet.id}`}>
              <Eye className="h-4 w-4" />
              Ver detalle
            </Link>
          </Button>
        </CardContent>
      </Card>
    ));
  };

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

          {/* Tarjeta de Estadísticas en Tiempo Real (4 columnas) */}
          <div className="container mx-auto px-4 mt-16">
            <Card className="max-w-4xl mx-auto">
              <CardContent className="py-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x">
                  <div className="text-center px-4">
                    <div className="text-3xl font-bold text-red-600">
                      {loading ? "..." : lostCount}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Mascotas Perdidas</div>
                  </div>

                  <div className="text-center px-4">
                    <div className="text-3xl font-bold text-amber-600">
                      {loading ? "..." : foundCount}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Mascotas Encontradas</div>
                  </div>

                  <div className="text-center px-4">
                    <div className="text-3xl font-bold text-green-600">
                      {loading ? "..." : reunitedCount}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Mascotas Reunidas</div>
                  </div>

                  <div className="text-center px-4">
                    <div className="text-3xl font-bold text-primary">
                      {loading ? "..." : `${reunionRate}%`}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Tasa de Reencuentro</div>
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

        {/* Reportes Recientes Reales */}
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
              {renderRecentReports()}
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
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                    >
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
  );
}