"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  PawPrint,
  Settings,
  LogOut,
  MapPin,
  Calendar,
  Eye,
} from "lucide-react";
import Link from "next/link";

interface UserData {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  address: string;
  addressNumber: number;
  city: string;
  country: string;
}

function parseJwt(token: string): Record<string, any> | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [userReports, setUserReports] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProfileAndReports = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const payload = parseJwt(token);
        const email = payload?.sub || payload?.email;

        if (!email) {
          throw new Error(
            "No se pudo extraer el identificador de usuario del token.",
          );
        }

        const userResponse = await fetch(
          `/api-bff/users/profile?email=${encodeURIComponent(email)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!userResponse.ok) {
          throw new Error("No se pudo cargar el perfil real del usuario");
        }

        const userData: UserData = await userResponse.json();
        setUser(userData);

        try {
          const petsResponse = await fetch(
            `/api-bff/pets`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          );

          if (petsResponse.ok) {
            const allPets = await petsResponse.json();
            if (Array.isArray(allPets)) {
              const filtered = allPets.filter(
                (pet) =>
                  String(pet.userId || pet.user_id || "") ===
                  String(userData.id),
              );
              setUserReports(filtered);
            }
          }
        } catch (petErr) {
          console.error("Error cargando las mascotas desde el BFF:", petErr);
        }
      } catch (err: any) {
        setError(err.message || "Error loading profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndReports();
  }, [router]);

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    router.push("/login");
  };

  const activeReports = userReports.filter(
    (r) =>
      String(r.status).toLowerCase() === "activo" ||
      String(r.status).toLowerCase() === "extraviado",
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando perfil...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600 gap-4">
        <p>{error || "No se encontró el usuario."}</p>
        <Button onClick={handleLogout}>Volver a login</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardContent className="py-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h1 className="text-2xl font-bold capitalize">
                    {user.name} {user.lastName}
                  </h1>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <Button
                    variant="outline"
                    className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">
                  {userReports.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Mis Reportes
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-accent-foreground">
                  {activeReports.length}
                </div>
                <div className="text-sm text-muted-foreground">Activos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">
                  Reencuentros
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Alertas</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="reports">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reports" className="gap-2">
                <PawPrint className="h-4 w-4" />
                Mis Reportes
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                Ver mi Información
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="mt-6 space-y-4">
              {userReports.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <PawPrint className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No tienes reportes</h3>
                    <p className="text-muted-foreground mb-4">
                      Crea tu primer reporte para comenzar a buscar o ayudar a
                      reunir mascotas.
                    </p>
                    <Link href="/create-report">
                      <Button>Crear Reporte</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                userReports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="py-4">
                      <div className="flex gap-4">
                        {report.imageUrl && (
                          <img
                            src={report.imageUrl}
                            alt={report.petName || report.name || "Mascota"}
                            className="h-20 w-20 rounded-lg object-cover"
                            crossOrigin="anonymous"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">
                                  {report.petName ||
                                    report.name ||
                                    report.petType ||
                                    "Mascota"}
                                </h3>
                                <Badge
                                  variant={
                                    String(report.type).toLowerCase() ===
                                      "perdido" ||
                                    String(report.status).toLowerCase() ===
                                      "extraviado"
                                      ? "destructive"
                                      : "default"
                                  }
                                >
                                  {String(report.type).toLowerCase() ===
                                    "perdido" ||
                                  String(report.status).toLowerCase() ===
                                    "extraviado"
                                    ? "Extraviado"
                                    : "Encontrado"}
                                </Badge>
                                <Badge variant="outline">{report.status}</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {report.location?.city ||
                                    report.lastSeenLocation ||
                                    report.last_seen_location ||
                                    "N/A"}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {report.createdAt ||
                                  report.lastSeenDate ||
                                  report.last_seen_date
                                    ? new Date(
                                        report.createdAt ||
                                          report.lastSeenDate ||
                                          report.last_seen_date,
                                      ).toLocaleDateString("es-CL")
                                    : "N/A"}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Link href={`/report/${report.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1"
                                >
                                  <Eye className="h-3 w-3" />
                                  Ver
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}

              <Link href="/create-report">
                <Button variant="outline" className="w-full gap-2">
                  <PawPrint className="h-4 w-4" />
                  Crear Nuevo Reporte
                </Button>
              </Link>
            </TabsContent>

            <TabsContent value="settings" className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>
                    Aquí se muestra tu información de contacto almacenada en el
                    sistema.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Nombre Completo
                      </p>
                      <p className="font-medium capitalize">
                        {user.name} {user.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">{user.phoneNumber || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">País</p>
                      <p className="font-medium capitalize">
                        {user.country || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dirección</p>
                      <p className="font-medium capitalize">
                        {user.address} {user.addressNumber || ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ciudad</p>
                      <p className="font-medium capitalize">
                        {user.city || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
