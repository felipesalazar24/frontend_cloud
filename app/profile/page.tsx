"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, PawPrint, Settings, LogOut, MapPin, Calendar, Eye } from "lucide-react";
import Link from "next/link";
import { useMsal, AuthenticatedTemplate } from "@azure/msal-react";
import { getPetImage, getPetPlaceholder } from "@/lib/pet-helper";

export default function ProfilePage() {
  const { instance, accounts, inProgress } = useMsal();
  const activeAccount = accounts[0];
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8084/api/v1";

  const userRoles = (activeAccount?.idTokenClaims as any)?.roles || [];
  const isAdmin = userRoles.some(
    (role: string) => role.toLowerCase() === "admin" || role.toLowerCase() === "approle_admin"
  );

  const [userReports, setUserReports] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProfileAndReports = async () => {
      try {
        if (inProgress !== "none") return;
        if (accounts.length === 0) return;

        const currentAccount = accounts[0];
        const email = currentAccount.username;

        const tokenResponse = await instance.acquireTokenSilent({
          scopes: ["api://a4d3e345-3a3d-45e3-a248-a07a76da5e1b/access_as_user"],
          account: currentAccount,
        });
        const token = tokenResponse.accessToken;

        let myUserId = null;
        const userResponse = await fetch(
          `${apiUrl}/bff/web/users/profile?email=${encodeURIComponent(email)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (userResponse.ok) {
          const userData = await userResponse.json();
          myUserId = Number(userData.id);
        }

        const petsResponse = await fetch(`${apiUrl}/bff/web/pets`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (petsResponse.ok) {
          const data = await petsResponse.json();
          const allPets = Array.isArray(data) ? data : data.collection || [];

          if (myUserId && !isNaN(myUserId)) {
            const myPets = allPets.filter((pet: any) => pet.userId === myUserId);
            setUserReports(myPets);
          } else {
            setUserReports([]);
          }
        }
      } catch (err) {
        console.error("Error cargando perfil o reportes:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfileAndReports();
  }, [accounts, inProgress, instance, apiUrl]);

  const handleLogout = (): void => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/login",
    });
  };

  const activeReports = userReports.filter((r) => {
    const status = String(r.status || "").toLowerCase();
    return status === "activo" || status === "perdido" || status === "encontrado";
  });

  const reunitedReports = userReports.filter(
    (r) => String(r.status || "").toLowerCase() === "reunido"
  );

  const displayName = activeAccount?.name || "Usuario";
  const displayEmail = activeAccount?.username || "correo@ejemplo.com";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          Cargando perfil seguro...
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <AuthenticatedTemplate>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl space-y-6">
          {/* Cabecera del Perfil */}
          <Card>
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{displayName}</h1>
                    {isAdmin && <Badge variant="secondary">Admin</Badge>}
                  </div>
                  <p className="text-muted-foreground">{displayEmail}</p>
                </div>
              </div>

              <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-2" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>

          {/* Estadísticas (3 columnas, sin Alertas) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold text-primary">{userReports.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Mis Reportes</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold text-amber-600">{activeReports.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Activos</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold text-green-600">{reunitedReports.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Reencuentros</p>
              </CardContent>
            </Card>
          </div>

          {/* Pestañas */}
          <Tabs defaultValue="reports" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="reports" className="gap-2">
                <PawPrint className="w-4 h-4" />
                Mis Reportes
              </TabsTrigger>
              <TabsTrigger value="info" className="gap-2">
                <Settings className="w-4 h-4" />
                Ver mi Información
              </TabsTrigger>
            </TabsList>

            {/* Lista de Reportes */}
            <TabsContent value="reports" className="space-y-4">
              {userReports.length === 0 ? (
                <Card>
                  <CardContent className="p-10 text-center text-muted-foreground">
                    Aún no has creado ningún reporte de mascota.
                  </CardContent>
                </Card>
              ) : (
                userReports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img
                          src={getPetImage(report)}
                          alt={report.name || "Mascota"}
                          className="w-16 h-16 rounded-md object-cover bg-muted"
                          onError={(e) => {
                            e.currentTarget.src = getPetPlaceholder(report);
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg capitalize">
                              {report.name || "Sin nombre"}
                            </h3>
                            <Badge
                              variant={
                                String(report.status).toLowerCase() === "perdido"
                                  ? "destructive"
                                  : String(report.status).toLowerCase() === "reunido"
                                    ? "default"
                                    : "secondary"
                              }
                              className="capitalize"
                            >
                              {report.status || "Activo"}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-muted-foreground">
                            {(report.location || report.address || report.lastSeenLocation) && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {report.location || report.address || report.lastSeenLocation}
                              </span>
                            )}
                            {(report.createdAt || report.date || report.lastSeenDate) && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(
                                  report.createdAt || report.date || report.lastSeenDate
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" asChild className="w-full sm:w-auto gap-2">
                        <Link href={`/api/v1/bff/web/pets/${report.id}`}>
                          <Eye className="w-4 h-4" />
                          Ver detalle
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Información de la cuenta */}
            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Información de la Cuenta</CardTitle>
                  <CardDescription>
                    Datos sincronizados con Microsoft Entra ID.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                    <p className="text-base">{displayName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Correo Electrónico</p>
                    <p className="text-base">{displayEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rol</p>
                    <Badge variant="outline">{isAdmin ? "Administrador" : "Usuario"}</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </div>
    </AuthenticatedTemplate>
  );
}