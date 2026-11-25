"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMsal, AuthenticatedTemplate } from "@azure/msal-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPetImage, getPetPlaceholder } from "@/lib/pet-helper";
import {
  Trash2,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  ExternalLink,
  RefreshCw,
  Activity,
  Server,
} from "lucide-react";
import { useApi } from "@/hooks/use-api";

const KAFKA_UI_URL = process.env.NEXT_PUBLIC_KAFKA_UI_URL || "http://ad0dc6efdbca24457915d4a79bbdc9b9-1665256832.us-east-1.elb.amazonaws.com:8090";
const RABBIT_UI_URL = process.env.NEXT_PUBLIC_RABBIT_UI_URL || "http://aa67e8e4ac01a433585ce9065004449c-1601269210.us-east-1.elb.amazonaws.com:15672";

export default function AdminReportsPage() {
  const router = useRouter();
  const { accounts, inProgress } = useMsal();
  const { fetchWithToken } = useApi();

  const [reports, setReports] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [consumerGroups, setConsumerGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingKafka, setLoadingKafka] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kafkaError, setKafkaError] = useState<string | null>(null);

  const PET_TYPES_MAP: Record<string, { nameType: string; breed: string }> = {
    "1": { nameType: "Perro", breed: "Husky" },
    "2": { nameType: "Perro", breed: "Doberman" },
    "3": { nameType: "Perro", breed: "Pastor Alemán" },
    "4": { nameType: "Perro", breed: "Labrador" },
    "5": { nameType: "Perro", breed: "Cocker Spaniel" },
    "6": { nameType: "Perro", breed: "Bulldog" },
    "7": { nameType: "Perro", breed: "Caniche" },
    "8": { nameType: "Perro", breed: "Beagle" },
    "9": { nameType: "Perro", breed: "Chihuahua" },
    "10": { nameType: "Perro", breed: "Otro" },
    "11": { nameType: "Gato", breed: "Naranjo" },
    "12": { nameType: "Gato", breed: "Calico" },
    "13": { nameType: "Gato", breed: "Egipcio" },
    "14": { nameType: "Gato", breed: "Siamés" },
    "15": { nameType: "Gato", breed: "Persa" },
    "16": { nameType: "Gato", breed: "Bengalí" },
    "17": { nameType: "Gato", breed: "Ragdoll" },
    "18": { nameType: "Gato", breed: "Otro" },
    "19": { nameType: "Ave", breed: "Loro" },
    "20": { nameType: "Ave", breed: "Canario" },
    "21": { nameType: "Ave", breed: "Paloma" },
    "22": { nameType: "Ave", breed: "Gallina" },
    "23": { nameType: "Ave", breed: "Ganso" },
    "24": { nameType: "Ave", breed: "Otro" },
    "25": { nameType: "Otro", breed: "Conejo" },
    "26": { nameType: "Otro", breed: "Hamster" },
    "27": { nameType: "Otro", breed: "Tortuga" },
    "28": { nameType: "Otro", breed: "Otro" },
  };

  const getPetTypeLabel = (report: any) => {
    if (report.petType) return report.petType;
    if (report.type) return report.type;
    const match = PET_TYPES_MAP[String(report.typeId)];
    return match ? `${match.nameType} (${match.breed})` : "N/A";
  };

  // 1. Verificación de rol (insensible a mayúsculas/prefijo)
  useEffect(() => {
    if (inProgress !== "none") return;

    if (accounts.length === 0) {
      router.push("/login");
      return;
    }

    const activeAccount = accounts[0];
    const roles = (activeAccount.idTokenClaims?.roles as string[]) || [];
    const isAdmin = roles.some(
      (role) => role.toLowerCase() === "admin" || role.toLowerCase() === "approle_admin"
    );

    if (!isAdmin) {
      router.push("/");
    }
  }, [accounts, inProgress, router]);

  // 2. Carga de reportes de mascotas
  useEffect(() => {
    const fetchReports = async () => {
      if (accounts.length === 0 || inProgress !== "none") return;

      try {
        const response = await fetchWithToken("/api/v1/bff/web/pets", { method: "GET" });
        if (!response.ok) throw new Error("Error al cargar los reportes");

        const data = await response.json();
        const petsArray = Array.isArray(data) ? data : data.collection || [];
        setReports(petsArray);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los reportes. Verifica tu conexión.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [accounts, inProgress]);

  // 3. Carga de tópicos y consumer groups de Kafka vía BFF
  const fetchKafkaStatus = useCallback(async () => {
    if (accounts.length === 0 || inProgress !== "none") return;

    setLoadingKafka(true);
    setKafkaError(null);

    try {
      const [topicsRes, groupsRes] = await Promise.all([
        fetchWithToken("/api/v1/bff/web/kafka/topics", { method: "GET" }),
        fetchWithToken("/api/v1/bff/web/kafka/consumer-groups", { method: "GET" }),
      ]);

      if (!topicsRes.ok || !groupsRes.ok) {
        throw new Error("Error consultando estado de Kafka desde el BFF");
      }

      const topicsData = await topicsRes.json();
      const groupsData = await groupsRes.json();

      setTopics(Array.isArray(topicsData) ? topicsData : Object.values(topicsData || {}));
      setConsumerGroups(Array.isArray(groupsData) ? groupsData : Object.values(groupsData || {}));
    } catch (err) {
      console.error(err);
      setKafkaError("No se pudo obtener la información de Kafka desde el BFF.");
    } finally {
      setLoadingKafka(false);
    }
  }, [accounts, inProgress]);

  useEffect(() => {
    fetchKafkaStatus();
  }, [fetchKafkaStatus]);

  const handleDelete = async (petId: string | number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este reporte de forma permanente?")) return;

    try {
      const response = await fetchWithToken(`/api/v1/bff/web/pets/${petId}`, { method: "DELETE" });
      if (response.ok) {
        setReports(reports.filter((report) => report.id !== petId));
        alert("Reporte eliminado con éxito.");
      } else {
        throw new Error("No se pudo eliminar el reporte");
      }
    } catch (err) {
      console.error(err);
      alert("Error al intentar eliminar el reporte.");
    }
  };

  const handleResolveStatus = async (petId: string | number, currentPetData: any) => {
    if (!confirm("¿Marcar esta mascota como reunida con su dueño?")) return;

    try {
      const response = await fetchWithToken(`/api/v1/bff/web/pets/${petId}`, {
        method: "PUT",
        body: JSON.stringify({ ...currentPetData, status: "reunido" }),
      });

      if (response.ok) {
        setReports(
          reports.map((report) =>
            report.id === petId ? { ...report, status: "reunido" } : report
          )
        );
        alert("Estado actualizado a reunido.");
      } else {
        throw new Error("No se pudo actualizar el estado");
      }
    } catch (err) {
      console.error(err);
      alert("Error al intentar actualizar el estado del reporte.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          Cargando panel de administración...
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <AuthenticatedTemplate>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
          {/* Cabecera + Accesos Directos a Consolas de Mensajería */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b pb-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Panel de Administración</h1>
                <p className="text-muted-foreground">
                  Moderación de reportes y monitoreo de arquitectura de eventos.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" asChild className="gap-2">
                <a href={KAFKA_UI_URL} target="_blank" rel="noopener noreferrer">
                  <Activity className="w-4 h-4" />
                  Kafka UI
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Button>
              <Button variant="outline" asChild className="gap-2">
                <a href={RABBIT_UI_URL} target="_blank" rel="noopener noreferrer">
                  <Server className="w-4 h-4" />
                  RabbitMQ UI
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="reports" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="reports">Reportes ({reports.length})</TabsTrigger>
              <TabsTrigger value="kafka">Monitoreo Kafka</TabsTrigger>
            </TabsList>

            {/* Pestaña 1: Reportes de Mascotas */}
            <TabsContent value="reports">
              {error && (
                <div className="p-4 mb-6 bg-destructive/10 border border-destructive text-destructive rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <div className="grid gap-4">
                {reports.length === 0 && !error ? (
                  <p className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border">
                    No hay reportes activos en el sistema.
                  </p>
                ) : (
                  reports.map((report) => (
                    <Card
                      key={report.id}
                      className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4"
                    >
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
                          <h3 className="font-semibold text-lg capitalize">
                            {report.name || "Sin nombre"}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge
                              variant={
                                String(report.status).toLowerCase() === "perdido"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="capitalize"
                            >
                              {report.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">ID: {report.id}</span>
                            <span className="text-sm text-muted-foreground">
                              Especie: {getPetTypeLabel(report)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                        {String(report.status).toLowerCase() !== "reunido" && (
                          <Button
                            variant="outline"
                            className="flex-1 sm:flex-none gap-2"
                            onClick={() => handleResolveStatus(report.id, report)}
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Marcar Reunido
                          </Button>
                        )}

                        <Button
                          variant="destructive"
                          className="flex-1 sm:flex-none gap-2"
                          onClick={() => handleDelete(report.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Pestaña 2: Monitoreo Kafka desde el BFF */}
            <TabsContent value="kafka">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground">
                  Datos obtenidos en tiempo real a través de <code>ms-bff</code> →{" "}
                  <code>ms-kafka-admin</code>.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchKafkaStatus}
                  disabled={loadingKafka}
                  className="gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingKafka ? "animate-spin" : ""}`} />
                  Refrescar
                </Button>
              </div>

              {kafkaError && (
                <div className="p-4 mb-6 bg-destructive/10 border border-destructive text-destructive rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {kafkaError}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tópicos Activos ({topics.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {topics.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Sin tópicos registrados.</p>
                    ) : (
                      topics.map((topic, i) => (
                        <div
                          key={i}
                          className="p-2 rounded border bg-muted/30 text-sm font-mono break-all"
                        >
                          {typeof topic === "string" ? topic : topic.name || JSON.stringify(topic)}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Consumer Groups ({consumerGroups.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {consumerGroups.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Sin grupos activos.</p>
                    ) : (
                      consumerGroups.map((group, i) => (
                        <div
                          key={i}
                          className="p-2 rounded border bg-muted/30 text-sm font-mono break-all"
                        >
                          {typeof group === "string"
                            ? group
                            : group.groupId || group.name || JSON.stringify(group)}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </div>
    </AuthenticatedTemplate>
  );
}