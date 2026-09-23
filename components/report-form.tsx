'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Send, Info } from 'lucide-react';

const COLORS = [
  'Negro',
  'Blanco',
  'Gris',
  'Marrón',
  'Dorado',
  'Rojo',
  'Blanco con Negro',
  'Blanco con Marrón',
  'Blanco con Gris',
  'Otro'
];

const AGE_CATEGORIES = ['Joven', 'Adulto', 'Viejo'];

interface ReportFormProps {
  userCountry?: string;
  userCity?: string;
  userId: string;
}

interface PetType {
  id: number;
  nameType: string;
  breed: string; 
}

function parseJwt(token: string): Record<string, any> | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function ReportForm({ 
  userCountry = 'Chile',
  userCity = '',
  userId
}: ReportFormProps) {
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [loadingTypes, setLoadingTypes] = useState<boolean>(true);
  const [status, setStatus] = useState<'extraviado' | 'encontrado'>('extraviado');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [petName, setPetName] = useState<string>('');
  const [selectedAge, setSelectedAge] = useState<string>('joven');
  const [selectedColor, setSelectedColor] = useState<string>('Negro');

  useEffect(() => {
    const loadPetTypes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api-bff/pets/pet-types', { 
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const typesArray = data.collection || []
          if (Array.isArray(typesArray)) {
            setPetTypes(typesArray);
            if (typesArray.length > 0) setSelectedTypeId(typesArray[0].id.toString());
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTypes(false);
      }
    };

    loadPetTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const approximateAddress = formData.get('lastSeenLocation') as string;
    
    const locationParts = [userCountry, userCity, approximateAddress].filter(
      part => part && part.trim() !== '' && part !== 'Tu ciudad'
    );
    const fullLocation = locationParts.join(', ');

    try {
      const token = localStorage.getItem('token');
      let finalUserId: number = Number(userId);

      if (!finalUserId || isNaN(finalUserId) || finalUserId === 1) {
        if (token) {
          const payload = parseJwt(token);
          const email = payload?.sub || payload?.email;
          if (email) {
            const userResponse = await fetch(`/api-bff/users/profile?email=${encodeURIComponent(email)}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            if (userResponse.ok) {
              const userData = await userResponse.json();
              if (userData && userData.id) {
                finalUserId = Number(userData.id);
              }
            }
          }
        }
      }

      if (!finalUserId || isNaN(finalUserId)) {
        finalUserId = 1;
      }

      const reportPayload = {
        name: petName || 'Desconocido',
        ageCategory: selectedAge, 
        typeId: Number(selectedTypeId), 
        userId: finalUserId, 
        lastSeenLocation: fullLocation, 
        lastSeenDate: `${formData.get('lastSeenDate')}T12:00:00.000Z`,
        color: selectedColor, 
        description: (formData.get('description') as string) || 'Sin descripción',
        status: status,
      };

      const response = await fetch('/api-bff/pets', { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportPayload)
      });

      if (!response.ok) {
        let message = 'Error creating report';
        try {
          const err = await response.json();
          message = err.message || message;
        } catch {}
        throw new Error(message);
      }

      setSuccess('Report successfully submitted.');
      formElement.reset();
      setPetName('');
    } catch (err: any) {
      setError(err.message || 'Error sending report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFoundReport = status === 'encontrado';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={status} onValueChange={(v) => setStatus(v as 'extraviado' | 'encontrado')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="extraviado" className="gap-2">
            <span className="h-2 w-2 rounded-full bg-destructive" />
            Perdí mi mascota
          </TabsTrigger>
          <TabsTrigger value="encontrado" className="gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Encontré una mascota
          </TabsTrigger>
        </TabsList>

        <TabsContent value="extraviado" className="mt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Completa los datos de tu mascota perdida. Mientras más información proporciones, 
            mejor será la probabilidad de encontrar coincidencias.
          </p>
        </TabsContent>

        <TabsContent value="encontrado" className="mt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Has encontrado una mascota y quieres ayudar a reunirla con su dueño. 
            Ingresa los datos del animal que encontraste.
          </p>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Información de la Mascota</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="petName">Nombre de la mascota</Label>
              {isFoundReport && (
                <span className="text-xs text-muted-foreground bg-blue-50 px-2 py-1 rounded">
                  Opcional - Puedes poner "Desconocido"
                </span>
              )}
            </div>
            <Input
              id="petName"
              name="petName"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder={isFoundReport ? "Ej: Desconocido, Max, etc..." : "Ej: Max, Luna, Michi..."}
              required={!isFoundReport}
            />
            {isFoundReport && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Info className="h-3 w-3" />
                Si no sabes el nombre, escribe "Desconocido"
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="petType">Tipo y Raza de Mascota</Label>
              <Select 
                value={selectedTypeId} 
                onValueChange={setSelectedTypeId}
                disabled={loadingTypes}
              >
                <SelectTrigger id="petType">
                  <SelectValue placeholder={loadingTypes ? "Cargando categorías..." : "Selecciona tipo y raza"} />
                </SelectTrigger>
                <SelectContent>
                  {petTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.nameType} {type.breed ? ` - ${type.breed}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ageCategory">Categoría de Edad</Label>
              <Select name="ageCategory" value={selectedAge} onValueChange={setSelectedAge}>
                <SelectTrigger id="ageCategory">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AGE_CATEGORIES.map((age) => (
                    <SelectItem key={age} value={age.toLowerCase()}>
                      {age}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Select name="color" value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger id="color">
                  <SelectValue placeholder="Selecciona color" />
                </SelectTrigger>
                <SelectContent>
                  {COLORS.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              {isFoundReport ? 'Estado y Características' : 'Descripción y Características'}
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder={
                isFoundReport
                  ? "Describe el estado de la mascota al encontrarla:\n- ¿Tiene collar o identificación?\n- ¿Tiene heridas o signos de maltrato?\n- ¿Parece asustada o agresiva?\n- ¿Está desnutrida o enferma?\n- Otras características distintivas..."
                  : "Describe características distintivas: collar, cicatrices, comportamiento, allergies, etc."
              }
              rows={4}
              required
            />
            {isFoundReport && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Info className="h-3 w-3" />
                Incluye detalles sobre heridas, salud, comportamiento y cualquier identificación que veas
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Ubicación
          </CardTitle>
          <CardDescription>
            {status === 'extraviado'
              ? '¿Dónde viste a tu mascota por última vez?'
              : '¿Dónde encontraste a la mascota?'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lastSeenLocation">Dirección aproximada</Label>
            <Input
              id="lastSeenLocation"
              name="lastSeenLocation"
              placeholder="Ej: Av. Vicuña Mackenna 1234, block 3 o cerca de plaza central..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>País</Label>
              <Input
                value={userCountry || 'Chile'}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label>Ciudad</Label>
              <Input
                value={userCity || 'Tu ciudad'}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastSeenDate">
              {isFoundReport ? 'Fecha de encuentro' : 'Fecha que fue visto'}
            </Label>
            <Input
              id="lastSeenDate"
              name="lastSeenDate"
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-500/10 border border-green-500 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
        {isSubmitting ? (
          <>Enviando reporte...</>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Publicar Reporte
          </>
        )}
      </Button>
    </form>
  );
}