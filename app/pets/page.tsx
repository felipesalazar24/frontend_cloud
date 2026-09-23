'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Calendar, FilterX } from 'lucide-react';

interface PetReport {
  id: string;
  name: string;
  ageCategory?: string;
  age_category?: string;
  typeId?: number | string;
  type_id?: string;
  userId?: number;
  user_id?: string;
  lastSeenLocation?: string;
  last_seen_location?: string;
  lastSeenDate?: string;
  last_seen_date?: string;
  color: string;
  description: string;
  status: 'extraviado' | 'encontrado';
}

const COLORS = ['Todos', 'Negro', 'Blanco', 'Gris', 'Marrón', 'Dorado', 'Rojo', 'Blanco con Negro', 'Blanco con Marrón', 'Blanco con Gris', 'Otro'];
const AGE_CATEGORIES = ['Todos', 'Joven', 'Adulto', 'Viejo'];
const STATUS_OPTIONS = ['Todos', 'Extraviado', 'Encontrado'];

export default function PetsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<PetReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<PetReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('Todos');
  const [selectedAge, setSelectedAge] = useState<string>('Todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api-bff/pets', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch pet reports');
        }

        const data = await response.json();
        const petsArray = data.collection || [];
        setReports(petsArray);
        setFilteredReports(petsArray);
      } catch (err: any) {
        setError(err.message || 'Error loading reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [router]);

  useEffect(() => {
    let result = reports;

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(report => {
        const name = report.name?.toLowerCase() || '';
        const location = (report.lastSeenLocation || report.last_seen_location || '').toLowerCase();
        const description = report.description?.toLowerCase() || '';
        return name.includes(query) || location.includes(query) || description.includes(query);
      });
    }

    if (selectedColor !== 'Todos') {
      result = result.filter(report => report.color === selectedColor);
    }

    if (selectedAge !== 'Todos') {
      result = result.filter(report => {
        const age = (report.ageCategory || report.age_category || '').toLowerCase();
        return age === selectedAge.toLowerCase();
      });
    }

    if (selectedStatus !== 'Todos') {
      const statusValue = selectedStatus === 'Extraviado' ? 'extraviado' : 'encontrado';
      result = result.filter(report => report.status === statusValue);
    }

    setFilteredReports(result);
  }, [searchQuery, selectedColor, selectedAge, selectedStatus, reports]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedColor('Todos');
    setSelectedAge('Todos');
    setSelectedStatus('Todos');
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return dateStr.split('T')[0];
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando reportes...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Mascotas Reportadas</h1>
          <p className="text-muted-foreground">
            Explora y filtra los reportes de mascotas perdidas y encontradas en tu comunidad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Filtros Avanzados
                <Button variant="ghost" size="icon" onClick={handleResetFilters} title="Limpiar filtros">
                  <FilterX className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Búsqueda general</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Comuna, raza, descripción..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLORS.map(color => (
                      <SelectItem key={color} value={color}>{color}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Categoría de Edad</Label>
                <Select value={selectedAge} onValueChange={setSelectedAge}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AGE_CATEGORIES.map(age => (
                      <SelectItem key={age} value={age}>{age}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            {error && (
              <div className="p-4 mb-6 bg-destructive/10 border border-destructive text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}

            {filteredReports.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground font-medium">No se encontraron mascotas con los filtros aplicados.</p>
                <Button variant="link" onClick={handleResetFilters} className="mt-2">
                  Restablecer todos los filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredReports.map((report) => (
                  <Card key={report.id} className="overflow-hidden flex flex-col justify-between">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={report.status === 'extraviado' ? 'destructive' : 'secondary'}>
                          {report.status === 'extraviado' ? 'Extraviado' : 'Encontrado'}
                        </Badge>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded capitalize">
                          {report.ageCategory || report.age_category || 'N/A'}
                        </span>
                      </div>
                      <CardTitle className="text-xl capitalize">{report.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {report.description}
                      </p>
                      
                      <div className="space-y-1.5 pt-2 border-t text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">Color:</span> {report.color}
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                          <span>{report.lastSeenLocation || report.last_seen_location || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span>{formatDate(report.lastSeenDate || report.last_seen_date)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}