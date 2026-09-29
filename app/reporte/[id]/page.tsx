"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMsal } from "@azure/msal-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";

const petTypeIcons: Record<string, any> = {
  perro: Dog,
  gato: Cat,
  ave: Bird,
  otro: HelpCircle,
};

export default function ReportePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const { instance, accounts, inProgress } = useMsal();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        if (inProgress !== "none") return;
        if (accounts.length === 0) {
          setError("Debes iniciar sesión para ver los detalles.");
          setLoading(false);
          return;
        }

        const activeAccount = accounts[0];
        const tokenResponse = await instance.acquireTokenSilent({
          scopes: ["a4d3e345-3a3d-45e3-a248-a07a76da5e1b/.default"],
          account: activeAccount
        });

        // 1. Buscamos la mascota
        const petResponse = await fetch(`http://localhost:8084/api/v1/bff/web/pets/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokenResponse.accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!petResponse.ok) throw new Error("Mascota no encontrada en la base de datos.");
        
        const petData = await petResponse.json();

        // 2. Si la mascota tiene un userId, buscamos los datos de contacto
        if (petData.userId) {
          try {
            // Ajusta esta URL si tu endpoint para obtener un usuario por ID es diferente
            const userResponse = await fetch(`http://localhost:8084/api/v1/bff/web/users/${petData.userId}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${tokenResponse.accessToken}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              // Insertamos los datos del usuario dentro del objeto de la mascota para que la interfaz los lea
              petData.contactName = `${userData.name || ''} ${userData.last_name || userData.lastName || ''}`.trim();
              petData.contactPhone = userData.phone_number || userData.phoneNumber;
              petData.contactEmail = userData.email;
            }
          } catch (userErr) {
            console.warn("No se pudo cargar la información del usuario del reporte", userErr);
          }
        }

        setReport(petData);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los detalles de la mascota.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPetDetails();
    }
  }, [id, accounts, inProgress, instance]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">Cargando información segura...</main>
        <Footer />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-destructive font-medium">{error || "Reporte no encontrado"}</p>
          <Button onClick={() => router.push("/pets")}>Volver al listado</Button>
        </main>
        <Footer />
      </div>
    );
  }

  // Ajuste de tipos y estados según lo que devuelve el BFF
  const petTypeStr = report.petType || report.type || 'otro';
  const PetIcon = petTypeIcons[String(petTypeStr).toLowerCase()] || HelpCircle;
  const statusLower = String(report.status).toLowerCase();
  const isLost = statusLower === 'perdido' || statusLower === 'extraviado';
  
  // Variables de contacto (Si tu BFF aún no trae los datos del usuario, mostrará fallbacks seguros)
  const contactName = report.contactName || report.userName || "Usuario Registrado";
  const contactPhone = report.contactPhone || report.userPhone;
  const contactEmail = report.contactEmail || report.userEmail;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/pets" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Volver al listado
          </Link>

          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            {/* Main Content */}
            <div className="space-y-6">
              {/* Image */}
              {(report.imageUrl || report.photoUrl) && (
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                  <img
                    src={report.imageUrl || report.photoUrl}
                    alt={report.name || 'Mascota'}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                  <Badge 
                    className="absolute top-4 left-4 text-sm px-3 py-1 capitalize"
                    variant={isLost ? 'destructive' : 'default'}
                  >
                    Mascota {report.status}
                  </Badge>
                </div>
              )}

              {/* Pet Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl capitalize">
                        {report.name || "Mascota sin nombre"}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1 capitalize">
                        <PetIcon className="h-4 w-4" />
                        {report.breed || 'Raza no especificada'} • {report.color || 'Color no especificado'}
                      </CardDescription>
                    </div>
                    {report.ageCategory && (
                      <Badge variant="outline" className="capitalize">
                        {report.ageCategory}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Descripción</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {report.description || "No hay descripción adicional provista."}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Ubicación</p>
                        <p className="text-sm text-muted-foreground">
                          {report.lastSeenLocation || report.location || report.address || "No especificada"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">
                          {isLost ? 'Última vez visto' : 'Fecha de reporte'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {report.lastSeenDate || report.createdAt ? 
                            new Date(report.lastSeenDate || report.createdAt).toLocaleDateString('es-CL', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : "Fecha desconocida"
                          }
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
                    Contacta al {isLost ? 'dueño' : 'reportador'} directamente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{contactName}</p>
                      <p className="text-sm text-muted-foreground">
                        {isLost ? 'Dueño de la mascota' : 'Reportador'}
                      </p>
                    </div>
                  </div>

                  <Separator />
                  
                  {contactPhone ? (
                    <a href={`tel:${contactPhone}`} className="block">
                      <Button className="w-full gap-2" size="lg">
                        <Phone className="h-4 w-4" />
                        Llamar: {contactPhone}
                      </Button>
                    </a>
                  ) : (
                    <Button disabled className="w-full gap-2" size="lg">
                        <Phone className="h-4 w-4" />
                        Teléfono no provisto
                    </Button>
                  )}

                  {contactEmail && (
                    <a href={`mailto:${contactEmail}`} className="block">
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
                  {!isLost ? (
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
                {report.createdAt && <p>Creado: {new Date(report.createdAt).toLocaleDateString('es-CL')}</p>}
                <p>Estado actual: <span className="capitalize font-semibold">{report.status}</span></p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}