"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMsal, AuthenticatedTemplate } from "@azure/msal-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle, AlertCircle, ShieldAlert } from "lucide-react";

export default function AdminReportsPage() {
    const router = useRouter();
    const { instance, accounts, inProgress } = useMsal();

    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                if (inProgress !== "none") return;
                if (accounts.length === 0) {
                    router.push("/login");
                    return;
                }

                const tokenResponse = await instance.acquireTokenSilent({
                    scopes: ["a4d3e345-3a3d-45e3-a248-a07a76da5e1b/.default"],
                    account: accounts[0]
                });

                const response = await fetch('http://localhost:8084/api/v1/bff/web/pets', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${tokenResponse.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error("Error al cargar los reportes");

                const data = await response.json();
                const petsArray = Array.isArray(data) ? data : (data.collection || []);
                setReports(petsArray);
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar los reportes. Verifica tu conexión.");
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [accounts, inProgress, instance, router]);

    const handleDelete = async (petId: string | number) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este reporte de forma permanente?")) return;

        try {
            const tokenResponse = await instance.acquireTokenSilent({
                scopes: ["a4d3e345-3a3d-45e3-a248-a07a76da5e1b/.default"],
                account: accounts[0]
            });

            const response = await fetch(`http://localhost:8084/api/v1/bff/web/pets/${petId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${tokenResponse.accessToken}`
                }
            });

            if (response.ok) {
                setReports(reports.filter(report => report.id !== petId));
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
            const tokenResponse = await instance.acquireTokenSilent({
                scopes: ["a4d3e345-3a3d-45e3-a248-a07a76da5e1b/.default"],
                account: accounts[0]
            });

            const updatedPetPayload = {
                ...currentPetData,
                status: "reunido"
            };

            const response = await fetch(`http://localhost:8084/api/v1/bff/web/pets/${petId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${tokenResponse.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPetPayload)
            });

            if (response.ok) {
                setReports(reports.map(report =>
                    report.id === petId ? { ...report, status: "reunido" } : report
                ));
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
                <main className="flex-1 flex items-center justify-center">Cargando panel de administración...</main>
                <Footer />
            </div>
        );
    }

    return (
        <AuthenticatedTemplate>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
                    <div className="flex items-center gap-3 mb-8 border-b pb-4">
                        <ShieldAlert className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold">Gestión de Reportes</h1>
                            <p className="text-muted-foreground">Panel de administración para moderar mascotas perdidas y encontradas.</p>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 mb-6 bg-destructive/10 border border-destructive text-destructive rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <div className="grid gap-4">
                        {reports.length === 0 && !error ? (
                            <p className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border">No hay reportes activos en el sistema.</p>
                        ) : (
                            reports.map((report) => (
                                <Card key={report.id} className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        {report.imageUrl || report.photoUrl ? (
                                            <img
                                                src={report.imageUrl || report.photoUrl}
                                                alt={report.name}
                                                className="w-16 h-16 rounded-md object-cover bg-muted"
                                                crossOrigin="anonymous"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center text-xs text-center text-muted-foreground">
                                                Sin foto
                                            </div>
                                        )}

                                        <div>
                                            <h3 className="font-semibold text-lg capitalize">{report.name || "Sin nombre"}</h3>
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                <Badge variant={String(report.status).toLowerCase() === 'perdido' ? 'destructive' : 'secondary'} className="capitalize">
                                                    {report.status}
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">ID: {report.id}</span>
                                                <span className="text-sm text-muted-foreground capitalize">
                                                    Especie: {report.petType || report.type ||
                                                    (report.typeId ? ({ "1": "perro", "2": "gato", "10": "perro", "11": "gato", "12": "ave" }[String(report.typeId)] || `tipo ${report.typeId}`) : 'N/A')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                        {/* Botón para cambiar estado, se oculta si ya está reunido */}
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

                                        {/* Botón para eliminar */}
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
                </main>
                <Footer />
            </div>
        </AuthenticatedTemplate>
    );
}