'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ReportForm } from '@/components/report-form';

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

export default function CreateReportPage() {
  const router = useRouter();
  const [userCity, setUserCity] = useState<string>('');
  const [userCountry, setUserCountry] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const payload = parseJwt(token);
    
    setUserCity(payload?.city || '');
    setUserCountry(payload?.country || '');
    setUserId(payload?.id || payload?.sub || '');
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Cargando...</div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Crear Nuevo Reporte</h1>
            <p className="text-muted-foreground">
              Completa el formulario para reportar una mascota perdida o encontrada.
              Nuestro sistema de coincidencias comenzará a trabajar automáticamente.
            </p>
          </div>

          <ReportForm userCity={userCity} userCountry={userCountry} userId={userId} />
        </div>
      </main>

      <Footer />
    </div>
  );
}